import { useNavigate } from 'react-router-dom';
import { useNoteCreate, NoteForm } from '@/domain';
import type { NoteCreatePageProps } from './types';
import type { CreateNoteDto } from '@/domain';

/**
 * @page NoteCreatePage
 * @summary Page for creating new notes
 * @domain note
 * @type form-page
 * @category note-management
 */
export const NoteCreatePage = (props: NoteCreatePageProps) => {
  const navigate = useNavigate();
  const { create, isCreating } = useNoteCreate();

  const handleSubmit = async (data: CreateNoteDto) => {
    try {
      const result = await create(data);
      navigate(`/notes/${result.idNote}`);
    } catch (error: unknown) {
      console.error('Failed to create note:', error);
    }
  };

  const handleCancel = () => {
    navigate('/notes');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button onClick={handleCancel} className="text-blue-600 hover:text-blue-800 font-medium">
            ← Voltar para lista
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Nova Nota</h1>
          <NoteForm onSubmit={handleSubmit} onCancel={handleCancel} isSubmitting={isCreating} />
        </div>
      </div>
    </div>
  );
};

export default NoteCreatePage;
