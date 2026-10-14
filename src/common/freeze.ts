/**
 * Recursively freezes a reference table so code elsewhere in the process cannot
 * change validation results by mutating shared data. Internal; not re-exported.
 */
export function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) deepFreeze(child);
    Object.freeze(value);
  }
  return value;
}
