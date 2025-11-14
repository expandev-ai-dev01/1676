import { useQuery } from '@tanstack/react-query';
import { colorService } from '../../services/colorService';
import type { UseColorStatsReturn } from './types';

/**
 * @hook useColorStats
 * @summary Hook for fetching color statistics
 * @domain color
 * @type domain-hook
 * @category data
 */
export const useColorStats = (): UseColorStatsReturn => {
  const queryKey = ['color-stats'];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: () => colorService.stats(),
    staleTime: 2 * 60 * 1000,
  });

  return {
    stats: data,
    isLoading,
    error: error as Error | null,
    refetch,
  };
};
