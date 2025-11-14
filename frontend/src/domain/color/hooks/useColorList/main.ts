import { useQuery } from '@tanstack/react-query';
import { colorService } from '../../services/colorService';
import type { UseColorListReturn } from './types';

/**
 * @hook useColorList
 * @summary Hook for fetching available colors
 * @domain color
 * @type domain-hook
 * @category data
 */
export const useColorList = (): UseColorListReturn => {
  const queryKey = ['colors'];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: () => colorService.list(),
    staleTime: 30 * 60 * 1000,
  });

  return {
    colors: data,
    isLoading,
    error: error as Error | null,
    refetch,
  };
};
