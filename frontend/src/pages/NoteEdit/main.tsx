import { useParams, useNavigate } from 'react-router-dom';
import { useNoteDetail, useNoteUpdate, NoteForm } from '@/domain';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import { ErrorMessage } from '@/core/components/ErrorMessage';
import type { NoteEditPageProps } from './types';
import type { UpdateNoteDto } from '@/domain';

/**
 * @page NoteEditPage
 * @summary Page for editing existing notes
 * @domain note
 * @type form-page
 * @category note-management
 */
export const NoteEditPage = (props: NoteEditPageProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { note, isLoading, error } = useNoteDetail({ id: parseInt(id || '0') });
  const { update, isUpdating } = useNoteUpdate();

  const handleSubmit = async (data: UpdateNoteDto) => {
    try {
      await update(parseInt(id || '0'), data);
      navigate(`/notes/${id}`);
    } catch (error: unknown) {
      console.error('Failed to update note:', error);
    }
  };

  const handleCancel = () => {
    navigate(`/notes/${id}`);
  };

  if (error) {
    return (
      <ErrorMessage
        title="Erro ao carregar nota"
        message={error.message}
        onBack={() => navigate('/notes')}
      />
    );
  }

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  if (!note) {
    return (
      <ErrorMessage
        title="Nota não encontrada"
        message="A nota que você está tentando editar não existe ou foi removida."
        onBack={() => navigate('/notes')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button onClick={handleCancel} className="text-blue-600 hover:text-blue-800 font-medium">
            ← Voltar para nota
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Editar Nota</h1>
          <NoteForm
            initialData={{
              titulo: note.titulo,
              conteudo: note.conteudo,
              cor: note.cor,
            }}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isUpdating}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteEditPage;
