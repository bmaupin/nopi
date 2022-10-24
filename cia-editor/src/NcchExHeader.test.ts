import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { beforeAll, describe, expect, test } from 'vitest';
import { CiaFile } from './CiaFile';

import { NcchExHeader } from './NcchExHeader';
import {
  TEST_INITIAL_EXHEADER_SIGNATURE,
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
  test('signature', () => {
    expect(testCiaNcchExHeader.signature.slice(0, 32)).toEqual(
      TEST_INITIAL_EXHEADER_SIGNATURE
    );

    // Change something inside the section used to calculate the signature
    testCiaNcchExHeader.aci2ProgramId = TEST_NEW_TITLE_ID;
    expect(testCiaNcchExHeader.signature.slice(0, 32)).not.toEqual(
      TEST_INITIAL_EXHEADER_SIGNATURE
    );

    // Reset the property and check the signature again
    testCiaNcchExHeader.aci2ProgramId = TEST_INITIAL_TITLE_ID;
    expect(testCiaNcchExHeader.signature.slice(0, 32)).toEqual(
      TEST_INITIAL_EXHEADER_SIGNATURE
    );
  });

  test('jumpId', () => {
    // See NCCH title ID for why we test this twice
    expect(testCiaNcchExHeader.jumpId).toEqual(TEST_INITIAL_TITLE_ID);
    expect(testCiaNcchExHeader.jumpId).toEqual(TEST_INITIAL_TITLE_ID);

    testCiaNcchExHeader.jumpId = TEST_NEW_TITLE_ID;
    expect(testCiaNcchExHeader.jumpId).toEqual(TEST_NEW_TITLE_ID);
    expect(testCiaNcchExHeader.jumpId).toEqual(TEST_NEW_TITLE_ID);
    expect(testCiaNcchExHeader.signature.slice(0, 32)).toEqual(
      TEST_INITIAL_EXHEADER_SIGNATURE
    );

    testCiaNcchExHeader.jumpId = TEST_INITIAL_TITLE_ID;
    expect(testCiaNcchExHeader.jumpId).toEqual(TEST_INITIAL_TITLE_ID);
    expect(testCiaNcchExHeader.jumpId).toEqual(TEST_INITIAL_TITLE_ID);
    expect(testCiaNcchExHeader.signature.slice(0, 32)).toEqual(
      TEST_INITIAL_EXHEADER_SIGNATURE
    );
  });

  test('programId', () => {
    expect(testCiaNcchExHeader.programId).toEqual(TEST_INITIAL_TITLE_ID);
    expect(testCiaNcchExHeader.programId).toEqual(TEST_INITIAL_TITLE_ID);

    testCiaNcchExHeader.programId = TEST_NEW_TITLE_ID;
    expect(testCiaNcchExHeader.programId).toEqual(TEST_NEW_TITLE_ID);
    expect(testCiaNcchExHeader.programId).toEqual(TEST_NEW_TITLE_ID);
    expect(testCiaNcchExHeader.signature.slice(0, 32)).toEqual(
      TEST_INITIAL_EXHEADER_SIGNATURE
    );

    testCiaNcchExHeader.programId = TEST_INITIAL_TITLE_ID;
    expect(testCiaNcchExHeader.programId).toEqual(TEST_INITIAL_TITLE_ID);
    expect(testCiaNcchExHeader.programId).toEqual(TEST_INITIAL_TITLE_ID);
    expect(testCiaNcchExHeader.signature.slice(0, 32)).toEqual(
      TEST_INITIAL_EXHEADER_SIGNATURE
    );
  });

  test('aci2ProgramId', () => {
    expect(testCiaNcchExHeader.aci2ProgramId).toEqual(TEST_INITIAL_TITLE_ID);
    expect(testCiaNcchExHeader.aci2ProgramId).toEqual(TEST_INITIAL_TITLE_ID);

    testCiaNcchExHeader.aci2ProgramId = TEST_NEW_TITLE_ID;
    expect(testCiaNcchExHeader.aci2ProgramId).toEqual(TEST_NEW_TITLE_ID);
    expect(testCiaNcchExHeader.aci2ProgramId).toEqual(TEST_NEW_TITLE_ID);
    expect(testCiaNcchExHeader.signature.slice(0, 32)).not.toEqual(
      TEST_INITIAL_EXHEADER_SIGNATURE
    );

    testCiaNcchExHeader.aci2ProgramId = TEST_INITIAL_TITLE_ID;
    expect(testCiaNcchExHeader.aci2ProgramId).toEqual(TEST_INITIAL_TITLE_ID);
    expect(testCiaNcchExHeader.aci2ProgramId).toEqual(TEST_INITIAL_TITLE_ID);
    expect(testCiaNcchExHeader.signature.slice(0, 32)).toEqual(
      TEST_INITIAL_EXHEADER_SIGNATURE
    );
  });
});
