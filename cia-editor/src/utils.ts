export const calculateAlignedSize = (
  length: number,
  alignment: number
): number => {
  return length + (alignment - (length % alignment || alignment));
};

// Returns the total size of the signature section (signature type + signature + padding)
export const getSignatureSectionSize = (signatureType: Uint8Array) => {
  if (
    compareUint8Arrays(signatureType, new Uint8Array([0x00, 0x01, 0x00, 0x04]))
  ) {
    return 0x140;
  } else {
    throw new Error('Unknown signature type');
  }
};

export const getSignatureSize = (signatureType: Uint8Array) => {
  if (
    compareUint8Arrays(signatureType, new Uint8Array([0x00, 0x01, 0x00, 0x04]))
  ) {
    return 0x100;
  } else {
    throw new Error('Unknown signature type');
  }
};

// https://stackoverflow.com/a/19746771/399105
const compareUint8Arrays = (
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

export const randomBytes = (length: number): Uint8Array => {
  const intArray = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    intArray[i] = Math.floor(Math.random() * 0x100);
  }

  return intArray;
};
