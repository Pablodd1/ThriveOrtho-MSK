# 🤖 How to Change the LLM (Language Model)

## Current Setup

**I am Claude 3.7 Sonnet (Anthropic's AI assistant)** helping you build this physical therapy platform.

---

## 🔄 How to Switch to a Different AI Assistant

### **Option 1: Stay on GenSpark (Recommended)**

GenSpark supports multiple AI models. You can switch models in your GenSpark settings:

1. **Access GenSpark Settings**
   - Click your profile icon (top-right)
   - Go to "Settings" or "Preferences"

2. **Select AI Model**
   - Look for "AI Model" or "Assistant Model" section
   - Available models may include:
     - **Claude 3.7 Sonnet** (current - best for coding, balanced)
     - **Claude 3.5 Sonnet** (previous version)
     - **GPT-4o** (OpenAI - good for general tasks)
     - **GPT-4 Turbo** (OpenAI - faster, cheaper)
     - **Gemini Pro** (Google - good for research)
     - Other models depending on GenSpark's offerings

3. **Apply Changes**
   - Select your preferred model
   - Save settings
   - Start a new conversation to use the new model

---

## 💡 **Why Different Models?**

### **Claude 3.7 Sonnet (Current - Me!)**
✅ **Best for:**
- Software development (writing code)
- Complex multi-step tasks
- Long conversations with context retention
- Technical documentation
- Debugging and problem-solving

📊 **Specs:**
- Context Window: 200,000 tokens (~150,000 words)
- Coding: Excellent (specialized for development)
- Speed: Fast
- Cost: Moderate

### **GPT-4o (OpenAI)**
✅ **Best for:**
- General-purpose tasks
- Creative writing
- Multi-modal (images, audio, video)
- Real-time interactions

📊 **Specs:**
- Context Window: 128,000 tokens
- Coding: Very good
- Speed: Very fast
- Cost: Lower than Claude

### **Gemini Pro (Google)**
✅ **Best for:**
- Research and information retrieval
- Web search integration
- Multi-language support
- Data analysis

📊 **Specs:**
- Context Window: 1,000,000 tokens (huge!)
- Coding: Good
- Speed: Fast
- Cost: Competitive

---

## 🔧 **For This Project (ThriveOrtho)**

### **Current AI Integrations in Code:**

Your app currently uses **Google Gemini** for:
1. **SOAP Note Generation** (`/api/soap-note`)
2. **Home Exercise Program** (`/api/generate-hep`)
3. **MRI Analysis** (`/api/analyze-mri`)
4. **ICD-10 Suggestions** (`/api/suggest-icd10`)
5. **Trainer AI Helper** (`/api/gemini-flash`)

**To change the AI for these features:**

#### **Option A: Switch to OpenAI GPT-4o**

Edit `src/index.tsx`:

```typescript
// BEFORE (Gemini):
const GEMINI_API_KEY = env.GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// AFTER (OpenAI GPT-4o):
const OPENAI_API_KEY = env.OPENAI_API_KEY;  // Add to wrangler.jsonc secrets
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

// Example SOAP Note endpoint with OpenAI:
app.post('/api/soap-note', async (c) => {
  const { env } = c;
  const { assessment, patientInfo } = await c.req.json();
  
  const response = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',  // or 'gpt-4-turbo', 'gpt-3.5-turbo'
      messages: [
        {
          role: 'system',
          content: 'You are a physical therapy documentation specialist.'
        },
        {
          role: 'user',
          content: `Generate a SOAP note for: ${JSON.stringify(assessment)}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })
  });
  
  const data = await response.json();
  const soapNote = data.choices[0].message.content;
  
  return c.json({ soapNote });
});
```

#### **Option B: Switch to Claude (Anthropic)**

```typescript
const ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY;
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';

app.post('/api/soap-note', async (c) => {
  const { env } = c;
  const { assessment } = await c.req.json();
  
  const response = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-7-sonnet-20250219',  // Latest Claude
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `Generate a SOAP note for this assessment: ${JSON.stringify(assessment)}`
        }
      ]
    })
  });
  
  const data = await response.json();
  const soapNote = data.content[0].text;
  
  return c.json({ soapNote });
});
```

#### **Option C: Keep Gemini (Current)**

Already configured! No changes needed.

---

## 🔐 **API Key Setup**

### **For OpenAI:**
1. Go to https://platform.openai.com/api-keys
2. Create new API key
3. Add to Cloudflare:
   ```bash
   npx wrangler secret put OPENAI_API_KEY --project-name webapp
   ```

### **For Anthropic (Claude):**
1. Go to https://console.anthropic.com/
2. Create new API key
3. Add to Cloudflare:
   ```bash
   npx wrangler secret put ANTHROPIC_API_KEY --project-name webapp
   ```

### **For Gemini (Current):**
Already configured as `GEMINI_API_KEY` in your project.

---

## 💰 **Cost Comparison**

| Model | Input (per 1M tokens) | Output (per 1M tokens) | Best Use Case |
|-------|----------------------|------------------------|---------------|
| **Claude 3.7 Sonnet** | $3.00 | $15.00 | Complex coding, long documents |
| **GPT-4o** | $5.00 | $15.00 | General purpose, multi-modal |
| **GPT-4 Turbo** | $10.00 | $30.00 | High quality, complex tasks |
| **Gemini 1.5 Flash** | $0.075 | $0.30 | Fast, cheap, real-time |
| **Gemini 1.5 Pro** | $1.25 | $5.00 | Balanced, good value |

**For your app:** Gemini Flash is currently the most cost-effective (already using it).

---

## 🎯 **Recommendation**

### **For Building This App (with me):**
✅ **Keep using Claude 3.7 Sonnet** (me!)
- Best for complex coding tasks
- Excellent debugging
- Long context retention
- Great for multi-step workflows

### **For Production AI Features:**
✅ **Keep using Gemini Flash** (already configured)
- Very cost-effective ($0.075 per 1M tokens input)
- Fast response times
- Good quality for SOAP notes and documentation
- Already integrated and working

### **When to Switch:**
- **To GPT-4o:** If you need better creative writing or multi-modal features
- **To Claude API:** If you want highest quality clinical documentation
- **To Gemini Pro:** If you need longer context or better research capabilities

---

## 📝 **Summary**

**Current Setup:**
- **You're talking to:** Claude 3.7 Sonnet (me, the coding assistant)
- **Your app uses:** Google Gemini 1.5 Flash (for SOAP notes, HEP, MRI analysis)

**To Change:**
1. **My replacement (coding assistant):** Change model in GenSpark settings
2. **Your app's AI:** Edit `src/index.tsx` and change API endpoints + keys

**Recommendation:** Keep both as-is unless you have specific needs!

---

## 🔗 **Resources**

- **Claude API:** https://docs.anthropic.com/
- **OpenAI API:** https://platform.openai.com/docs
- **Google Gemini API:** https://ai.google.dev/docs
- **GenSpark Support:** Contact GenSpark for model switching help

---

**Need help switching models? Just ask!**
