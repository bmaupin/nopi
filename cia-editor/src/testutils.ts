// This represents "test\n"
export const TEST_TXT_INITIAL_CONTENT = new Uint8Array([
  0x74, 0x65, 0x73, 0x74, 0x0a,
]);
// This represents "nopi\n"
export const TEST_TXT_NEW_CONTENT = new Uint8Array([
  0x6e, 0x6f, 0x70, 0x69, 0x0a,
]);

// https://stackoverflow.com/a/50868276/399105
export const fromHexString = (hexString: string): Uint8Array => {
  return Uint8Array.from(
    hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
  );
};
