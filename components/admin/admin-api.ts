'use client'

export class AdminApiError extends Error {
  status: number;
  code?: string;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
    this.data = data;
    if (isRecord(data) && typeof data.code === "string") {
      this.code = data.code;
    }
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export function getApiErrorMessage(data: unknown, fallback: string): string {
  if (isRecord(data) && typeof data.error === "string" && data.error.trim().length > 0) {
    return data.error;
  }
  return fallback;
}

export async function fetchJson<T = Record<string, unknown>>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<{ ok: boolean; status: number; data: T }> {
  const response = await fetch(input, init);
  const data = (await parseResponseBody(response)) as T;
  return { ok: response.ok, status: response.status, data };
}

export async function fetchJsonOrThrow<T = Record<string, unknown>>(
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  fallbackMessage: string
): Promise<T> {
  const result = await fetchJson<T>(input, init);
  if (!result.ok) {
    throw new AdminApiError(getApiErrorMessage(result.data, fallbackMessage), result.status, result.data);
  }
  return result.data;
}

export function toErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof AdminApiError) return error.message;
  if (error instanceof Error && error.message.trim().length > 0) return error.message;
  return fallbackMessage;
}
