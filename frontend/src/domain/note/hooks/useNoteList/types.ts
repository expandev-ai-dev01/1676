import type { Note, NoteListParams } from '../../types';

export interface UseNoteListOptions {
  filters?: NoteListParams;
}

export interface UseNoteListReturn {
  notes: Note[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}
