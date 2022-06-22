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
      fromHexString('2DCB10B8')
    );
  });

  test('get titleId', () => {
    expect(testCiaTitleMetadata.titleId).toEqual(
      fromHexString('000400000ff3ff00')
    );
  });

  test('get contentSize', async () => {
    expect(testCiaTitleMetadata.contentSize).toEqual(BigInt(0x23000));
  });

  test('get contentHash', () => {
    expect(testCiaTitleMetadata.contentHash).toEqual(
      fromHexString(
        'A87279E2E1CBF46C60277F0166D1CCD5F7AF8FCF52E201EF9D555B90BD2044C7'
      )
    );
  });
});
