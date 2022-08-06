import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { beforeAll, describe, expect, test } from 'vitest';
import { CiaFile } from './CiaFile';

import { CiaRomFs } from './CiaRomFs';
import { NcchHeader } from './NcchHeader';
import {
  fromHexString,
  TEST_INITIAL_TITLE_ID,
  TEST_NEW_TITLE_ID,
  TEST_TXT_INITIAL_CONTENT,
  TEST_TXT_NEW_CONTENT,
} from './testutils';

let testCiaRomFs: CiaRomFs;
let testNcchHeader: NcchHeader;

beforeAll(async () => {
  const ciaArrayBuffer = (
    await readFile(resolve(__dirname, 'testdata/test.cia'))
  ).buffer;
  const ciaFile = new CiaFile(ciaArrayBuffer);
  testNcchHeader = ciaFile.ncchHeader;
  testCiaRomFs = ciaFile.romFs;
});

describe('NCCH', () => {
  test('signature', () => {
    // Change the RomFS file content and make sure the signature changes
    testCiaRomFs.files[0].content = TEST_TXT_NEW_CONTENT;
    expect(testNcchHeader.signature.slice(0, 32)).not.toEqual(
      fromHexString(
        '8F76B8644AAF4ADE7FA8B17440C53EB27329EA7E20864753FC2F98067DE00E74'
      )
    );

    // Reset the content and check the signature again
    testCiaRomFs.files[0].content = TEST_TXT_INITIAL_CONTENT;
    expect(testNcchHeader.signature.slice(0, 32)).toEqual(
      // Just compare the first line of the signature from ctrtool
      fromHexString(
        '8F76B8644AAF4ADE7FA8B17440C53EB27329EA7E20864753FC2F98067DE00E74'
      )
    );
  });

  test('get contentSize', () => {
    expect(testNcchHeader.contentSize).toEqual(0x0000c000);
  });

  test('titleId', () => {
    expect(testNcchHeader.titleId).toEqual(TEST_INITIAL_TITLE_ID);
    // Read the title ID twice; this is intentional because it's stored in reverse and
    // there was a bug where reading it would reverse the data in place
    expect(testNcchHeader.titleId).toEqual(TEST_INITIAL_TITLE_ID);

    testNcchHeader.titleId = TEST_NEW_TITLE_ID;
    expect(testNcchHeader.titleId).toEqual(TEST_NEW_TITLE_ID);
    expect(testNcchHeader.titleId).toEqual(TEST_NEW_TITLE_ID);

    // Reset to the initial value
    testNcchHeader.titleId = TEST_INITIAL_TITLE_ID;
    expect(testNcchHeader.titleId).toEqual(TEST_INITIAL_TITLE_ID);
    expect(testNcchHeader.titleId).toEqual(TEST_INITIAL_TITLE_ID);
  });

  test('programId', () => {
    expect(testNcchHeader.programId).toEqual(TEST_INITIAL_TITLE_ID);
    expect(testNcchHeader.programId).toEqual(TEST_INITIAL_TITLE_ID);

    testNcchHeader.programId = TEST_NEW_TITLE_ID;
    expect(testNcchHeader.programId).toEqual(TEST_NEW_TITLE_ID);
    expect(testNcchHeader.programId).toEqual(TEST_NEW_TITLE_ID);

    testNcchHeader.programId = TEST_INITIAL_TITLE_ID;
    expect(testNcchHeader.programId).toEqual(TEST_INITIAL_TITLE_ID);
    expect(testNcchHeader.programId).toEqual(TEST_INITIAL_TITLE_ID);
  });

  test('get productCode', () => {
    expect(testNcchHeader.productCode).toEqual('CTR-P-CTAP');
  });

  test('get romFsOffset', () => {
    expect(testNcchHeader.romFsOffset).toEqual(0x00008000);
  });

  test('get romFsSize', () => {
    expect(testNcchHeader.romFsSize).toEqual(0x00004000);
  });

  test('romFsHash', () => {
    // Change the RomFS file content and make sure the hash changes
    // (The only way to test this is to change something inside the RomFS)
    testCiaRomFs.files[0].content = TEST_TXT_NEW_CONTENT;
    expect(testNcchHeader.romFsHash).not.toEqual(
      fromHexString(
        '9C27E3EE3C26C56BBB9851A72C13CE6A3A877ED9D17075AF8A11396AB524EE92'
      )
    );

    // Reset the content and check the hash again
    testCiaRomFs.files[0].content = TEST_TXT_INITIAL_CONTENT;
    expect(testNcchHeader.romFsHash).toEqual(
      fromHexString(
        '9C27E3EE3C26C56BBB9851A72C13CE6A3A877ED9D17075AF8A11396AB524EE92'
      )
    );
  });
});
