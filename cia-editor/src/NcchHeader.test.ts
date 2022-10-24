import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { beforeAll, describe, expect, test } from 'vitest';
import { CiaFile } from './CiaFile';

import { CiaRomFs } from './CiaRomFs';
import { NcchExHeader } from './NcchExHeader';
import { NcchHeader } from './NcchHeader';
import {
  TEST_INITIAL_EXHEADER_HASH,
  TEST_INITIAL_NCCH_HEADER_SIGNATURE,
  TEST_INITIAL_ROMFS_HASH,
  TEST_INITIAL_TITLE_ID,
  TEST_NEW_TITLE_ID,
  TEST_TXT_INITIAL_CONTENT,
  TEST_TXT_NEW_CONTENT,
} from './testutils';

let testCiaRomFs: CiaRomFs;
let testNcchHeader: NcchHeader;
let testNcchExHeader: NcchExHeader;

beforeAll(async () => {
  const ciaArrayBuffer = (
    await readFile(resolve(__dirname, 'testdata/test.cia'))
  ).buffer;
  const ciaFile = new CiaFile(ciaArrayBuffer);
  testNcchHeader = ciaFile.ncchHeader;
  testNcchExHeader = ciaFile.ncchExHeader;
  testCiaRomFs = ciaFile.romFs;
});

describe('NCCH', () => {
  test('signature', () => {
    expect(testNcchHeader.signature.slice(0, 32)).toEqual(
      TEST_INITIAL_NCCH_HEADER_SIGNATURE
    );

    // Change the RomFS file content and make sure the signature changes
    testCiaRomFs.files[0].content = TEST_TXT_NEW_CONTENT;
    expect(testNcchHeader.signature.slice(0, 32)).not.toEqual(
      TEST_INITIAL_NCCH_HEADER_SIGNATURE
    );

    // Reset the content and check the signature again
    testCiaRomFs.files[0].content = TEST_TXT_INITIAL_CONTENT;
    expect(testNcchHeader.signature.slice(0, 32)).toEqual(
      TEST_INITIAL_NCCH_HEADER_SIGNATURE
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
    expect(testNcchHeader.signature.slice(0, 32)).not.toEqual(
      TEST_INITIAL_NCCH_HEADER_SIGNATURE
    );

    // Reset to the initial value
    testNcchHeader.titleId = TEST_INITIAL_TITLE_ID;
    expect(testNcchHeader.titleId).toEqual(TEST_INITIAL_TITLE_ID);
    expect(testNcchHeader.titleId).toEqual(TEST_INITIAL_TITLE_ID);
    expect(testNcchHeader.signature.slice(0, 32)).toEqual(
      TEST_INITIAL_NCCH_HEADER_SIGNATURE
    );
  });

  test('programId', () => {
    expect(testNcchHeader.programId).toEqual(TEST_INITIAL_TITLE_ID);
    expect(testNcchHeader.programId).toEqual(TEST_INITIAL_TITLE_ID);

    testNcchHeader.programId = TEST_NEW_TITLE_ID;
    expect(testNcchHeader.programId).toEqual(TEST_NEW_TITLE_ID);
    expect(testNcchHeader.programId).toEqual(TEST_NEW_TITLE_ID);
    expect(testNcchHeader.signature.slice(0, 32)).not.toEqual(
      TEST_INITIAL_NCCH_HEADER_SIGNATURE
    );

    testNcchHeader.programId = TEST_INITIAL_TITLE_ID;
    expect(testNcchHeader.programId).toEqual(TEST_INITIAL_TITLE_ID);
    expect(testNcchHeader.programId).toEqual(TEST_INITIAL_TITLE_ID);
    expect(testNcchHeader.signature.slice(0, 32)).toEqual(
      TEST_INITIAL_NCCH_HEADER_SIGNATURE
    );
  });

  test('get productCode', () => {
    expect(testNcchHeader.productCode).toEqual('CTR-P-CTAP');
  });

  test('ncchExHeaderHash', () => {
    expect(testNcchHeader.ncchExHeaderHash.slice(0, 32)).toEqual(
      TEST_INITIAL_EXHEADER_HASH
    );

    // Change the exheader jump ID and make sure the exheader hash changes
    testNcchExHeader.jumpId = TEST_NEW_TITLE_ID;
    expect(testNcchHeader.ncchExHeaderHash.slice(0, 32)).not.toEqual(
      TEST_INITIAL_EXHEADER_HASH
    );
    expect(testNcchHeader.signature.slice(0, 32)).not.toEqual(
      TEST_INITIAL_NCCH_HEADER_SIGNATURE
    );

    // Reset to the initial value and check again
    testNcchExHeader.jumpId = TEST_INITIAL_TITLE_ID;
    expect(testNcchHeader.ncchExHeaderHash.slice(0, 32)).toEqual(
      TEST_INITIAL_EXHEADER_HASH
    );
    expect(testNcchHeader.signature.slice(0, 32)).toEqual(
      TEST_INITIAL_NCCH_HEADER_SIGNATURE
    );
  });

  test('get romFsOffset', () => {
    expect(testNcchHeader.romFsOffset).toEqual(0x00008000);
  });

  test('get romFsSize', () => {
    expect(testNcchHeader.romFsSize).toEqual(0x00004000);
  });

  test('romFsHash', () => {
    expect(testNcchHeader.romFsHash).toEqual(TEST_INITIAL_ROMFS_HASH);

    // Change the RomFS file content and make sure the hash changes
    // (The only way to test this is to change something inside the RomFS)
    testCiaRomFs.files[0].content = TEST_TXT_NEW_CONTENT;
    expect(testNcchHeader.romFsHash).not.toEqual(TEST_INITIAL_ROMFS_HASH);
    expect(testNcchHeader.signature.slice(0, 32)).not.toEqual(
      TEST_INITIAL_NCCH_HEADER_SIGNATURE
    );

    // Reset the content and check the hash again
    testCiaRomFs.files[0].content = TEST_TXT_INITIAL_CONTENT;
    expect(testNcchHeader.romFsHash).toEqual(TEST_INITIAL_ROMFS_HASH);
    expect(testNcchHeader.signature.slice(0, 32)).toEqual(
      TEST_INITIAL_NCCH_HEADER_SIGNATURE
    );
  });
});
