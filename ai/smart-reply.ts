/**
 * Smart Reply — AI-powered reply suggestions
 * Uses Hugging Face Inference API (MasryGPT-Chat-1.5B) with local fallback
 */

const HF_API_URL = 'https://api-inference.huggingface.co/models/ISLAM-PO/MasryGPT-Chat-1.5B'

export async function suggestReplies(history: string[], hfToken?: string): Promise<string[]> {
  if (!hfToken) {
    // Local fallback — simple heuristic suggestions
    return heuristicReplies(history)
  }

  try {
    const prompt = `اقترح 3 ردود قصيرة مناسبة لهذه المحادثة:\n${history.slice(-5).join('\n')}`
    const res = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hfToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 120 } })
    })
    const data = await res.json()
    const text = data[0]?.generated_text ?? ''
    return extractReplies(text)
  } catch {
    return heuristicReplies(history)
  }
}

function heuristicReplies(history: string[]): string[] {
  const last = history.at(-1)?.toLowerCase() ?? ''
  if (last.includes('?')) return ['آه، تمام', 'خلينا نراجع ده', 'ممكن توضح أكتر؟']
  if (last.includes('شكرا') || last.includes('thanks')) return ['العفو 🙏', 'على الرحب', 'أي وقت']
  return ['تمام!', 'فاهم عليك 👍', 'نتابع قريب']
}

function extractReplies(text: string): string[] {
  return text
    .split('\n')
    .map(s => s.replace(/^[-•\d.)\s]+/, '').trim())
    .filter(s => s.length > 1 && s.length < 80)
    .slice(0, 3)
}
