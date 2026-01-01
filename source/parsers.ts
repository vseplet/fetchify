/**
 * @module
 *
 * Response parsing and validation utilities.
 * Provides helpers for parsing responses as text, JSON, or validated JSON with Zod/ValiBot.
 */

// deno-lint-ignore-file no-explicit-any
import { v, type z } from "../deps.ts";

/**
 * Parses response as plain text.
 *
 * @param promise - Fetch promise to parse
 * @returns Object containing parsed text data and response
 *
 * @example
 * ```ts
 * import { text } from "@vseplet/fetchify";
 * const { data, response } = await text(fetch("https://example.com"));
 * ```
 */
export const text = async (
  promise: Promise<Response>,
): Promise<{ data: string; response: Response }> => {
  const response = await promise;
  const data = await response.text();
  return { data, response };
};

/**
 * Parses response as JSON.
 *
 * @param promise - Fetch promise to parse
 * @param _schema - Optional schema parameter (unused, for type inference)
 * @returns Object containing parsed JSON data and response
 *
 * @example
 * ```ts
 * import { json } from "@vseplet/fetchify";
 * const { data, response } = await json(fetch("https://api.example.com"));
 * ```
 */
export const json = async <T>(
  promise: Promise<Response>,
  _schema?: T,
): Promise<{ data: T; response: Response }> => {
  const response = await promise;
  const data = await response.json() as T;

  return { data, response };
};

/**
 * Parses response as JSON and validates with ValiBot schema.
 *
 * @param promise - Fetch promise to parse
 * @param schema - ValiBot schema for validation
 * @returns Object containing validated data and response
 * @throws {ValiError} If validation fails
 *
 * @example
 * ```ts
 * import { jsonV, v } from "@vseplet/fetchify";
 * const schema = v.object({ id: v.number() });
 * const { data, response } = await jsonV(fetch("https://api.example.com"), schema);
 * ```
 */
export const jsonV = async <T extends v.BaseSchema<any, any, any>>(
  promise: Promise<Response>,
  schema: T,
): Promise<{ data: v.InferOutput<T>; response: Response }> => {
  const response = await promise;
  return {
    data: v.parse(schema, await response.json()),
    response,
  };
};

/**
 * Parses response as JSON and validates with Zod schema.
 *
 * @param promise - Fetch promise to parse
 * @param schema - Zod schema for validation
 * @returns Object containing validated data and response
 * @throws {ZodError} If validation fails
 *
 * @example
 * ```ts
 * import { jsonZ, z } from "@vseplet/fetchify";
 * const schema = z.object({ id: z.number() });
 * const { data, response } = await jsonZ(fetch("https://api.example.com"), schema);
 * ```
 */
export const jsonZ = async <T extends z.ZodSchema>(
  promise: Promise<Response>,
  schema: T,
): Promise<{ data: z.infer<T>; response: Response }> => {
  const response = await promise;
  return {
    data: schema.parse(await response.json()),
    response,
  };
};
