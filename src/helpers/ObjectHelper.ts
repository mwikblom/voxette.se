import { isProxy, isReactive, isRef, toRaw } from "vue";
import DateTimeHelper from "./DateTimeHelper";

/**
 * Clone an object without references. OBS: Do NOT use with class instances.
 * @param obj Object to clone
 * @returns A new object with the same values as the inputted object.
 */
export function clone<T extends object>(obj: T): T {
  if (window.structuredClone) {
    try {
      return window.structuredClone(toRawDeep(obj));
    } catch (e) {
      console.info(e);
    }
  }

  return JSON.parse(JSON.stringify(obj));
}

export function toRawDeep<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map((x) => toRawDeep(x)) as T;
  }

  if (isRef(obj) || isReactive(obj) || isProxy(obj)) {
    return toRawDeep(toRaw(obj));
  }

  if (obj && typeof obj === "object") {
    return Object.keys(obj).reduce((newObj, objKey) => {
      const key = objKey as keyof T;
      newObj[key] = toRawDeep(obj[key]);
      return newObj;
    }, {} as T);
  }

  return obj;
}

export function isDirty<T extends object>(original: T, edited: T): boolean {
  return Object.keys(original).some((x) => {
    const key = x as keyof T;
    const originalValue = original[key];
    const editedValue = edited[key];

    if (
      (originalValue === undefined || originalValue === null) &&
      (editedValue === undefined || editedValue === null)
    ) {
      return false;
    }

    if (originalValue === undefined || originalValue === null || editedValue === undefined || editedValue === null) {
      return true;
    }

    if (typeof originalValue === "object" && typeof editedValue === "object") {
      if (DateTimeHelper.isDateInstance(originalValue) && DateTimeHelper.isDateInstance(editedValue)) {
        return originalValue.toISOString() !== editedValue.toISOString();
      }

      if (Array.isArray(originalValue) && Array.isArray(editedValue)) {
        if (originalValue.length !== editedValue.length) {
          return true;
        }

        for (let i = 0; i < originalValue.length; i++) {
          const originalArrayItem = originalValue[i];
          const editedArrayItem = editedValue[i];

          const isEdited = isDirty(originalArrayItem, editedArrayItem);
          if (isEdited) {
            return true;
          }
        }

        return false;
      }

      return isDirty(originalValue, editedValue);
    }

    return editedValue !== originalValue;
  });
}
