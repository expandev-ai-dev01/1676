/**
 * @interface ColorEntity
 * @description Represents a color in the predefined palette
 *
 * @property {number} idColor - Unique color identifier
 * @property {string} name - Color name
 * @property {string} hexCode - Color hex code (e.g., '#FFFFFF')
 */
export interface ColorEntity {
  idColor: number;
  name: string;
  hexCode: string;
}

/**
 * @interface ColorStatsEntity
 * @description Represents statistics for a single color
 *
 * @property {number} idColor - Unique color identifier
 * @property {string} name - Color name
 * @property {string} hexCode - Color hex code
 * @property {number} noteCount - Number of notes associated with this color
 */
export interface ColorStatsEntity extends ColorEntity {
  noteCount: number;
}

/**
 * @interface ColorListRequest
 * @description Request parameters for listing colors
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 */
export interface ColorListRequest {
  idAccount: number;
  idUser: number;
}

/**
 * @interface NoteColorStatsRequest
 * @description Request parameters for getting note color stats
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 */
export interface NoteColorStatsRequest {
  idAccount: number;
  idUser: number;
}
