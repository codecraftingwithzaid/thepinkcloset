/**
 * Convert Mongoose/DB results into plain JSON-safe data for Client Components.
 * This strips document internals and normalizes ObjectIds/Dates for serialization.
 */
export function serializeData<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}
