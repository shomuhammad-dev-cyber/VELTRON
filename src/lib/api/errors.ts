// ==============================================================================
// VALIXEN DOMAIN & API ERROR TAXONOMY
// ==============================================================================

import { HttpStatusCode, ApiErrorDetail } from '@/types/api';

export abstract class AppError extends Error {
  public abstract readonly statusCode: HttpStatusCode;
  public abstract readonly errorCode: string;
  public readonly details?: ApiErrorDetail[];
  public readonly isOperational: boolean;

  constructor(message: string, details?: ApiErrorDetail[], isOperational: boolean = true) {
    super(message);
    this.name = this.constructor.name;
    this.details = details;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  public readonly statusCode: HttpStatusCode = 422;
  public readonly errorCode = 'VALIDATION_FAILED';

  constructor(message: string = 'The request payload failed structural validation.', details?: ApiErrorDetail[]) {
    super(message, details);
  }
}

export class UnauthorizedError extends AppError {
  public readonly statusCode: HttpStatusCode = 401;
  public readonly errorCode = 'UNAUTHORIZED';

  constructor(message: string = 'Authentication credentials are missing or invalid.') {
    super(message);
  }
}

export class ForbiddenError extends AppError {
  public readonly statusCode: HttpStatusCode = 403;
  public readonly errorCode = 'ACCESS_DENIED';

  constructor(message: string = 'You do not have permission to access this financial resource.') {
    super(message);
  }
}

export class NotFoundError extends AppError {
  public readonly statusCode: HttpStatusCode = 404;
  public readonly errorCode = 'RESOURCE_NOT_FOUND';

  constructor(resource: string = 'Resource', identifier?: string) {
    super(`${resource} ${identifier ? `with ID '${identifier}' ` : ''}could not be found.`);
  }
}

export class InsufficientFundsError extends AppError {
  public readonly statusCode: HttpStatusCode = 400;
  public readonly errorCode = 'INSUFFICIENT_FUNDS';

  constructor(message: string = 'Available account balance is insufficient to execute this transaction.') {
    super(message);
  }
}

export class RateLimitExceededError extends AppError {
  public readonly statusCode: HttpStatusCode = 429;
  public readonly errorCode = 'RATE_LIMIT_EXCEEDED';

  constructor(retryAfterSeconds: number = 60, message?: string) {
    super(message || `Too many requests. Please throttle your rate. Retry after ${retryAfterSeconds}s.`);
  }
}

export class InternalServerError extends AppError {
  public readonly statusCode: HttpStatusCode = 500;
  public readonly errorCode = 'INTERNAL_SYSTEM_ERROR';

  constructor(message: string = 'An unexpected internal error occurred within the engine.') {
    super(message, undefined, false);
  }
}
