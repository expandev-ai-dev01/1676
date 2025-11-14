import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useNoteDetail, useNoteDelete } from '@/domain';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import { ErrorMessage } from '@/core/components/ErrorMessage';
import type { NoteDetailPageProps } from './types';

/**
 * @page NoteDetailPage
 * @summary Note detail page displaying full note information with color
 * @domain note
 * @type detail-page
 * @category note-management
 */
export const NoteDetailPage = (props: NoteDetailPageProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { note, isLoading, error } = useNoteDetail({ id: parseInt(id || '0') });
  const { deleteNote, isDeleting } = useNoteDelete();

  const handleEdit = () => {
    navigate(`/notes/${id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir esta nota?')) {
      try {
        await deleteNote(parseInt(id || '0'));
        navigate('/notes');
      } catch (error: unknown) {
        console.error('Failed to delete note:', error);
      }
    }
  };

  const handleBack = () => {
    navigate('/notes');
  };

  if (error) {
    return (
      <ErrorMessage title="Erro ao carregar nota" message={error.message} onBack={handleBack} />
    );
  }

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  if (!note) {
    return (
      <ErrorMessage
        title="Nota não encontrada"
        message="A nota solicitada não existe ou foi removida."
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button onClick={handleBack} className="text-blue-600 hover:text-blue-800 font-medium">
            ← Voltar para lista
          </button>
        </div>

        <div
          className="bg-white rounded-lg shadow-sm p-6 border-l-4"
          style={{ borderLeftColor: note.colorHex }}
        >
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{note.titulo}</h1>
            <div className="flex gap-3">
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Editar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                disabled={isDeleting}
              >
                {isDeleting ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <span
              className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: note.colorHex }}
            >
              {note.colorName}
            </span>
          </div>

          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 whitespace-pre-wrap">{note.conteudo}</p>
          </div>

          <div className="border-t pt-4 text-sm text-gray-500">
            <p>Criado em: {format(new Date(note.dateCreated), 'dd/MM/yyyy HH:mm')}</p>
            <p>Última modificação: {format(new Date(note.dateModified), 'dd/MM/yyyy HH:mm')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailPage;
