import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNoteList, useNoteDelete, NoteCard, type Note } from '@/domain';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import { ErrorMessage } from '@/core/components/ErrorMessage';
import type { NotesPageProps } from './types';

/**
 * @page NotesPage
 * @summary Notes list page displaying all notes with CRUD operations
 * @domain note
 * @type list-page
 * @category note-management
 */
export const NotesPage = (props: NotesPageProps) => {
  const navigate = useNavigate();
  const [filterCor, setFilterCor] = useState<string>('todas');
  const [orderBy, setOrderBy] = useState<'dateCreated' | 'dateModified' | 'titulo'>('dateModified');
  const [direction, setDirection] = useState<'asc' | 'desc'>('desc');

  const { notes, isLoading, error, refetch } = useNoteList({
    filters: {
      filterCor: filterCor === 'todas' ? undefined : filterCor,
      orderBy,
      direction,
    },
  });

  const { deleteNote, isDeleting } = useNoteDelete();

  const handleCreate = () => {
    navigate('/notes/new');
  };

  const handleEdit = (id: number) => {
    navigate(`/notes/${id}/edit`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta nota?')) {
      try {
        await deleteNote(id);
        refetch();
      } catch (error: unknown) {
        console.error('Failed to delete note:', error);
      }
    }
  };

  const handleView = (id: number) => {
    navigate(`/notes/${id}`);
  };

  if (error) {
    return (
      <ErrorMessage
        title="Erro ao carregar notas"
        message={error.message}
        onRetry={() => refetch()}
      />
    );
  }

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Minhas Notas</h1>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Nova Nota
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label htmlFor="filterCor" className="block text-sm font-medium text-gray-700 mb-1">
                Filtrar por cor
              </label>
              <select
                id="filterCor"
                value={filterCor}
                onChange={(e) => setFilterCor(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todas">Todas</option>
                <option value="branco">Branco</option>
                <option value="amarelo">Amarelo</option>
                <option value="azul">Azul</option>
                <option value="verde">Verde</option>
                <option value="vermelho">Vermelho</option>
                <option value="roxo">Roxo</option>
              </select>
            </div>

            <div>
              <label htmlFor="orderBy" className="block text-sm font-medium text-gray-700 mb-1">
                Ordenar por
              </label>
              <select
                id="orderBy"
                value={orderBy}
                onChange={(e) => setOrderBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="dateModified">Data de modificação</option>
                <option value="dateCreated">Data de criação</option>
                <option value="titulo">Título</option>
              </select>
            </div>

            <div>
              <label htmlFor="direction" className="block text-sm font-medium text-gray-700 mb-1">
                Direção
              </label>
              <select
                id="direction"
                value={direction}
                onChange={(e) => setDirection(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">Decrescente</option>
                <option value="asc">Crescente</option>
              </select>
            </div>
          </div>
        </div>

        {notes && notes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">Nenhuma nota encontrada</p>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Criar primeira nota
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes?.map((note: Note) => (
              <NoteCard
                key={note.idNote}
                note={note}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onClick={handleView}
              />
            ))}
          </div>
        )}

        {isDeleting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPage;
