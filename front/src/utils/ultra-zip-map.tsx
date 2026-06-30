/**
 * Zips multiple arrays together and maps them through a callback function.
 */
export const ultraZipMap = <T extends any[], R>(
  ...args: [
    ...{ [K in keyof T]: T[K][] },
    (
      ...callbackArgs: [...{ [K in keyof T]: T[K] | null }, number, any[][]]
    ) => R,
  ]
): R[] => {
  // 1. Separate the callback from the data arrays
  const callback = args.pop() as (...callbackArgs: any[]) => R; // Removes and returns the last element (callback function)
  const arrays = args as any[][]; // Everything else left in args is your data

  // 2. Find the length of the longest array
  const maxLength = Math.max(...arrays.map((arr) => arr.length));

  // 3. Construct the new array
  return Array.from({ length: maxLength }, (_, index: number) => {
    // Takes one item at the current index, 1 from every array
    // having first array with all firsts items,
    // then having second array with all seconds items etc.
    const currentItems = arrays.map((arr) => arr[index] ?? null);

    // Spread the items into the callback, followed by index and all data
    return callback(...currentItems, index, arrays);
  });
};
