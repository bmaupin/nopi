export const calculateAlignedSize = (
  length: number,
  alignment: number
): number => {
  return length + (alignment - (length % alignment));
};

// https://stackoverflow.com/a/19746771/399105
export const compareUint8Arrays = (
  array1: Uint8Array,
  array2: Uint8Array
): boolean => {
  return (
    array1.length === array2.length &&
    array1.every(function (value, index: number) {
      return value === array2[index];
    })
  );
};
