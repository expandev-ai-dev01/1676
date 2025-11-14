/**
 * @summary
 * Color business logic service for listing colors and getting stats.
 *
 * @module colorRules
 * @description Provides business logic functions for color management
 */

import { dbRequest, ExpectedReturn } from '@/utils/database';
import {
  ColorEntity,
  ColorListRequest,
  NoteColorStatsRequest,
  ColorStatsEntity,
} from './colorTypes';

/**
 * @summary
 * Lists all available colors from the palette
 *
 * @function colorList
 * @module color
 *
 * @param {ColorListRequest} params - Request parameters
 * @param {number} params.idAccount - Account identifier
 *
 * @returns {Promise<ColorEntity[]>} Array of colors
 *
 * @throws {DatabaseError} When database operation fails
 */
export async function colorList(params: ColorListRequest): Promise<ColorEntity[]> {
  const result = await dbRequest('[config].[spColorList]', {}, ExpectedReturn.Multi);
  return result[0] || [];
}

/**
 * @summary
 * Retrieves statistics on note count per color for an account
 *
 * @function noteColorStats
 * @module color
 *
 * @param {NoteColorStatsRequest} params - Request parameters
 * @param {number} params.idAccount - Account identifier
 *
 * @returns {Promise<ColorStatsEntity[]>} Array of color statistics
 *
 * @throws {DatabaseError} When database operation fails
 */
export async function noteColorStats(params: NoteColorStatsRequest): Promise<ColorStatsEntity[]> {
  const result = await dbRequest(
    '[functional].[spNoteColorStats]',
    {
      idAccount: params.idAccount,
    },
    ExpectedReturn.Multi
  );
  return result[0] || [];
}
