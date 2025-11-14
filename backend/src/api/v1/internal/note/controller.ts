/**
 * @api {get} /internal/note List Notes
 * @apiName ListNotes
 * @apiGroup Note
 * @apiVersion 1.0.0
 *
 * @apiDescription Lists all notes for an account with optional filtering and sorting
 *
 * @apiParam {String} [filterCor] Color filter (default: 'todas')
 * @apiParam {String} [orderBy] Sort field: dateCreated, dateModified, titulo (default: 'dateModified')
 * @apiParam {String} [direction] Sort direction: asc, desc (default: 'desc')
 *
 * @apiSuccess {Array} data Array of notes
 * @apiSuccess {Number} data.idNote Note identifier
 * @apiSuccess {String} data.titulo Note title
 * @apiSuccess {String} data.conteudo Note content
 * @apiSuccess {String} data.cor Note color
 * @apiSuccess {Date} data.dateCreated Creation timestamp
 * @apiSuccess {Date} data.dateModified Last modification timestamp
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import { noteList, noteCreate, noteGet, noteUpdate, noteDelete } from '@/services/note';
import { zString, zNullableString } from '@/utils/zodValidation';

const securable = 'NOTE';

const listQuerySchema = z.object({
  filterCor: z.string().max(50).optional(),
  orderBy: z.enum(['dateCreated', 'dateModified', 'titulo']).optional(),
  direction: z.enum(['asc', 'desc']).optional(),
});

export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const [validated, error] = await operation.read(req, listQuerySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await noteList({
      ...validated.credential,
      ...validated.params,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {post} /internal/note Create Note
 * @apiName CreateNote
 * @apiGroup Note
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new note
 *
 * @apiParam {String} titulo Note title (3-100 characters)
 * @apiParam {String} conteudo Note content (1-5000 characters)
 * @apiParam {String} [cor] Note color (default: 'branco')
 *
 * @apiSuccess {Number} idNote Created note identifier
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
const createBodySchema = z.object({
  titulo: z.string().min(3).max(100),
  conteudo: z.string().min(1).max(5000),
  cor: z.string().max(50).optional(),
});

export async function createHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'CREATE' }]);

  const [validated, error] = await operation.create(req, createBodySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await noteCreate({
      ...validated.credential,
      ...validated.params,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {get} /internal/note/:id Get Note
 * @apiName GetNote
 * @apiGroup Note
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves a specific note by its identifier
 *
 * @apiParam {Number} id Note identifier
 *
 * @apiSuccess {Number} idNote Note identifier
 * @apiSuccess {String} titulo Note title
 * @apiSuccess {String} conteudo Note content
 * @apiSuccess {String} cor Note color
 * @apiSuccess {Date} dateCreated Creation timestamp
 * @apiSuccess {Date} dateModified Last modification timestamp
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} NotFoundError Note not found
 * @apiError {String} ServerError Internal server error
 */
const getParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const [validated, error] = await operation.read(req, getParamsSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await noteGet({
      idAccount: validated.credential.idAccount,
      idNote: validated.params.id,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {put} /internal/note/:id Update Note
 * @apiName UpdateNote
 * @apiGroup Note
 * @apiVersion 1.0.0
 *
 * @apiDescription Updates an existing note
 *
 * @apiParam {Number} id Note identifier
 * @apiParam {String} titulo Updated note title (3-100 characters)
 * @apiParam {String} conteudo Updated note content (1-5000 characters)
 * @apiParam {String} cor Updated note color
 *
 * @apiSuccess {Number} idNote Updated note identifier
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} NotFoundError Note not found
 * @apiError {String} ServerError Internal server error
 */
const updateParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
  titulo: z.string().min(3).max(100),
  conteudo: z.string().min(1).max(5000),
  cor: z.string().max(50),
});

export async function updateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'UPDATE' }]);

  const [validated, error] = await operation.update(req, updateParamsSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await noteUpdate({
      ...validated.credential,
      idNote: validated.params.id,
      titulo: validated.params.titulo,
      conteudo: validated.params.conteudo,
      cor: validated.params.cor,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {delete} /internal/note/:id Delete Note
 * @apiName DeleteNote
 * @apiGroup Note
 * @apiVersion 1.0.0
 *
 * @apiDescription Permanently deletes a note
 *
 * @apiParam {Number} id Note identifier
 *
 * @apiSuccess {Number} idNote Deleted note identifier
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} NotFoundError Note not found
 * @apiError {String} ServerError Internal server error
 */
const deleteParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'DELETE' }]);

  const [validated, error] = await operation.delete(req, deleteParamsSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await noteDelete({
      ...validated.credential,
      idNote: validated.params.id,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}
