/**
 * @interface NoteEntity
 * @description Represents a note entity in the system
 *
 * @property {number} idNote - Unique note identifier
 * @property {number} idAccount - Associated account identifier
 * @property {string} titulo - Note title
 * @property {string} conteudo - Note content
 * @property {string} cor - Note color for visual organization
 * @property {Date} dateCreated - Creation timestamp
 * @property {Date} dateModified - Last modification timestamp
 */
export interface NoteEntity {
  idNote: number;
  idAccount: number;
  titulo: string;
  conteudo: string;
  cor: string;
  dateCreated: Date;
  dateModified: Date;
}

/**
 * @interface NoteCreateRequest
 * @description Request parameters for creating a new note
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {string} titulo - Note title (3-100 characters)
 * @property {string} conteudo - Note content (1-5000 characters)
 * @property {string} [cor] - Optional note color (default: 'branco')
 */
export interface NoteCreateRequest {
  idAccount: number;
  idUser: number;
  titulo: string;
  conteudo: string;
  cor?: string;
}

/**
 * @interface NoteUpdateRequest
 * @description Request parameters for updating an existing note
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {number} idNote - Note identifier
 * @property {string} titulo - Updated note title (3-100 characters)
 * @property {string} conteudo - Updated note content (1-5000 characters)
 * @property {string} cor - Updated note color
 */
export interface NoteUpdateRequest {
  idAccount: number;
  idUser: number;
  idNote: number;
  titulo: string;
  conteudo: string;
  cor: string;
}

/**
 * @interface NoteListRequest
 * @description Request parameters for listing notes
 *
 * @property {number} idAccount - Account identifier
 * @property {string} [filterCor] - Optional color filter (default: 'todas')
 * @property {string} [orderBy] - Sort field (default: 'dateModified')
 * @property {string} [direction] - Sort direction (default: 'desc')
 */
export interface NoteListRequest {
  idAccount: number;
  filterCor?: string;
  orderBy?: string;
  direction?: string;
}

/**
 * @interface NoteGetRequest
 * @description Request parameters for retrieving a specific note
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idNote - Note identifier
 */
export interface NoteGetRequest {
  idAccount: number;
  idNote: number;
}

/**
 * @interface NoteDeleteRequest
 * @description Request parameters for deleting a note
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {number} idNote - Note identifier
 */
export interface NoteDeleteRequest {
  idAccount: number;
  idUser: number;
  idNote: number;
}

/**
 * @interface NoteCreateResult
 * @description Result of note creation operation
 *
 * @property {number} idNote - Identifier of the created note
 */
export interface NoteCreateResult {
  idNote: number;
}

/**
 * @interface NoteUpdateResult
 * @description Result of note update operation
 *
 * @property {number} idNote - Identifier of the updated note
 */
export interface NoteUpdateResult {
  idNote: number;
}

/**
 * @interface NoteDeleteResult
 * @description Result of note deletion operation
 *
 * @property {number} idNote - Identifier of the deleted note
 */
export interface NoteDeleteResult {
  idNote: number;
}
