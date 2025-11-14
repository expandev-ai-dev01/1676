/**
 * @api {get} /internal/color List Colors
 * @apiName ListColors
 * @apiGroup Color
 * @apiVersion 1.0.0
 *
 * @apiDescription Lists all available colors in the palette
 *
 * @apiSuccess {Array} data Array of colors
 * @apiSuccess {Number} data.idColor Color identifier
 * @apiSuccess {String} data.name Color name
 * @apiSuccess {String} data.hexCode Color hex code
 *
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
import { colorList, noteColorStats } from '@/services/color';

const securable = 'COLOR';

export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const [validated, error] = await operation.read(req, z.object({}));

  if (!validated) {
    return next(error);
  }

  try {
    const data = await colorList({
      ...validated.credential,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    next(StatusGeneralError);
  }
}

/**
 * @api {get} /internal/note/stats/by-color Get Note Color Stats
 * @apiName GetNoteColorStats
 * @apiGroup Color
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves statistics on note count per color
 *
 * @apiSuccess {Array} data Array of color statistics
 * @apiSuccess {Number} data.idColor Color identifier
 * @apiSuccess {String} data.name Color name
 * @apiSuccess {String} data.hexCode Color hex code
 * @apiSuccess {Number} data.noteCount Number of notes with this color
 *
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function statsHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable: 'NOTE', permission: 'READ' }]);

  const [validated, error] = await operation.read(req, z.object({}));

  if (!validated) {
    return next(error);
  }

  try {
    const data = await noteColorStats({
      ...validated.credential,
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
