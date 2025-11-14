import type { Note } from '../../types';

export interface UseNoteDetailOptions {
  id: number;
}

export interface UseNoteDetailReturn {
  note: Note | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}
