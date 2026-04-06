import { create } from "zustand";
import { Block, BlockType, BlockContent, DEFAULT_CONTENT } from "@/types/block";

const STORAGE_KEY = "page-builder-state";
const MAX_HISTORY = 50;

function generateId(): string {
  return crypto.randomUUID();
}

function loadBlocks(): Block[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveBlocks(blocks: Block[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
}

interface PageState {
  blocks: Block[];
  selectedBlockId: string | null;
  past: Block[][];
  future: Block[][];
  canUndo: boolean;
  canRedo: boolean;
  addBlock: (type: BlockType, index?: number) => void;
  removeBlock: (id: string) => void;
  updateBlockContent: (id: string, content: Partial<BlockContent>) => void;
  reorderBlocks: (activeId: string, overId: string) => void;
  selectBlock: (id: string | null) => void;
  undo: () => void;
  redo: () => void;
}

function pushHistory(past: Block[][], current: Block[]): Block[][] {
  const next = [...past, current];
  return next.length > MAX_HISTORY ? next.slice(next.length - MAX_HISTORY) : next;
}

export const usePageStore = create<PageState>((set, get) => ({
  blocks: loadBlocks(),
  selectedBlockId: null,
  past: [],
  future: [],
  canUndo: false,
  canRedo: false,

  addBlock: (type, index) => {
    const newBlock: Block = {
      id: generateId(),
      type,
      content: { ...DEFAULT_CONTENT[type] },
    };
    set((state) => {
      const past = pushHistory(state.past, state.blocks);
      const blocks =
        index !== undefined
          ? [...state.blocks.slice(0, index), newBlock, ...state.blocks.slice(index)]
          : [...state.blocks, newBlock];
      saveBlocks(blocks);
      return { blocks, past, future: [], canUndo: true, canRedo: false, selectedBlockId: newBlock.id };
    });
  },

  removeBlock: (id) =>
    set((state) => {
      const past = pushHistory(state.past, state.blocks);
      const blocks = state.blocks.filter((b) => b.id !== id);
      saveBlocks(blocks);
      return {
        blocks,
        past,
        future: [],
        canUndo: true,
        canRedo: false,
        selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId,
      };
    }),

  updateBlockContent: (id, content) =>
    set((state) => {
      const past = pushHistory(state.past, state.blocks);
      const blocks = state.blocks.map((b) =>
        b.id === id ? { ...b, content: { ...b.content, ...content } } : b
      );
      saveBlocks(blocks);
      return { blocks, past, future: [], canUndo: true, canRedo: false };
    }),

  reorderBlocks: (activeId, overId) =>
    set((state) => {
      const oldIndex = state.blocks.findIndex((b) => b.id === activeId);
      const newIndex = state.blocks.findIndex((b) => b.id === overId);
      if (oldIndex === -1 || newIndex === -1) return state;
      const past = pushHistory(state.past, state.blocks);
      const blocks = [...state.blocks];
      const [moved] = blocks.splice(oldIndex, 1);
      blocks.splice(newIndex, 0, moved);
      saveBlocks(blocks);
      return { blocks, past, future: [], canUndo: true, canRedo: false };
    }),

  selectBlock: (id) => set({ selectedBlockId: id }),

  undo: () =>
    set((state) => {
      if (state.past.length === 0) return state;
      const past = [...state.past];
      const previous = past.pop()!;
      const future = [state.blocks, ...state.future];
      saveBlocks(previous);
      return { blocks: previous, past, future, canUndo: past.length > 0, canRedo: true };
    }),

  redo: () =>
    set((state) => {
      if (state.future.length === 0) return state;
      const future = [...state.future];
      const next = future.shift()!;
      const past = pushHistory(state.past, state.blocks);
      saveBlocks(next);
      return { blocks: next, past, future, canUndo: true, canRedo: future.length > 0 };
    }),
}));
