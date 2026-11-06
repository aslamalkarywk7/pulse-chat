/**
 * Supabase Realtime helpers — Rooms, Presence, Typing
 *
 * Setup:
 *   1. Create project at https://supabase.com (free)
 *   2. Enable Realtime on `messages` and `presence`
 *   3. Copy URL + anon key to .env.local
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'

let browserClient: SupabaseClient | null = null

export function supabaseBrowser(): SupabaseClient {
  if (!browserClient) {
    browserClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return browserClient
}

export interface Message {
  id: string
  room_id: string
  user_id: string
  body: string
  created_at: string
}

export function subscribeToRoom(roomId: string, onMessage: (m: Message) => void) {
  const supabase = supabaseBrowser()
  return supabase
    .channel(`room:${roomId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `room_id=eq.${roomId}`
    }, payload => onMessage(payload.new as Message))
    .subscribe()
}

export function broadcastTyping(roomId: string, userId: string, state: boolean) {
  const supabase = supabaseBrowser()
  const ch = supabase.channel(`typing:${roomId}`)
  ch.send({ type: 'broadcast', event: 'typing', payload: { userId, state } })
}

export function subscribeTyping(roomId: string, onTyping: (userId: string, state: boolean) => void) {
  const supabase = supabaseBrowser()
  return supabase
    .channel(`typing:${roomId}`)
    .on('broadcast', { event: 'typing' }, payload => {
      const { userId, state } = payload.payload as { userId: string; state: boolean }
      onTyping(userId, state)
    })
    .subscribe()
}
