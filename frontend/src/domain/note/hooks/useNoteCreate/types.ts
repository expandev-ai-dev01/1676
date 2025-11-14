import type { CreateNoteDto } from '../../types';

export interface UseNoteCreateReturn {
  create: (data: CreateNoteDto) => Promise<{ idNote: number }>;
  isCreating: boolean;
  error: Error | null;
}
