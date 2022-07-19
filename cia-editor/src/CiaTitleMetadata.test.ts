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
