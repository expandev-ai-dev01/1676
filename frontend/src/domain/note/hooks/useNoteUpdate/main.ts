import { useMutation, useQueryClient } from '@tanstack/react-query';
import { noteService } from '../../services/noteService';
import type { UseNoteUpdateReturn } from './types';

/**
 * @hook useNoteUpdate
 * @summary Hook for updating existing notes
 * @domain note
 * @type domain-hook
 * @category mutation
 */
export const useNoteUpdate = (): UseNoteUpdateReturn => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => noteService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['note'] });
    },
  });

  return {
    update: (id, data) => mutateAsync({ id, data }),
    isUpdating: isPending,
    error: error as Error | null,
  };
};
