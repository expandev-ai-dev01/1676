import { Request } from 'express';
import { z } from 'zod';
import { ApiError } from '@/middleware/error';

export interface SecurityCheck {
  securable: string;
  permission: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
}

export interface ValidatedRequest<T = any> {
  credential: {
    idAccount: number;
    idUser: number;
  };
  params: T;
}

export class CrudController {
  private securityChecks: SecurityCheck[];

  constructor(securityChecks: SecurityCheck[]) {
    this.securityChecks = securityChecks;
  }

  private async validateSecurity(req: Request): Promise<{ idAccount: number; idUser: number }> {
    const idAccount = parseInt(req.headers['x-account-id'] as string) || 1;
    const idUser = parseInt(req.headers['x-user-id'] as string) || 1;

    if (!idAccount || !idUser) {
      throw {
        name: 'SecurityError',
        message: 'Missing account or user credentials',
        statusCode: 401,
        code: 'UNAUTHORIZED',
      } as ApiError;
    }

    return { idAccount, idUser };
  }

  private async validateParams<T>(req: Request, schema: z.ZodSchema<T>): Promise<T> {
    try {
      const params = {
        ...req.params,
        ...req.query,
        ...req.body,
      };

      return await schema.parseAsync(params);
    } catch (error: any) {
      throw {
        name: 'ValidationError',
        message: 'Invalid request parameters',
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        details: error.errors,
      } as ApiError;
    }
  }

  async create<T>(
    req: Request,
    schema: z.ZodSchema<T>
  ): Promise<[ValidatedRequest<T> | null, ApiError | null]> {
    try {
      const credential = await this.validateSecurity(req);
      const params = await this.validateParams(req, schema);

      return [{ credential, params }, null];
    } catch (error) {
      return [null, error as ApiError];
    }
  }

  async read<T>(
    req: Request,
    schema: z.ZodSchema<T>
  ): Promise<[ValidatedRequest<T> | null, ApiError | null]> {
    try {
      const credential = await this.validateSecurity(req);
      const params = await this.validateParams(req, schema);

      return [{ credential, params }, null];
    } catch (error) {
      return [null, error as ApiError];
    }
  }

  async update<T>(
    req: Request,
    schema: z.ZodSchema<T>
  ): Promise<[ValidatedRequest<T> | null, ApiError | null]> {
    try {
      const credential = await this.validateSecurity(req);
      const params = await this.validateParams(req, schema);

      return [{ credential, params }, null];
    } catch (error) {
      return [null, error as ApiError];
    }
  }

  async delete<T>(
    req: Request,
    schema: z.ZodSchema<T>
  ): Promise<[ValidatedRequest<T> | null, ApiError | null]> {
    try {
      const credential = await this.validateSecurity(req);
      const params = await this.validateParams(req, schema);

      return [{ credential, params }, null];
    } catch (error) {
      return [null, error as ApiError];
    }
  }
}

export const successResponse = <T>(data: T) => ({
  success: true,
  data,
  timestamp: new Date().toISOString(),
});

export const errorResponse = (message: string, code?: string) => ({
  success: false,
  error: {
    code: code || 'ERROR',
    message,
  },
  timestamp: new Date().toISOString(),
});
