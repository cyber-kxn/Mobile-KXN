import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressState {
  xp: number;
  streak: number;
  lastActive: string | null;
  completedRooms: string[];
  /** roomId -> set of completed questionIds (stored as array). */
  solved: Record<string, string[]>;
  earnedBadges: string[];
  // actions
  solveQuestion: (roomId: string, questionId: string, points: number) => void;
  completeRoom: (roomId: string, xp: number) => void;
  awardBadge: (badgeId: string) => void;
  touchStreak: () => void;
  reset: () => void;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      xp: 0,
      streak: 0,
      lastActive: null,
      completedRooms: [],
      solved: {},
      earnedBadges: [],

      solveQuestion: (roomId, questionId, points) => {
        const solved = { ...get().solved };
        const list = new Set(solved[roomId] || []);
        if (list.has(questionId)) return; // already solved, no double XP
        list.add(questionId);
        solved[roomId] = [...list];
        set({ solved, xp: get().xp + points });
        get().touchStreak();
      },

      completeRoom: (roomId, xp) => {
        if (get().completedRooms.includes(roomId)) return;
        set({
          completedRooms: [...get().completedRooms, roomId],
          xp: get().xp + xp,
        });
        if (get().completedRooms.length === 1) get().awardBadge('b1');
      },

      awardBadge: (badgeId) => {
        if (get().earnedBadges.includes(badgeId)) return;
        set({ earnedBadges: [...get().earnedBadges, badgeId] });
      },

      touchStreak: () => {
        const today = todayKey();
        const last = get().lastActive;
        if (last === today) return;
        const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
        const nextStreak = last === yesterday ? get().streak + 1 : 1;
        set({ streak: nextStreak, lastActive: today });
        if (nextStreak >= 7) get().awardBadge('b4');
      },

      reset: () =>
        set({
          xp: 0,
          streak: 0,
          lastActive: null,
          completedRooms: [],
          solved: {},
          earnedBadges: [],
        }),
    }),
    { name: 'nethex.progress' },
  ),
);
