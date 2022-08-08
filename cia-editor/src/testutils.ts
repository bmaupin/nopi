// https://stackoverflow.com/a/50868276/399105
export const fromHexString = (hexString: string): Uint8Array => {
  return Uint8Array.from(
    hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
  );
};

export const TEST_INITIAL_TITLE_ID = fromHexString('000400000ff3ff00');
export const TEST_NEW_TITLE_ID = fromHexString('000400000abcde00');

// Copied from ctrtool output
export const TEST_INITIAL_EXHEADER_HASH = fromHexString(
  '8B3BB6271FA0647588858F380B4EC8D05BBCC464B0E3CD1CBDA2CE68194BC609'
);
// This is just the first line of the signature from ctrtool
export const TEST_INITIAL_EXHEADER_SIGNATURE = fromHexString(
  '47608BA0669F6FED162395F40463B085CF1AC38EF153C198D02BF6910098D81E'
);

// This represents "test\n"
export const TEST_TXT_INITIAL_CONTENT = new Uint8Array([
  0x74, 0x65, 0x73, 0x74, 0x0a,
]);
// This represents "nopi\n"
export const TEST_TXT_NEW_CONTENT = new Uint8Array([
  0x6e, 0x6f, 0x70, 0x69, 0x0a,
]);
