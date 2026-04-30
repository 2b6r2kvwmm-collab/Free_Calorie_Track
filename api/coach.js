const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite'];

const COACH_PROMPT = `You are a supportive nutrition coach analyzing a user's food logs from the past week. Based on their actual logged data and personal goals, provide personalized, specific insights.

Return ONLY a valid JSON object in this exact format:
{
  "whatsWorking": ["insight-first observation supported by a number", "another win"],
  "needsAttention": ["observation-first insight with supporting number"],
  "thisTry": ["concrete actionable tip", "another concrete tip", "a third tip"],
  "trajectory": "One honest, plain-language sentence on where they are headed."
}

Rules:
- Lead each bullet with the *insight or implication*, then support it with a number — not the other way around. Bad: "Your average protein was 142g vs your 150g goal." Good: "Protein is nearly on point — you're averaging 142g, just 8g short of your 150g target."
- Keep each bullet to 1–2 sentences max. No lists within bullets.
- Use plain language: "calories" not "kcal", say "your goal" not "your 2062 kcal target"
- Don't open a bullet with "Your average..." — lead with an observation or what it means for the user
- Avoid naming multiple raw numbers in the same sentence — pick the one that best makes the point
- "needsAttention" may be an empty array [] if the user is genuinely on track — do NOT manufacture problems
- "whatsWorking" must always have at least one real, specific entry — find something to celebrate
- "thisTry" must be concrete and specific — never generic advice like "eat more protein" without context
- Exercise burns are estimates only (±20%) and the body partially compensates — use them as activity context (e.g. "you were active 4 of 7 days") not as exact calorie offsets
- If fewer than 7 days are logged, base insights only on what's available and note this in trajectory
- Tone: like a knowledgeable, encouraging friend — honest but never preachy or clinical
- Return ONLY the JSON object — no explanation, no markdown, no extra text`;

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
      sizeLimit: '1mb',
    },
  },
};

function friendlyDayLabel(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today - date) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

function buildCoachRequest(profile, logs) {
  const userContext = `
User profile:
- Goal: ${profile.goal || 'not specified'}
- Daily calorie target: ${profile.calorieGoal || 'not specified'} calories
- Protein target: ${profile.proteinTarget || 'not specified'}g
- Carb target: ${profile.carbTarget || 'not specified'}g
- Fat target: ${profile.fatTarget || 'not specified'}g
- Activity level: ${profile.activityLevel || 'not specified'}
- Age: ${profile.age || 'not specified'}, Weight: ${profile.weight || 'not specified'} ${profile.units === 'metric' ? 'kg' : 'lbs'}

Food logs for the last 7 days (${logs.length} day${logs.length !== 1 ? 's' : ''} logged):
${logs.map(day => {
    const exercisePart = day.caloriesBurned > 0
      ? ` | Exercise: ${day.caloriesBurned} cal burned (${day.exercises.slice(0, 4).join(', ')}${day.exercises.length > 4 ? ` +${day.exercises.length - 4} more` : ''})`
      : '';
    return `${friendlyDayLabel(day.date)}: ${day.calories} cal eaten | ${day.protein}g protein | ${day.carbs}g carbs | ${day.fat}g fat${exercisePart} | Foods: ${day.foods.slice(0, 8).join(', ')}${day.foods.length > 8 ? ` +${day.foods.length - 8} more` : ''}`;
  }).join('\n')}`.trim();

  return {
    contents: [{ parts: [{ text: `${COACH_PROMPT}\n\n${userContext}` }] }],
    generationConfig: { response_mime_type: 'application/json', temperature: 0.4 },
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
      const busyErr = new Error('Gemini is busy right now. Please try again in a moment.');
      busyErr.isBusy = true;
      throw busyErr;
    }
    throw new Error(msg);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No response from Gemini. Please try again.');

  try {
    let jsonText = text.trim();
    const codeBlock = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlock) jsonText = codeBlock[1].trim();
    const parsed = JSON.parse(jsonText);
    if (!parsed.whatsWorking || !parsed.thisTry || !parsed.trajectory) throw new Error('invalid');
    return {
      whatsWorking: Array.isArray(parsed.whatsWorking) ? parsed.whatsWorking.slice(0, 4).map(s => String(s)) : [],
      needsAttention: Array.isArray(parsed.needsAttention) ? parsed.needsAttention.slice(0, 3).map(s => String(s)) : [],
      thisTry: Array.isArray(parsed.thisTry) ? parsed.thisTry.slice(0, 4).map(s => String(s)) : [],
      trajectory: String(parsed.trajectory || '').slice(0, 400),
    };
  } catch {
    throw new Error('Could not parse coaching response. Please try again.');
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
  const isProduction = process.env.VERCEL_ENV === 'production';
  const effectivelyAllowed = originAllowed || (!isProduction && origin.endsWith('.vercel.app'));

  if (req.method === 'OPTIONS') {
    if (effectivelyAllowed) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'POST');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.setHeader('Access-Control-Max-Age', '86400');
    }
    return res.status(204).end();
  }

  if (!effectivelyAllowed) return res.status(403).json({ error: 'Forbidden' });
  res.setHeader('Access-Control-Allow-Origin', origin);
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { profile, logs } = req.body || {};

  if (!profile || typeof profile !== 'object') {
    return res.status(400).json({ error: 'Profile is required.' });
  }
  if (!Array.isArray(logs) || logs.length < 1) {
    return res.status(400).json({ error: 'At least one day of logs is required.' });
  }
  if (logs.length > 7) {
    return res.status(400).json({ error: 'Maximum 7 days of logs.' });
  }

  try {
    const result = await callGemini(buildCoachRequest(profile, logs));
    return res.status(200).json(result);
  } catch (err) {
    return res.status(502).json({ error: err.message || 'Something went wrong. Please try again.' });
  }
}
