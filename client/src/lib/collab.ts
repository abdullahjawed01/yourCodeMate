import type { CollabUser } from './yjsMonacoBinding';

/** Vivid, readable cursor colors with good contrast on dark + light editors. */
const COLLAB_COLORS = [
  '#22d3ee', // cyan
  '#a78bfa', // violet
  '#f472b6', // pink
  '#34d399', // emerald
  '#fbbf24', // amber
  '#60a5fa', // blue
  '#fb7185', // rose
  '#4ade80', // green
  '#e879f9', // fuchsia
  '#fcd34d', // yellow
];

export function pickCollabColor(): string {
  return COLLAB_COLORS[Math.floor(Math.random() * COLLAB_COLORS.length)];
}

/** Short, URL-safe, human-pronounceable room id. */
export function generateRoomId(): string {
  const adjectives = ['swift', 'brave', 'cosmic', 'lunar', 'nova', 'pixel', 'quantum', 'hyper', 'turbo', 'zen'];
  const nouns = ['fox', 'byte', 'comet', 'lambda', 'cipher', 'vector', 'pulse', 'falcon', 'matrix', 'photon'];
  const a = adjectives[Math.floor(Math.random() * adjectives.length)];
  const n = nouns[Math.floor(Math.random() * nouns.length)];
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${a}-${n}-${suffix}`;
}

export function makeIdentity(name?: string | null): CollabUser {
  return {
    name: name?.trim() || `Guest-${Math.random().toString(36).slice(2, 5)}`,
    color: pickCollabColor(),
  };
}

export type { CollabUser };
