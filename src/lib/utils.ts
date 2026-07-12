import { clsx, type ClassValue } from "clsx";
import qs from "qs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function qString(data: unknown) {
  const result = qs.stringify(data, {
    filter: (_prefix, value) => (value !== "" ? value : undefined),
    arrayFormat: "indices",
    allowEmptyArrays: false,
    encodeValuesOnly: true,
    skipNulls: true,
    strictNullHandling: true,
  });
  return result;
}

export function sanitizeObject(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj
      .map(sanitizeObject) // Recursively clean array elements
      .filter((item) => item !== undefined && item !== null && item !== ""); // Remove unwanted values from array
  }
  if (typeof obj === "object" && obj !== null) {
    const cleanedObject: { [key: string]: unknown } = {};

    for (const [key, value] of Object.entries(obj)) {
      const cleanedValue = sanitizeObject(value); // Recursively clean nested values
      if (
        cleanedValue !== undefined &&
        cleanedValue !== null &&
        cleanedValue !== ""
      ) {
        cleanedObject[key] = cleanedValue;
      }
    }

    return cleanedObject;
  }

  return obj; // Return the value as-is if it's not an array or object
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function getRandomInt(min: number, max: number): number {
  // Ensure the min and max are integers
  min = Math.ceil(min);
  max = Math.floor(max);

  // The maximum is inclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function deleteKeysFromObject<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  // Create a shallow copy to prevent mutation
  const result = { ...obj };

  for (const key of keys) {
    // Only attempt deletion if the key actually exists in the object
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      delete result[key];
    }
  }

  return result as Omit<T, K>;
}
