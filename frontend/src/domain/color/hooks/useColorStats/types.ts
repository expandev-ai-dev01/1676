import type { ColorStats } from '../../types';

export interface UseColorStatsReturn {
  stats: ColorStats[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}
