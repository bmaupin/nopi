// https://stackoverflow.com/a/50868276/399105
export const fromHexString = (hexString: string): Uint8Array => {
  return Uint8Array.from(
    hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
  );
};

// Much of this is copied directly from ctrtool output

// ctrtool only returns the first part of the signature, which should be plenty just to test
export const TEST_INITIAL_TICKET_SIGNATURE = fromHexString('84C81489');
export const TEST_INITIAL_TITLE_KEY = fromHexString(
  '3A9F60D1AB3FFEA3B00816EB7B7CEB7E'
);
export const TEST_INITIAL_TICKET_ID = fromHexString('0004a13e80326061');
export const TEST_INITIAL_TITLE_ID = fromHexString('000400000ff3ff00');
export const TEST_NEW_TITLE_ID = fromHexString('000400000abcde00');

export const TEST_INITIAL_TMD_SIGNATURE = fromHexString('7A7F734B');
// To get this value: npx ts-node --files scripts/extract-content.ts src/testdata/test.cia 0x2fa4 0x2fc4
export const TEST_INITIAL_INFO_RECORD_HASH = new Uint8Array([
  0x0e, 0xb2, 0x23, 0x23, 0x2c, 0xb0, 0x8d, 0x2f, 0x5f, 0x6a, 0x73, 0x6a, 0x76,
  0x7f, 0x0c, 0x50, 0x03, 0x17, 0x8b, 0xca, 0xc6, 0x8f, 0x1b, 0xb0, 0xbf, 0xd1,
  0x05, 0x00, 0x8a, 0x23, 0x47, 0x32,
]);
// To get this value: npx ts-node --files scripts/extract-content.ts src/testdata/test.cia 0x2fc8 0x2fe8
export const TEST_INITIAL_CONTENT_CHUNK_HASH = new Uint8Array([
  0xb4, 0x78, 0x88, 0x9f, 0xdb, 0x8a, 0x50, 0xe0, 0xc3, 0xb1, 0x46, 0xa5, 0x9a,
  0xae, 0xc3, 0x43, 0x64, 0x62, 0x51, 0xc5, 0x37, 0xd3, 0x43, 0xe8, 0x12, 0x7d,
  0x74, 0x53, 0x91, 0x8e, 0x5e, 0x51,
]);
export const TEST_INITIAL_CHUNK_HASH = fromHexString(
  '44CC44CB6E1726BB4641122E0161560AFC9F5A974BF802152CC3A5C25EC45666'
);

// This is just the first line of the signature from ctrtool
export const TEST_INITIAL_NCCH_HEADER_SIGNATURE = fromHexString(
  '8F76B8644AAF4ADE7FA8B17440C53EB27329EA7E20864753FC2F98067DE00E74'
);
export const TEST_INITIAL_ROMFS_HASH = fromHexString(
  '9C27E3EE3C26C56BBB9851A72C13CE6A3A877ED9D17075AF8A11396AB524EE92'
);

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
