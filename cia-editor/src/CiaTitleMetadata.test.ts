import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { beforeAll, describe, expect, test } from 'vitest';
import { CiaFile } from './CiaFile';

import { CiaTitleMetadata } from './CiaTitleMetadata';
import { fromHexString } from './testutils';

let testCiaTitleMetadata: CiaTitleMetadata;

beforeAll(async () => {
  const ciaArrayBuffer = (
    await readFile(resolve(__dirname, 'testdata/test.cia'))
  ).buffer;
  const ciaFile = new CiaFile(ciaArrayBuffer);
  testCiaTitleMetadata = ciaFile.titleMetadata;
});

describe('title metadata', () => {
  test('get signature', () => {
    // ctrtool only returns the first part of the signature, which should be plenty just to test
    expect(testCiaTitleMetadata.signature.slice(0, 4)).toEqual(
      fromHexString('7A7F734B')
    );
  });

  test('get titleId', () => {
    expect(testCiaTitleMetadata.titleId).toEqual(
      fromHexString('000400000ff3ff00')
    );
  });

  // To get this value: npx ts-node --files ../cia-writer/scripts/extract-content.ts src/testdata/test.cia 0x2fa4 0x2fc4
  test('get infoRecordHash', () => {
    expect(testCiaTitleMetadata.infoRecordHash).toEqual(
      new Uint8Array([
        0x0e, 0xb2, 0x23, 0x23, 0x2c, 0xb0, 0x8d, 0x2f, 0x5f, 0x6a, 0x73, 0x6a,
        0x76, 0x7f, 0x0c, 0x50, 0x03, 0x17, 0x8b, 0xca, 0xc6, 0x8f, 0x1b, 0xb0,
        0xbf, 0xd1, 0x05, 0x00, 0x8a, 0x23, 0x47, 0x32,
      ])
    );
  });

  // To get this value: npx ts-node --files ../cia-writer/scripts/extract-content.ts src/testdata/test.cia 0x2fc8 0x2fe8
  test('get contentChunkHash', () => {
    expect(testCiaTitleMetadata.contentChunkHash).toEqual(
      new Uint8Array([
        0xb4, 0x78, 0x88, 0x9f, 0xdb, 0x8a, 0x50, 0xe0, 0xc3, 0xb1, 0x46, 0xa5,
        0x9a, 0xae, 0xc3, 0x43, 0x64, 0x62, 0x51, 0xc5, 0x37, 0xd3, 0x43, 0xe8,
        0x12, 0x7d, 0x74, 0x53, 0x91, 0x8e, 0x5e, 0x51,
      ])
    );
  });

  test('get contentSize', () => {
    expect(testCiaTitleMetadata.contentSize).toEqual(BigInt(0xc000));
  });

  test('get contentHash', () => {
    expect(testCiaTitleMetadata.contentHash).toEqual(
      fromHexString(
        '44CC44CB6E1726BB4641122E0161560AFC9F5A974BF802152CC3A5C25EC45666'
      )
    );
  });
});
