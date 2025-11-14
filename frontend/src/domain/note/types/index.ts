/**
 * @module NoteTypes
 * @summary Type definitions for the note domain
 * @domain note
 */

export interface Note {
  idNote: number;
  titulo: string;
  conteudo: string;
  cor: string;
  dateCreated: string;
  dateModified: string;
}

export interface NoteListParams {
  filterCor?: string;
  orderBy?: 'dateCreated' | 'dateModified' | 'titulo';
  direction?: 'asc' | 'desc';
}

export interface CreateNoteDto {
  titulo: string;
  conteudo: string;
  cor: string;
}

export interface UpdateNoteDto {
  titulo: string;
  conteudo: string;
  cor: string;
}
