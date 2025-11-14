import { authenticatedClient } from '@/core/lib/api';
import type { Note, NoteListParams, CreateNoteDto, UpdateNoteDto } from '../types';
import type { ApiResponse } from '@/core/types';

/**
 * @service noteService
 * @summary Note management service for authenticated endpoints
 * @domain note
 * @type rest-service
 * @apiContext internal
 */
export const noteService = {
  /**
   * @endpoint GET /api/v1/internal/note
   * @summary Fetches list of notes with filters
   */
  async list(params?: NoteListParams): Promise<Note[]> {
    const response = await authenticatedClient.get<ApiResponse<Note[]>>('/note', { params });
    return response.data.data;
  },

  /**
   * @endpoint GET /api/v1/internal/note/:id
   * @summary Fetches single note by ID
   */
  async getById(id: number): Promise<Note> {
    const response = await authenticatedClient.get<ApiResponse<Note>>(`/note/${id}`);
    return response.data.data;
  },

  /**
   * @endpoint POST /api/v1/internal/note
   * @summary Creates new note
   */
  async create(data: CreateNoteDto): Promise<{ idNote: number }> {
    const response = await authenticatedClient.post<ApiResponse<{ idNote: number }>>('/note', data);
    return response.data.data;
  },

  /**
   * @endpoint PUT /api/v1/internal/note/:id
   * @summary Updates existing note
   */
  async update(id: number, data: UpdateNoteDto): Promise<{ idNote: number }> {
    const response = await authenticatedClient.put<ApiResponse<{ idNote: number }>>(
      `/note/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * @endpoint DELETE /api/v1/internal/note/:id
   * @summary Deletes note
   */
  async delete(id: number): Promise<void> {
    await authenticatedClient.delete(`/note/${id}`);
  },
};
