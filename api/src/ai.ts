import { config } from './config.js';

export interface MentorRequest {
  mode: 'hint' | 'explain' | 'quiz';
  roomId: string;
  taskId?: string;
  message?: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
  roomTitle?: string;
  roomTrack?: string;
}

// Guardrail: the mentor is scoped to defensive/educational training context only.
function systemPrompt(req: MentorRequest): string {
  return [
    `You are the NETHEX mentor, an instructor on an authorized cybersecurity training range.`,
    `All scenarios run inside ephemeral, egress-isolated lab containers the learner owns.`,
    `Help the learner reason about the current room "${req.roomTitle ?? req.roomId}" (track: ${req.roomTrack ?? 'general'}).`,
    `Mode = ${req.mode}.`,
    req.mode === 'hint'
      ? `Give a single nudge toward the next step. Never reveal flags or full exploit chains outright.`
      : req.mode === 'explain'
        ? `Explain the underlying concept clearly with a mental model.`
        : `Pose 2 short conceptual questions and offer to grade the learner's answers.`,
    `Stay strictly within this training context; refuse unrelated or real-world-targeted requests.`,
  ].join(' ');
}

/** Deterministic local fallback used when no API key is configured. */
function localFallback(req: MentorRequest): string {
  const t = req.roomTitle ?? 'this room';
  if (req.mode === 'hint')
    return `Nudge for ${t}: enumerate everything you control first, then map each finding to a known weakness in the ${req.roomTrack ?? 'target'} track. Share your latest command output and I'll point at the next move.`;
  if (req.mode === 'explain')
    return `Concept primer for ${t}: think enumerate → identify the vulnerable class → weaponize into access or info. The ${req.roomTrack ?? 'topic'} track hinges on spotting the misconfiguration that breaks an assumption.`;
  return `Quiz on ${t}: (1) What root cause enables this attack class? (2) What's the cheapest mitigating control? Reply and I'll grade you.`;
}

export async function mentorReply(req: MentorRequest): Promise<{ reply: string; source: 'anthropic' | 'fallback' }> {
  if (!config.anthropicKey) {
    return { reply: localFallback(req), source: 'fallback' };
  }
  try {
    const messages = [
      ...(req.history ?? []).slice(-8),
      { role: 'user' as const, content: req.message ?? `Give me a ${req.mode}.` },
    ];
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': config.anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: config.anthropicModel,
        max_tokens: 700,
        system: systemPrompt(req),
        messages,
      }),
    });
    if (!res.ok) throw new Error(`anthropic ${res.status}`);
    const data = (await res.json()) as { content: { type: string; text: string }[] };
    const reply = data.content?.filter((c) => c.type === 'text').map((c) => c.text).join('\n') || localFallback(req);
    return { reply, source: 'anthropic' };
  } catch {
    return { reply: localFallback(req), source: 'fallback' };
  }
}
