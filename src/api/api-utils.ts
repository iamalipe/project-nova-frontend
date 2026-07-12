import type { ApiNormalResponse } from "@/types/generic-type";
import axios from "axios";

/**
 * Normalizes an axios error into the backend's ApiNormalResponse shape.
 * Shared across api modules so every new module (auth, product, ...) throws
 * the same error shape without repeating this check.
 */
export function normalizeApiError(error: unknown): never {
  if (axios.isAxiosError(error) && error.response) {
    throw error.response.data as ApiNormalResponse;
  }
  throw error;
}

/**
 * Wraps an axios call so its errors are normalized via normalizeApiError.
 * Use this in every api module method instead of a local try/catch.
 */
export async function unwrapApiError<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    normalizeApiError(error);
  }
}
