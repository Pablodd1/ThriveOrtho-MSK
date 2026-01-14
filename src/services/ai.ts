// AI Service (Gemini)

export async function analyzeJoints(geminiKey: string, prompt: string, imageBase64: string) {
  if (!geminiKey || geminiKey === 'YOUR_GEMINI_API_KEY') {
    return { mock: true, error: 'API Key not configured' };
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: prompt },
          { inline_data: { mime_type: 'image/jpeg', data: imageBase64 } }
        ]
      }],
      generationConfig: { temperature: 0.2 }
    })
  });

  return await response.json();
}

export async function analyzeText(geminiKey: string, prompt: string) {
  if (!geminiKey || geminiKey === 'YOUR_GEMINI_API_KEY') {
    return { mock: true, error: 'API Key not configured' };
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: { temperature: 0.3 }
    })
  });

  return await response.json();
}
