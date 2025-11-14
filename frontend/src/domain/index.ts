/**
 * @module domains
 * @summary Central export point for all domain modules
 */

export * from './note/types';
export * from './note/services/noteService';
export * from './note/hooks/useNoteList';
export * from './note/hooks/useNoteDetail';
export * from './note/hooks/useNoteCreate';
export * from './note/hooks/useNoteUpdate';
export * from './note/hooks/useNoteDelete';
export * from './note/components/NoteCard';
export * from './note/components/NoteForm';

export * from './color/types';
export * from './color/services/colorService';
export * from './color/hooks/useColorList';
export * from './color/hooks/useColorStats';
export * from './color/components/ColorPicker';
export * from './color/components/ColorFilter';
export { ColorStats } from './color/components/ColorStats';
