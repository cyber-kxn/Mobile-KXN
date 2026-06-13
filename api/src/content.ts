import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { config } from './config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = resolve(__dirname, '../../content');

export function hashAnswer(answer: string): string {
  return (
    'sha256:' +
    createHash('sha256')
      .update(config.flagSalt + ':' + answer.trim().toLowerCase())
      .digest('hex')
  );
}

let catalog: unknown = null;
let answerHashes: Record<string, string> = {};

export async function loadContent(log: (m: string) => void): Promise<void> {
  try {
    const raw = await readFile(resolve(CONTENT_DIR, 'catalog.json'), 'utf8');
    catalog = JSON.parse(raw);
    log('[content] loaded catalog.json');
  } catch (e) {
    log(`[content] catalog.json missing (${(e as Error).message}) — serving empty catalog.`);
    catalog = { paths: [], rooms: [] };
  }
  try {
    const raw = await readFile(resolve(CONTENT_DIR, 'answers.json'), 'utf8');
    const answers = JSON.parse(raw) as Record<string, string>;
    answerHashes = Object.fromEntries(
      Object.entries(answers).map(([k, v]) => [k, hashAnswer(v)]),
    );
    log(`[content] loaded ${Object.keys(answerHashes).length} answer hashes (server-side only).`);
  } catch (e) {
    log(`[content] answers.json missing (${(e as Error).message}) — flags validate in mock mode.`);
    answerHashes = {};
  }
}

export function getCatalog(): unknown {
  return catalog;
}

/** Validate an answer against the server-side hash. Never returns the answer. */
export function checkAnswer(
  roomId: string,
  questionId: string,
  answer: string,
): { correct: boolean; known: boolean } {
  const key = `${roomId}:${questionId}`;
  const expected = answerHashes[key];
  if (!expected) {
    // Unknown flag (content not seeded): accept non-trivial input in mock mode.
    return { correct: answer.trim().length >= 2, known: false };
  }
  return { correct: hashAnswer(answer) === expected, known: true };
}
