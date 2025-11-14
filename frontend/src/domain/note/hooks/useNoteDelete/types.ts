export interface UseNoteDeleteReturn {
  deleteNote: (id: number) => Promise<void>;
  isDeleting: boolean;
  error: Error | null;
}
