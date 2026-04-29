async function callProxy(body) {
  const res = await fetch('/api/analyze-food', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    const err = new Error(data.error || 'Something went wrong. Please try again.');
    if (data.retryAfter) {
      err.retryAfter = data.retryAfter;
    }
    throw err;
  }

  return data;
}

export async function analyzeTextMeal(description) {
  return callProxy({ mode: 'text', description });
}

export async function analyzeImageMeal(base64Data, mimeType, note) {
  return callProxy({ mode: 'image', imageData: base64Data, mimeType, note });
}

export function imageFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const base64 = result.split(',')[1];
      resolve({ base64, mimeType: file.type });
    };
    reader.onerror = () => reject(new Error('Could not read image file.'));
    reader.readAsDataURL(file);
  });
}
