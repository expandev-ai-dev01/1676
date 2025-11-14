import { authenticatedClient } from '@/core/lib/api';
import type { Color, ColorStats } from '../types';
import type { ApiResponse } from '@/core/types';

/**
 * @service colorService
 * @summary Color management service for authenticated endpoints
 * @domain color
 * @type rest-service
 * @apiContext internal
 */
export const colorService = {
  /**
   * @endpoint GET /api/v1/internal/color
   * @summary Fetches list of available colors
   */
  async list(): Promise<Color[]> {
    const response = await authenticatedClient.get<ApiResponse<Color[]>>('/color');
    return response.data.data;
  },

  /**
   * @endpoint GET /api/v1/internal/note/stats/by-color
   * @summary Fetches note count statistics by color
   */
  async stats(): Promise<ColorStats[]> {
    const response = await authenticatedClient.get<ApiResponse<ColorStats[]>>(
      '/note/stats/by-color'
    );
    return response.data.data;
  },
};
