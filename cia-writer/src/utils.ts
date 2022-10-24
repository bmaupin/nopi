// const writeInt8 = (integer: number, destination: ArrayBuffer) => {
//   const dataView = new DataView(destination);
//   dataView.setInt8(0, integer);
// };

const calculateAlignedSize = (length: number, alignment: number) => {
  return length + (alignment - (length % alignment));
};

const randomBytes = (length: number): Uint8Array => {
  const intArray = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    intArray[i] = Math.floor(Math.random() * 0x100);
  }

  return intArray;
};

// const writeInt64 = (
//   integer: bigint,
//   destination: ArrayBuffer,
//   littleEndian?: boolean
// ) => {
//   const dataView = new DataView(destination);
//   dataView.setBigUint64(0, integer, littleEndian);
// };

export default { calculateAlignedSize, randomBytes };
