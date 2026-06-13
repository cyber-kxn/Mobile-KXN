import { apiFetch } from '@/lib/api';
import type { Room, Task } from '@/lib/types';

export interface MentorMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type MentorMode = 'hint' | 'explain' | 'quiz';

// Deterministic local fallback so the mentor never hard-fails offline.
function localStub(mode: MentorMode, room: Room, task?: Task, q?: string): string {
  if (mode === 'hint') {
    const hint = task?.questions.find((x) => x.hint)?.hint;
    return (
      `Here's a nudge for **${task?.title || room.title}** without spoiling it:\n\n` +
      `${hint || 'Re-read the task brief and list every input or capability you control. The intended path almost always starts from something you already enumerated.'}\n\n` +
      `Try the suggested commands in the helper rail, then tell me what output you got and I'll point you at the next step.`
    );
  }
  if (mode === 'explain') {
    return (
      `**Concept primer for ${room.title}**\n\n` +
      `This room sits in the *${room.track}* track at *${room.difficulty}* difficulty. ` +
      `The core idea: ${room.summary}\n\n` +
      `Mental model — think in three beats: (1) enumerate the surface, (2) identify the misconfiguration or vuln class, (3) weaponize it into access or information. ` +
      `Ask me to "explain ${room.tags[0]}" for a deeper dive.`
    );
  }
  // quiz
  return (
    `Quick check on **${room.tags[0] || room.track}**:\n\n` +
    `1. In one sentence, what is the *root cause* that makes this class of attack possible?\n` +
    `2. What single control would most cheaply mitigate it?\n\n` +
    `Reply with your answers and I'll grade them.` +
    (q ? `\n\n_(You asked: ${q})_` : '')
  );
}

export async function askMentor(
  mode: MentorMode,
  room: Room,
  history: MentorMessage[],
  task?: Task,
  userText?: string,
): Promise<string> {
  const res = await apiFetch<{ reply: string }>('/ai/mentor', {
    method: 'POST',
    body: JSON.stringify({
      mode,
      roomId: room.id,
      taskId: task?.id,
      history,
      message: userText,
    }),
  });
  if (res.online && res.data?.reply) return res.data.reply;
  return localStub(mode, room, task, userText);
}
