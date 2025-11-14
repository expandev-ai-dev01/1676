/**
 * @module note
 * @summary Note management domain module
 * @domain functional
 * @version 1.0.0
 */

export * from './types';
export * from './services/noteService';
export * from './hooks/useNoteList';
export * from './hooks/useNoteDetail';
export * from './hooks/useNoteCreate';
export * from './hooks/useNoteUpdate';
export * from './hooks/useNoteDelete';
export * from './components/NoteCard';
export * from './components/NoteForm';

export const moduleMetadata = {
  name: 'note',
  domain: 'functional',
  version: '1.0.0',
  publicComponents: ['NoteCard', 'NoteForm'],
  publicHooks: ['useNoteList', 'useNoteDetail', 'useNoteCreate', 'useNoteUpdate', 'useNoteDelete'],
  publicServices: ['noteService'],
  dependencies: {
    internal: ['@/core/lib/api', '@/core/types'],
    external: ['react', 'react-hook-form', 'zod', '@tanstack/react-query', 'date-fns'],
  },
} as const;
