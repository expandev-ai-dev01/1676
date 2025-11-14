import { format } from 'date-fns';
import { getNoteCardClassName } from './variants';
import type { NoteCardProps } from './types';

/**
 * @component NoteCard
 * @summary Card component for displaying a note in list view
 * @domain note
 * @type domain-component
 * @category display
 */
export const NoteCard = ({ note, onEdit, onDelete, onClick }: NoteCardProps) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(note.idNote);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(note.idNote);
  };

  const handleClick = () => {
    onClick(note.idNote);
  };

  const previewContent =
    note.conteudo.length > 100 ? note.conteudo.substring(0, 100) + '...' : note.conteudo;

  return (
    <div
      className={getNoteCardClassName()}
      onClick={handleClick}
      style={{
        borderColor: note.colorHex,
        backgroundColor: `${note.colorHex}15`,
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900 flex-1">{note.titulo}</h3>
        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="mb-3">
        <span
          className="inline-block px-2 py-1 rounded text-xs font-medium"
          style={{
            backgroundColor: note.colorHex,
            color: '#ffffff',
          }}
        >
          {note.colorName}
        </span>
      </div>
      <p className="text-gray-700 mb-3 whitespace-pre-wrap">{previewContent}</p>
      <div className="text-xs text-gray-500">
        Updated: {format(new Date(note.dateModified), 'MMM dd, yyyy HH:mm')}
      </div>
    </div>
  );
};
