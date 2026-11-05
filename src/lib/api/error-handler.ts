// ==============================================================================
// VALIXEN CENTRALIZED API ERROR HANDLER & ROUTE WRAPPER
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { AppError } from './errors';
import { errorResponse } from './response';
import { logger } from '@/lib/logger';
import { TelegramBotService } from '@/server/services/telegram.service';

type RouteHandler<T = any> = (req: NextRequest, context: T) => Promise<NextResponse>;

/**
 * Higher-order function that wraps Route Handlers with structured error boundary
 */
export function withErrorHandler<T = any>(handler: RouteHandler<T>): RouteHandler<T> {
  return async (req: NextRequest, context: T): Promise<NextResponse> => {
    const requestId = crypto.randomUUID();
    const startTime = Date.now();

    try {
      const response = await handler(req, context);
      response.headers.set('X-Request-Id', requestId);
      return response;
    } catch (err: unknown) {
      const durationMs = Date.now() - startTime;

      // Handle custom typed application errors
      if (err instanceof AppError) {
        logger.warn(`Operational application error: ${err.message}`, {
          requestId,
          endpoint: req.nextUrl.pathname,
          method: req.method,
          statusCode: err.statusCode,
          errorCode: err.errorCode,
          durationMs,
        });

        return errorResponse(err.message, err.errorCode, err.statusCode, {
          requestId,
          details: err.details,
        });
      }

      // Handle Zod schema validation errors
      if (err instanceof ZodError) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawErrors: any[] = (err as any).issues || (err as any).errors || [];
        const details = rawErrors.map((e: { path?: (string | number)[]; code?: string; message?: string }) => ({
          field: Array.isArray(e.path) ? e.path.join('.') : undefined,
          code: e.code || 'VALIDATION_ERROR',
          message: e.message || 'Invalid input parameter.',
        }));

        logger.warn('Request validation failure', {
          requestId,
          endpoint: req.nextUrl.pathname,
          method: req.method,
          details,
          durationMs,
        });

        return errorResponse('The request body or query parameters failed validation.', 'VALIDATION_FAILED', 422, {
          requestId,
          details,
        });
      }

      // Handle untyped internal crashes / exceptions
      logger.error('Unhandled internal platform exception', err, {
        requestId,
        endpoint: req.nextUrl.pathname,
        method: req.method,
        durationMs,
      });

      // Dispatch real-time error telemetry to Admin Telegram Chat
      TelegramBotService.notifyAdminSystemError({
        errorName: err instanceof Error ? err.name : 'UnhandledException',
        errorMessage: err instanceof Error ? err.message : String(err),
        endpoint: `${req.method} ${req.nextUrl.pathname}`,
        requestId,
      }).catch(() => {});

      return errorResponse(
        process.env.NODE_ENV === 'production'
          ? 'An internal server error occurred while processing the financial request.'
          : err instanceof Error ? err.message : String(err),
        'INTERNAL_SERVER_ERROR',
        500,
        { requestId }
      );
    }
  };
}
