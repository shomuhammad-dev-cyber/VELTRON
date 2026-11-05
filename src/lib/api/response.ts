// ==============================================================================
// VALIXEN STANDARDIZED API RESPONSE BUILDERS
// ==============================================================================

import { NextResponse } from 'next/server';
import { ApiSuccessResponse, ApiErrorResponse, ApiMeta, HttpStatusCode } from '@/types/api';

const API_VERSION = 'v1.0.0';

/**
 * Creates standardized metadata for API telemetry
 */
export function createApiMeta(options?: {
  requestId?: string;
  latencyMs?: number;
  pagination?: ApiMeta['pagination'];
}): ApiMeta {
  return {
    requestId: options?.requestId || crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    version: API_VERSION,
    latencyMs: options?.latencyMs,
    pagination: options?.pagination,
  };
}

/**
 * Serializes a successful HTTP response with type safety
 */
export function successResponse<T>(
  data: T,
  statusCode: HttpStatusCode = 200,
  options?: {
    requestId?: string;
    pagination?: ApiMeta['pagination'];
    headers?: HeadersInit;
  }
): NextResponse {
  const payload: ApiSuccessResponse<T> = {
    success: true,
    data,
    meta: createApiMeta({
      requestId: options?.requestId,
      pagination: options?.pagination,
    }),
  };

  return NextResponse.json(payload, {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
      'X-Valixen-Version': API_VERSION,
      ...options?.headers,
    },
  });
}

/**
 * Serializes an error HTTP response with audit tracking
 */
export function errorResponse(
  message: string,
  errorCode: string,
  statusCode: HttpStatusCode = 500,
  options?: {
    requestId?: string;
    details?: ApiErrorResponse['error']['details'];
    headers?: HeadersInit;
  }
): NextResponse {
  const payload: ApiErrorResponse = {
    success: false,
    error: {
      code: errorCode,
      message,
      details: options?.details,
    },
    meta: createApiMeta({ requestId: options?.requestId }),
  };

  return NextResponse.json(payload, {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
      'X-Valixen-Version': API_VERSION,
      ...options?.headers,
    },
  });
}
