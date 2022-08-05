import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { beforeAll, describe, expect, test } from 'vitest';
import { CiaFile } from './CiaFile';

import { NcchExHeader } from './NcchExHeader';
import {
  fromHexString,
  TEST_INITIAL_TITLE_ID,
  TEST_NEW_TITLE_ID,
} from './testutils';

let testCiaNcchExHeader: NcchExHeader;

beforeAll(async () => {
  const ciaArrayBuffer = (
    await readFile(resolve(__dirname, 'testdata/test.cia'))
  ).buffer;
  const ciaFile = new CiaFile(ciaArrayBuffer);
  testCiaNcchExHeader = ciaFile.ncchExHeader;
});

describe('NCCH', () => {
  // test('signature', () => {
  //   // Change the RomFS file content and make sure the signature changes
  //   testCiaRomFs.files[0].content = TEST_TXT_NEW_CONTENT;
  //   expect(testCiaNcchExHeader.signature.slice(0, 32)).not.toEqual(
  //     fromHexString(
  //       '8F76B8644AAF4ADE7FA8B17440C53EB27329EA7E20864753FC2F98067DE00E74'
  //     )
  //   );

  //   // Reset the content and check the signature again
  //   testCiaRomFs.files[0].content = TEST_TXT_INITIAL_CONTENT;
  //   expect(testCiaNcchExHeader.signature.slice(0, 32)).toEqual(
  //     // Just compare the first line of the signature from ctrtool
  //     fromHexString(
  //       '8F76B8644AAF4ADE7FA8B17440C53EB27329EA7E20864753FC2F98067DE00E74'
  //     )
  //   );
  // });

  test('jumpId', () => {
    // See NCCH title ID for why we test this twice
    expect(testCiaNcchExHeader.jumpId).toEqual(TEST_INITIAL_TITLE_ID);
    expect(testCiaNcchExHeader.jumpId).toEqual(TEST_INITIAL_TITLE_ID);

    testCiaNcchExHeader.jumpId = TEST_NEW_TITLE_ID;
    expect(testCiaNcchExHeader.jumpId).toEqual(TEST_NEW_TITLE_ID);
    expect(testCiaNcchExHeader.jumpId).toEqual(TEST_NEW_TITLE_ID);

    testCiaNcchExHeader.jumpId = TEST_INITIAL_TITLE_ID;
    expect(testCiaNcchExHeader.jumpId).toEqual(TEST_INITIAL_TITLE_ID);
    expect(testCiaNcchExHeader.jumpId).toEqual(TEST_INITIAL_TITLE_ID);
  });

  test('programId', () => {
    expect(testCiaNcchExHeader.programId).toEqual(TEST_INITIAL_TITLE_ID);
    expect(testCiaNcchExHeader.programId).toEqual(TEST_INITIAL_TITLE_ID);

    testCiaNcchExHeader.programId = TEST_NEW_TITLE_ID;
    expect(testCiaNcchExHeader.programId).toEqual(TEST_NEW_TITLE_ID);
    expect(testCiaNcchExHeader.programId).toEqual(TEST_NEW_TITLE_ID);

    testCiaNcchExHeader.programId = TEST_INITIAL_TITLE_ID;
    expect(testCiaNcchExHeader.programId).toEqual(TEST_INITIAL_TITLE_ID);
    expect(testCiaNcchExHeader.programId).toEqual(TEST_INITIAL_TITLE_ID);
  });

  test('aci2ProgramId', () => {
    expect(testCiaNcchExHeader.aci2ProgramId).toEqual(TEST_INITIAL_TITLE_ID);
    expect(testCiaNcchExHeader.aci2ProgramId).toEqual(TEST_INITIAL_TITLE_ID);

    testCiaNcchExHeader.aci2ProgramId = TEST_NEW_TITLE_ID;
    expect(testCiaNcchExHeader.aci2ProgramId).toEqual(TEST_NEW_TITLE_ID);
    expect(testCiaNcchExHeader.aci2ProgramId).toEqual(TEST_NEW_TITLE_ID);

    testCiaNcchExHeader.aci2ProgramId = TEST_INITIAL_TITLE_ID;
    expect(testCiaNcchExHeader.aci2ProgramId).toEqual(TEST_INITIAL_TITLE_ID);
    expect(testCiaNcchExHeader.aci2ProgramId).toEqual(TEST_INITIAL_TITLE_ID);
  });
});
