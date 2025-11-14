import type { Note } from '../../types';

export interface NoteCardProps {
  note: Note;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onClick: (id: number) => void;
}
