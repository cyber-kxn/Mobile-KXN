// ─── NETHEX content schema ───────────────────────────────────────────────
// Data-driven catalogue: Path → Module → Room → Task → Question.
// These types are mirrored by the API's Zod schemas and the /content JSON.

export type Difficulty = 'intro' | 'easy' | 'medium' | 'hard' | 'insane';

export type Track =
  | 'foundations'
  | 'offensive'
  | 'web'
  | 'privesc'
  | 'active-directory'
  | 'red-team'
  | 'defensive'
  | 'dfir'
  | 'cloud'
  | 'ai-security'
  | 'devsecops';

export type RoomKind = 'walkthrough' | 'challenge' | 'ctf' | 'network';

export interface QuestionAnswer {
  id: string;
  prompt: string;
  /** Hint shown on demand (never the answer). */
  hint?: string;
  /** Free-text answer kind; real validation is server-side via hash. */
  kind: 'flag' | 'text' | 'numeric' | 'no-answer';
  /** Salted SHA-256 hash of the canonical answer (client never sees plaintext). */
  answerHash?: string;
  points: number;
}

export interface Task {
  id: string;
  title: string;
  /** MDX/markdown body for the task brief. */
  body: string;
  questions: QuestionAnswer[];
  /** Optional command suggestions surfaced in the terminal helper rail. */
  suggestedCommands?: { label: string; cmd: string }[];
}

export interface LabProfile {
  id: string;
  /** Human label, e.g. "Kali attacker + 2 targets". */
  name: string;
  /** Container images that make up the topology. */
  nodes: { hostname: string; image: string; role: 'attacker' | 'target' | 'pivot' }[];
  /** TTL in seconds before automatic teardown. */
  ttlSeconds: number;
  /** Egress policy — "none" = fully isolated (default & recommended). */
  egress: 'none' | 'internal';
}

export interface Room {
  id: string;
  slug: string;
  title: string;
  summary: string;
  kind: RoomKind;
  track: Track;
  difficulty: Difficulty;
  /** Total XP awarded for full completion. */
  xp: number;
  estMinutes: number;
  tags: string[];
  tasks: Task[];
  lab?: LabProfile;
  author: string;
  updated: string;
}

export interface Module {
  id: string;
  title: string;
  summary: string;
  roomIds: string[];
}

export interface LearningPath {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  track: Track;
  difficulty: Difficulty;
  estHours: number;
  /** Tailwind gradient classes for the path hero card. */
  accent: string;
  icon: string;
  modules: Module[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface LeaderboardEntry {
  rank: number;
  handle: string;
  xp: number;
  streak: number;
  country: string;
}
