export function uniqueBy<T>(items: T[], key: keyof T): T[] {
  const filteredItems = new Map<string, T>();

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    filteredItems.set(item![key]!.toString(), item!);
  }

  return Array.from(filteredItems.values());
}

export function unique<T>(items: T[]): T[] {
  const filteredItems = new Map<string, T>();

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    let key: string;

    switch (typeof item) {
      case "object":
        key = JSON.stringify(item);
        break;
      case "function":
        throw new Error("Unique can't process functions");
      case "undefined":
        key = "";
        break;
      default:
        key = item!.toString();
        break;
    }

    filteredItems.set(key, item!);
  }

  return Array.from(filteredItems.values());
}

export function isIdentical<T>(first?: T[], second?: T[]) {
  const firstJson = JSON.stringify(first);
  const secondJson = JSON.stringify(second);
  return firstJson === secondJson;
}

export function replaceNullWithUndefined<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return undefined!;
  }
  if (Array.isArray(obj)) {
    return obj.map((x) => (x && typeof x === "object" ? replaceNullWithUndefined(x) : x)) as T;
  }
  if (typeof obj !== "object") {
    return obj;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newObj = {} as any;
  const keys = Object.keys(obj);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i] as keyof T;
    const value = obj[key];

    if (value === null || value === undefined) {
      newObj[key] = undefined;
    } else if (typeof value === "object") {
      newObj[key] = replaceNullWithUndefined(value);
    } else {
      newObj[key] = value;
    }
  }

  return newObj as T;
}
