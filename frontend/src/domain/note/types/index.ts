/**
 * @module NoteTypes
 * @summary Type definitions for the note domain
 * @domain note
 */

export interface Note {
  idNote: number;
  titulo: string;
  conteudo: string;
  idColor: number;
  colorName: string;
  colorHex: string;
  dateCreated: string;
  dateModified: string;
}

export interface NoteListParams {
  filterColorIds?: string;
  orderBy?: 'dateCreated' | 'dateModified' | 'titulo';
  direction?: 'asc' | 'desc';
}

export interface CreateNoteDto {
  titulo: string;
  conteudo: string;
  idColor: number;
}

export interface UpdateNoteDto {
  titulo: string;
  conteudo: string;
  idColor: number;
}
