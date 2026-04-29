const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite'];

const NUTRITION_PROMPT = `You are a nutrition estimation assistant. Analyze the food described or shown and return a JSON array of food items with estimated nutrition.

Return ONLY a valid JSON array in this exact format:
[
  {
    "name": "Food name with portion (e.g. Grilled chicken breast, 6 oz)",
    "calories": 280,
    "protein": 52,
    "carbs": 0,
    "fat": 6
  }
]

Rules:
- Include every distinct food item or component as a separate entry
- Be specific about portion sizes in the name; assume a typical single serving if unclear
- Round all numbers to the nearest whole number
- Return ONLY the JSON array — no explanation, no markdown, no extra text

If the input is a recipe:
- Return one entry per ingredient, with the quantity used in the recipe
- If the recipe specifies a number of servings, divide each ingredient's nutrition by that number so values reflect one serving
- Include the serving count in each item name (e.g. "Olive oil, 1 tbsp (1 of 4 servings)")
- If no serving count is given, assume the full recipe is one serving`;

const ALLOWED_ORIGINS = [
  'https://www.freecalorietrack.com',
  'https://freecalorietrack.com',
  'http://localhost:5173',
  'https://localhost:5173',
  'http://localhost:4173',
  'https://localhost:4173',
];

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb',
    },
  },
};

function buildTextRequest(description) {
  return {
    contents: [{ parts: [{ text: `${NUTRITION_PROMPT}\n\nFood to analyze: ${description}` }] }],
    generationConfig: { response_mime_type: 'application/json', temperature: 0.1 },
  };
}

function buildImageRequest(base64Data, mimeType, note) {
  const text = note ? `${NUTRITION_PROMPT}\n\nAdditional context: ${note}` : NUTRITION_PROMPT;
  return {
    contents: [{
      parts: [
        { text },
        { inline_data: { mime_type: mimeType, data: base64Data } },
      ],
    }],
    generationConfig: { response_mime_type: 'application/json', temperature: 0.1 },
  };
}

async function callGeminiModel(model, body) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err?.error?.message || `API error ${res.status}`;
    if (res.status === 400 && msg.includes('not found')) {
      const e = new Error(msg); e.modelNotFound = true; throw e;
    }
    if (res.status === 429 || res.status === 503) {
      const retryMatch = msg.match(/retry in (\d+(?:\.\d+)?)s/i);
      const seconds = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : null;
      const busyErr = new Error(seconds
        ? `Gemini is busy — retrying in ${seconds} seconds.`
        : 'Gemini is busy right now. Please wait a moment and try again.');
      busyErr.retryAfter = seconds;
      busyErr.isBusy = !!seconds;
      throw busyErr;
    }
    throw new Error(msg);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No response from Gemini. Please try again.');

  try {
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('empty');
    return parsed.map(item => ({
      name: String(item.name || 'Unknown food').slice(0, 200),
      calories: Math.min(Math.max(Math.round(Number(item.calories) || 0), 0), 9999),
      protein: Math.min(Math.max(Math.round(Number(item.protein) || 0), 0), 999),
      carbs: Math.min(Math.max(Math.round(Number(item.carbs) || 0), 0), 999),
      fat: Math.min(Math.max(Math.round(Number(item.fat) || 0), 0), 999),
    }));
  } catch {
    throw new Error('Could not parse nutrition data. Try describing your meal differently.');
  }
}

async function callGemini(body) {
  let lastErr;
  for (let i = 0; i < GEMINI_MODELS.length; i++) {
    try {
      return await callGeminiModel(GEMINI_MODELS[i], body);
    } catch (err) {
      lastErr = err;
      if ((!err.isBusy && !err.modelNotFound) || i === GEMINI_MODELS.length - 1) throw err;
    }
  }
  throw lastErr;
}

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  const originAllowed = ALLOWED_ORIGINS.includes(origin);

  if (req.method === 'OPTIONS') {
    if (originAllowed) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'POST');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.setHeader('Access-Control-Max-Age', '86400');
    }
    return res.status(204).end();
  }

  if (!originAllowed) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  res.setHeader('Access-Control-Allow-Origin', origin);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { mode, description, imageData, mimeType, note } = req.body || {};

  if (mode === 'text') {
    if (!description || typeof description !== 'string') {
      return res.status(400).json({ error: 'Description is required.' });
    }
    if (description.length > 1000) {
      return res.status(400).json({ error: 'Description is too long — please keep it under 1000 characters.' });
    }
  } else if (mode === 'image') {
    if (!imageData || typeof imageData !== 'string') {
      return res.status(400).json({ error: 'Image data is required.' });
    }
    if (!mimeType || !mimeType.startsWith('image/')) {
      return res.status(400).json({ error: 'Invalid image type.' });
    }
    if (imageData.length > 6_000_000) {
      return res.status(400).json({ error: 'Image is too large — please use a smaller photo.' });
    }
  } else {
    return res.status(400).json({ error: 'Invalid mode.' });
  }

  if (note && (typeof note !== 'string' || note.length > 500)) {
    return res.status(400).json({ error: 'Note is too long.' });
  }

  try {
    const geminiBody = mode === 'text'
      ? buildTextRequest(description.trim())
      : buildImageRequest(imageData, mimeType, note?.trim() || null);

    const items = await callGemini(geminiBody);
    return res.status(200).json(items);
  } catch (err) {
    const status = err.retryAfter ? 503 : 502;
    return res.status(status).json({
      error: err.message || 'Something went wrong. Please try again.',
      retryAfter: err.retryAfter || null,
    });
  }
}
