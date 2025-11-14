/**
 * @summary
 * Note business logic service that handles all CRUD operations
 * by calling stored procedures in the database layer.
 *
 * @module noteRules
 * @description Provides business logic functions for note management
 */

import { dbRequest, ExpectedReturn } from '@/utils/database';
import {
  NoteCreateRequest,
  NoteCreateResult,
  NoteUpdateRequest,
  NoteUpdateResult,
  NoteListRequest,
  NoteEntity,
  NoteGetRequest,
  NoteDeleteRequest,
  NoteDeleteResult,
} from './noteTypes';

/**
 * @summary
 * Creates a new note in the database
 *
 * @function noteCreate
 * @module note
 *
 * @param {NoteCreateRequest} params - Note creation parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {string} params.titulo - Note title
 * @param {string} params.conteudo - Note content
 * @param {number} [params.idColor] - Note color ID (optional, default: 1)
 *
 * @returns {Promise<NoteCreateResult>} Created note identifier
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 */
export async function noteCreate(params: NoteCreateRequest): Promise<NoteCreateResult> {
  const result = await dbRequest(
    '[functional].[spNoteCreate]',
    {
      idAccount: params.idAccount,
      idUser: params.idUser,
      titulo: params.titulo,
      conteudo: params.conteudo,
      idColor: params.idColor || 1, // Default to 1 ('Neutro')
    },
    ExpectedReturn.Single
  );

  return result;
}

/**
 * @summary
 * Lists all notes for an account with optional filtering and sorting
 *
 * @function noteList
 * @module note
 *
 * @param {NoteListRequest} params - Note listing parameters
 * @param {number} params.idAccount - Account identifier
 * @param {string} [params.filterColorIds] - Comma-separated color IDs (default: 'todas')
 * @param {string} [params.orderBy] - Sort field (default: 'dateModified')
 * @param {string} [params.direction] - Sort direction (default: 'desc')
 *
 * @returns {Promise<NoteEntity[]>} Array of notes
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 */
export async function noteList(params: NoteListRequest): Promise<NoteEntity[]> {
  const result = await dbRequest(
    '[functional].[spNoteList]',
    {
      idAccount: params.idAccount,
      filterColorIds: params.filterColorIds || 'todas',
      orderBy: params.orderBy || 'dateModified',
      direction: params.direction || 'desc',
    },
    ExpectedReturn.Multi
  );

  return result[0] || [];
}

/**
 * @summary
 * Retrieves a specific note by its identifier
 *
 * @function noteGet
 * @module note
 *
 * @param {NoteGetRequest} params - Note retrieval parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idNote - Note identifier
 *
 * @returns {Promise<NoteEntity>} Note details
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails or note not found
 */
export async function noteGet(params: NoteGetRequest): Promise<NoteEntity> {
  const result = await dbRequest(
    '[functional].[spNoteGet]',
    {
      idAccount: params.idAccount,
      idNote: params.idNote,
    },
    ExpectedReturn.Single
  );

  return result;
}

/**
 * @summary
 * Updates an existing note
 *
 * @function noteUpdate
 * @module note
 *
 * @param {NoteUpdateRequest} params - Note update parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {number} params.idNote - Note identifier
 * @param {string} params.titulo - Updated note title
 * @param {string} params.conteudo - Updated note content
 * @param {number} params.idColor - Updated note color ID
 *
 * @returns {Promise<NoteUpdateResult>} Updated note identifier
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails or note not found
 */
export async function noteUpdate(params: NoteUpdateRequest): Promise<NoteUpdateResult> {
  const result = await dbRequest(
    '[functional].[spNoteUpdate]',
    {
      idAccount: params.idAccount,
      idUser: params.idUser,
      idNote: params.idNote,
      titulo: params.titulo,
      conteudo: params.conteudo,
      idColor: params.idColor,
    },
    ExpectedReturn.Single
  );

  return result;
}

/**
 * @summary
 * Permanently deletes a note from the database
 *
 * @function noteDelete
 * @module note
 *
 * @param {NoteDeleteRequest} params - Note deletion parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {number} params.idNote - Note identifier
 *
 * @returns {Promise<NoteDeleteResult>} Deleted note identifier
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails or note not found
 */
export async function noteDelete(params: NoteDeleteRequest): Promise<NoteDeleteResult> {
  const result = await dbRequest(
    '[functional].[spNoteDelete]',
    {
      idAccount: params.idAccount,
      idUser: params.idUser,
      idNote: params.idNote,
    },
    ExpectedReturn.Single
  );

  return result;
}
