export const divideArrOnEqualParts = <T>(arr: T[], size: number) =>
  arr.reduceRight((res, _, __, self) => [...res, self.splice(0, size)], [] as T[][]);

export const createEmptyArr = (length: number, startNumber = 1) =>
  Array.from({ length }, (_, i) => i + startNumber);
