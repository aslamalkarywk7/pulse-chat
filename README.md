# PulseChat — Real-Time Chat with AI Smart Reply

[![CI](https://github.com/aslamalkarywk7/pulse-chat/actions/workflows/ci.yml/badge.svg)](https://github.com/aslamalkarywk7/pulse-chat/actions/workflows/ci.yml)

> **Real-Time Chat Application** — محادثة فورية بغرف + حالة Online + مؤشر كتابة + مساعد ذكي يقترح ردودًا.

## ماذا ستتعلم من هذا المشروع؟

- **Real-Time:** WebSockets / Supabase Realtime (Free tier) — بث فوري بدون Polling
- **AI-powered:** اقتراحات ردود ذكية (Smart Reply) بـ MasryGPT / HF API
- **UI/UX:** Typing Indicator + Online Status + Message Reactions
- **Auth:** Supabase Auth + RLS (Row Level Security)

## Stack

```
Next.js 14 (App Router) + TypeScript
Supabase (Postgres + Realtime + Auth) — Free tier
Tailwind CSS
AI: HF Inference API (MasryGPT-Chat-1.5B) + Fallback
Testing: Vitest (unit) + Playwright (E2E)
```

## Quick Start

```bash
git clone https://github.com/aslamalkarywk7/pulse-chat.git
cd pulse-chat
npm install
cp .env.example .env.local
# أدخل SUPABASE_URL + SUPABASE_ANON_KEY + HF_API_TOKEN
npm run dev
```

## الميزات الرئيسية

| الميزة | الوصف |
|---|---|
| **Rooms** | غرف دردشة عامة + خاصة (DM) |
| **Live Presence** | من متصل الآن؟ (Presence channel) |
| **Typing** | «يكتب الآن...» — لحظي |
| **Smart Reply** | AI يقترح 3 ردود بناءً على السياق |
| **Reactions** | 👍 ❤️ 😂 — تفاعل فوري |
| **Moderation** | حذف + حظر + تقارير |

## قاعدة البيانات (Supabase)

```sql
create table rooms (id uuid primary key, name text, is_private boolean);
create table messages (id uuid primary key, room_id uuid, user_id uuid, body text, created_at timestamptz default now());
create table presence (room_id uuid, user_id uuid, online boolean, last_seen timestamptz);
```

## AI Smart Reply

```ts
// ai/smart-reply.ts — يقترح ردودًا بناءً على آخر رسائل
import { inference } from '@huggingface/hub'
export async function suggestReplies(history: string[]) {
  const prompt = `اقترح 3 ردود قصيرة على هذه المحادثة:\n${history.join('\n')}`
  const res = await inference.textGeneration({
    model: 'ISLAM-PO/MasryGPT-Chat-1.5B',
    inputs: prompt,
    parameters: { max_new_tokens: 80 }
  })
  return res.generated_text.split('\n').filter(Boolean).slice(0, 3)
}
```

## CI/CD

- برانش `main` — كل Push يمر بـ: lint → unit tests → build → deploy preview
- العمل: [.github/workflows/ci.yml](./.github/workflows/ci.yml)

## Live Demo

[https://pulse-chat.vercel.app](https://pulse-chat.vercel.app) — deploy مجاني

## License

MIT © Islam Al-Nashar
