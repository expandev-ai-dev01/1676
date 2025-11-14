import type { UpdateNoteDto } from '../../types';

export interface UseNoteUpdateReturn {
  update: (id: number, data: UpdateNoteDto) => Promise<{ idNote: number }>;
  isUpdating: boolean;
  error: Error | null;
}
