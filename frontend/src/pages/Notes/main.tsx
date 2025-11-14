import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNoteList, useNoteDelete, NoteCard, type Note } from '@/domain';
import { ColorFilter } from '@/domain/color/components/ColorFilter';
import { ColorStats } from '@/domain/color/components/ColorStats';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import { ErrorMessage } from '@/core/components/ErrorMessage';
import type { NotesPageProps } from './types';

/**
 * @page NotesPage
 * @summary Notes list page displaying all notes with CRUD operations and color filtering
 * @domain note
 * @type list-page
 * @category note-management
 */
export const NotesPage = (props: NotesPageProps) => {
  const navigate = useNavigate();
  const [selectedColorIds, setSelectedColorIds] = useState<number[]>([]);
  const [orderBy, setOrderBy] = useState<'dateCreated' | 'dateModified' | 'titulo'>('dateModified');
  const [direction, setDirection] = useState<'asc' | 'desc'>('desc');
  const [showStats, setShowStats] = useState(false);

  const filterColorIdsParam = selectedColorIds.length > 0 ? selectedColorIds.join(',') : undefined;

  const { notes, isLoading, error, refetch } = useNoteList({
    filters: {
      filterColorIds: filterColorIdsParam,
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

  const handleColorToggle = (colorId: number) => {
    setSelectedColorIds((prev) =>
      prev.includes(colorId) ? prev.filter((id) => id !== colorId) : [...prev, colorId]
    );
  };

  const handleClearFilters = () => {
    setSelectedColorIds([]);
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
          <div className="flex gap-3">
            <button
              onClick={() => setShowStats(!showStats)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {showStats ? 'Hide Stats' : 'Show Stats'}
            </button>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Nova Nota
            </button>
          </div>
        </div>

        {showStats && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <ColorStats />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="space-y-4">
            <ColorFilter
              selectedColorIds={selectedColorIds}
              onColorToggle={handleColorToggle}
              onClearFilters={handleClearFilters}
            />

            <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
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
        </div>

        {notes && notes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">
              {selectedColorIds.length > 0
                ? 'Nenhuma nota encontrada com as cores selecionadas'
                : 'Nenhuma nota encontrada'}
            </p>
            {selectedColorIds.length === 0 && (
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Criar primeira nota
              </button>
            )}
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
