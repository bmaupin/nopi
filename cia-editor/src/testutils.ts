// https://stackoverflow.com/a/50868276/399105
export const fromHexString = (hexString: string): Uint8Array => {
  return Uint8Array.from(
    hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
  );
};
