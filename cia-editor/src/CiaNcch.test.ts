import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { beforeAll, describe, expect, test } from 'vitest';
import { CiaFile } from './CiaFile';

import { CiaNcch } from './CiaNcch';
import { CiaRomFs } from './CiaRomFs';
import {
  fromHexString,
  TEST_TXT_INITIAL_CONTENT,
  TEST_TXT_NEW_CONTENT,
} from './testutils';

let testCiaNcch: CiaNcch;
let testCiaRomFs: CiaRomFs;

beforeAll(async () => {
  const ciaArrayBuffer = (
    await readFile(resolve(__dirname, 'testdata/test.cia'))
  ).buffer;
  const ciaFile = new CiaFile(ciaArrayBuffer);
  testCiaNcch = ciaFile.ncch;
  testCiaRomFs = ciaFile.romFs;
});

describe('NCCH', () => {
  test('get signature', () => {
    // just compare the first line of the signature from ctrtool
    expect(testCiaNcch.signature.slice(0, 32)).toEqual(
      fromHexString(
        '8F76B8644AAF4ADE7FA8B17440C53EB27329EA7E20864753FC2F98067DE00E74'
      )
    );
  });

  // Regenerate the signature in-place and make sure it doesn't chagne
  test('updateSignature', () => {
    testCiaNcch.updateSignature();
    expect(testCiaNcch.signature.slice(0, 32)).toEqual(
      fromHexString(
        '8F76B8644AAF4ADE7FA8B17440C53EB27329EA7E20864753FC2F98067DE00E74'
      )
    );
  });

  test('get contentSize', () => {
    expect(testCiaNcch.contentSize).toEqual(0x0000c000);
  });

  test('get titleId', () => {
    expect(testCiaNcch.titleId).toEqual(fromHexString('000400000ff3ff00'));
  });

  test('get programId', () => {
    expect(testCiaNcch.programId).toEqual(fromHexString('000400000ff3ff00'));
  });

  test('get productCode', () => {
    expect(testCiaNcch.productCode).toEqual('CTR-P-CTAP');
  });

  test('get romFsOffset', () => {
    expect(testCiaNcch.romFsOffset).toEqual(0x00008000);
  });

  test('get romFsSize', () => {
    expect(testCiaNcch.romFsSize).toEqual(0x00004000);
  });

  test('romFsHash', () => {
    // Change the RomFS file content and make sure the hash changes
    // (The only way to test this is to change something inside the RomFS)
    testCiaRomFs.files[0].content = TEST_TXT_NEW_CONTENT;
    expect(testCiaNcch.romFsHash).not.toEqual(
      fromHexString(
        '9C27E3EE3C26C56BBB9851A72C13CE6A3A877ED9D17075AF8A11396AB524EE92'
      )
    );

    // Reset the content and check the hash again
    testCiaRomFs.files[0].content = TEST_TXT_INITIAL_CONTENT;
    expect(testCiaNcch.romFsHash).toEqual(
      fromHexString(
        '9C27E3EE3C26C56BBB9851A72C13CE6A3A877ED9D17075AF8A11396AB524EE92'
      )
    );
  });
});
