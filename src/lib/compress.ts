import LZString from "lz-string";

export function compressUrl(object?: Record<string, any>): string {
  if (!object) return "";
  return LZString.compressToEncodedURIComponent(JSON.stringify(object));
}
export function decompressUrl(
  compressedString?: string
): Record<string, any> | null {
  try {
    if (!compressedString) return null;
    const decompressed =
      LZString.decompressFromEncodedURIComponent(compressedString);
    if (decompressed) {
      return JSON.parse(decompressed);
    }
    return null;
  } catch {
    return null;
  }
}
