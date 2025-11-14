import type { Color } from '../../types';

export interface UseColorListReturn {
  colors: Color[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}
