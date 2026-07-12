import { z } from "zod";
import { compressUrl, decompressUrl } from "./compress";

export const paginationZodSchema = z
  .object({
    page: z.number().min(0).optional().default(1),
    limit: z.number().min(1).max(100).optional().default(10),
  })
  .transform((data) => {
    // Remove default values to return undefined for them
    const result: { page?: number; limit?: number } = {};
    if (data.page !== 1) {
      result.page = data.page;
    }
    if (data.limit !== 10) {
      result.limit = data.limit;
    }
    return result;
  });

export type paginationZodSchemaType = z.infer<typeof paginationZodSchema>;

export const sortArrayZodSchema = z
  .array(
    z.object({
      order: z
        .string()
        .optional()
        .refine((val) => !val || ["asc", "desc"].includes(val), {
          message: "Order must be 'asc' or 'desc'",
        })
        .transform((val) => (val === "" || val === undefined ? "desc" : val))
        .default("desc"),
      orderBy: z
        .string()
        .optional()
        .transform((val) =>
          val === "" || val === undefined ? "createdAt" : val
        )
        .default("createdAt"),
    })
  )
  .transform((val) =>
    val.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.orderBy === item.orderBy)
    )
  )
  .default([]);

export type sortArrayZodSchemaType = {
  orderBy: string;
  order: "asc" | "desc";
}[];

export const getAllZodSchema = z
  .object({
    page: z.number().min(0).optional().default(1),
    limit: z.number().min(1).max(100).optional().default(10),
    sort: sortArrayZodSchema,
    mode: z.enum(["CREATE", "UPDATE", "VIEW"]).optional(),
  })
  .transform((data) => {
    // Remove default values to return undefined for them
    const result: {
      page?: number;
      limit?: number;
      sort?: sortArrayZodSchemaType;
      mode?: "CREATE" | "UPDATE" | "VIEW";
    } = {};

    if (data.page !== 1) {
      result.page = data.page;
    }
    if (Array.isArray(data.sort) && data.sort.length > 0) {
      result.sort = data.sort as sortArrayZodSchemaType;
    }
    if (data.limit !== 10) {
      result.limit = data.limit;
    }
    if (data.mode) {
      result.mode = data.mode;
    }
    return result;
  });

export const getOneZodSchema = z.object({
  id: z.uuid("Invalid id"),
});

// Used by the login/register routes' `validateSearch`. The `redirect` value
// still needs an `isSafeRedirectPath` check before use — this schema only
// validates shape, not safety.
export const redirectSearchSchema = z.object({
  redirect: z.string().optional(),
});
export type RedirectSearchSchemaType = z.infer<typeof redirectSearchSchema>;

// Used by the `/oauth/consent` route's `validateSearch`. These are the PKCE
// authorization-request params the backend's `/oauth/authorize` redirects
// here with unchanged — already validated server-side, so this only checks
// shape for the frontend's own type-safety.
export const oauthConsentSearchSchema = z.object({
  response_type: z.literal("code"),
  client_id: z.string().min(1),
  redirect_uri: z.string().min(1),
  code_challenge: z.string().min(1),
  code_challenge_method: z.literal("S256"),
  state: z.string().min(1),
  scope: z.literal("openid").optional(),
});
export type OAuthConsentSearchSchemaType = z.infer<
  typeof oauthConsentSearchSchema
>;

export type FilteredLoaderDeps<T extends z.ZodObject<z.ZodRawShape>> = {
  [K in keyof z.infer<T>]: z.infer<T>[K];
};

export const createTypeSafeLoaderDeps = <T extends z.ZodObject<z.ZodRawShape>>(
  schema: T,
  search: Record<string, unknown>
): FilteredLoaderDeps<T> => {
  const schemaKeys = new Set(Object.keys(schema.shape));
  return Object.fromEntries(
    Object.entries(search).filter(([key]) => schemaKeys.has(key))
  ) as FilteredLoaderDeps<T>;
};

export function validateAndStringify<T extends z.ZodTypeAny>(
  schema: T,
  values: z.input<T> // This infers the input type from the schema
): string {
  try {
    const validatedData = schema.parse(values);
    // @ts-ignore
    return compressUrl(validatedData);
  } catch {
    return "";
  }
}

export function validateAndParse<T extends z.ZodTypeAny>(
  schema: T,
  values?: string // This infers the input type from the schema
): z.input<T> | null {
  try {
    if (!values) return null;
    const obj = decompressUrl(values);
    const validatedData = schema.parse(obj);
    // @ts-ignore
    return validatedData;
  } catch {
    return null;
  }
}
