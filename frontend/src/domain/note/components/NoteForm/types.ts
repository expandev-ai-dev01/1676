import type { CreateNoteDto, UpdateNoteDto } from '../../types';

export interface NoteFormProps {
  initialData?: UpdateNoteDto & { idNote?: number };
  onSubmit: (data: CreateNoteDto | UpdateNoteDto) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}
