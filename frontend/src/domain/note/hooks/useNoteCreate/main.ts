import { useMutation, useQueryClient } from '@tanstack/react-query';
import { noteService } from '../../services/noteService';
import type { UseNoteCreateReturn } from './types';

/**
 * @hook useNoteCreate
 * @summary Hook for creating new notes
 * @domain note
 * @type domain-hook
 * @category mutation
 */
export const useNoteCreate = (): UseNoteCreateReturn => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: noteService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  return {
    create: mutateAsync,
    isCreating: isPending,
    error: error as Error | null,
  };
};
