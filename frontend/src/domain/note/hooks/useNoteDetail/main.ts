import { useQuery } from '@tanstack/react-query';
import { noteService } from '../../services/noteService';
import type { UseNoteDetailOptions, UseNoteDetailReturn } from './types';

/**
 * @hook useNoteDetail
 * @summary Hook for fetching single note details
 * @domain note
 * @type domain-hook
 * @category data
 */
export const useNoteDetail = (options: UseNoteDetailOptions): UseNoteDetailReturn => {
  const { id } = options;

  const queryKey = ['note', id];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: () => noteService.getById(id),
    enabled: !!id,
  });

  return {
    note: data,
    isLoading,
    error: error as Error | null,
    refetch,
  };
};
