import { v, z } from "../deps.ts";

export const text = async (promise: Promise<Response>) => {
  const response = await promise;
  const data = await response.text();
  return { data, response };
};

export const json = async <T>(promise: Promise<Response>, schema?: T) => {
  const response = await promise;
  const data = await response.json() as T;

  return { data, response };
};

export const jsonV = async <T extends v.BaseSchema>(
  promise: Promise<Response>,
  schema: T,
) => {
  const response = await promise;
  return {
    data: v.parse(schema, await response.json()),
    response,
  };
};

export const jsonZ = async <T extends z.ZodSchema>(
  promise: Promise<Response>,
  schema: T,
) => {
  const response = await promise;
  return {
    data: schema.parse(await response.json()),
    response,
  };
};
