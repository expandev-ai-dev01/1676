import { useQuery } from '@tanstack/react-query';
import { noteService } from '../../services/noteService';
import type { UseNoteListOptions, UseNoteListReturn } from './types';

/**
 * @hook useNoteList
 * @summary Hook for fetching and managing list of notes
 * @domain note
 * @type domain-hook
 * @category data
 */
export const useNoteList = (options: UseNoteListOptions = {}): UseNoteListReturn => {
  const { filters } = options;

  const queryKey = ['notes', filters];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: () => noteService.list(filters),
  });

  return {
    notes: data,
    isLoading,
    error: error as Error | null,
    refetch,
  };
};
