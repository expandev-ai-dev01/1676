/**
 * @module ColorTypes
 * @summary Type definitions for the color domain
 * @domain color
 */

export interface Color {
  idColor: number;
  name: string;
  hexCode: string;
}

export interface ColorStats extends Color {
  noteCount: number;
}
