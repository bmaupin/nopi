import { Blob } from 'fetch-blob';
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { beforeAll, describe, expect, test } from 'vitest';

import { CiaFile } from './CiaFile';
import {
  fromHexString,
  TEST_INITIAL_TITLE_ID,
  TEST_NEW_TITLE_ID,
  TEST_TXT_INITIAL_CONTENT,
  TEST_TXT_NEW_CONTENT,
} from './testutils';

let testCiaBlob: Blob;
let testCiaArrayBuffer: ArrayBuffer;
let testCiaFile: CiaFile;

beforeAll(async () => {
  testCiaArrayBuffer = (await readFile(resolve(__dirname, 'testdata/test.cia')))
    .buffer;
  testCiaBlob = new Blob([testCiaArrayBuffer]);
});

describe('CiaFile', () => {
  test('Create new CiaFile from ArrayBuffer', () => {
    testCiaFile = new CiaFile(testCiaArrayBuffer);
    expect(testCiaFile).toBeInstanceOf(CiaFile);
  });

  test('Create new CiaFile from Blob', async () => {
    const ciaFile = await CiaFile.fromBlob(testCiaBlob);
    expect(ciaFile).toBeInstanceOf(CiaFile);
  });

  test('titleId', () => {
    expect(testCiaFile.titleId).toEqual(TEST_INITIAL_TITLE_ID);

    // Update the title ID and make sure it gets updated everywhere it should
    testCiaFile.titleId = TEST_NEW_TITLE_ID;

    expect(testCiaFile.titleId).toEqual(TEST_NEW_TITLE_ID);

    expect(testCiaFile.ticket.titleId).toEqual(TEST_NEW_TITLE_ID);
    expect(testCiaFile.ticket.ticketId).not.toEqual(
      fromHexString('0004a13e80326061')
    );
    expect(testCiaFile.ticket.titleKey).not.toEqual(
      fromHexString('3A9F60D1AB3FFEA3B00816EB7B7CEB7E')
    );

    expect(testCiaFile.titleMetadata.titleId).toEqual(TEST_NEW_TITLE_ID);

    expect(testCiaFile.ncchHeader.titleId).toEqual(TEST_NEW_TITLE_ID);
    expect(testCiaFile.ncchHeader.programId).toEqual(TEST_NEW_TITLE_ID);

    expect(testCiaFile.ncchExHeader.jumpId).toEqual(TEST_NEW_TITLE_ID);
    expect(testCiaFile.ncchExHeader.programId).toEqual(TEST_NEW_TITLE_ID);
    expect(testCiaFile.ncchExHeader.aci2ProgramId).toEqual(TEST_NEW_TITLE_ID);

    testCiaFile.titleId = TEST_INITIAL_TITLE_ID;
  });

  // Enable this manually for testing as needed
  test.skip('write CIA file', async () => {
    // Set new RomFS file content and write the CIA file
    testCiaFile.romFs.files[0].content = TEST_TXT_NEW_CONTENT;

    await writeFile(
      resolve(__dirname, 'testdata/out.cia'),
      Buffer.from(await testCiaFile.toBlob().arrayBuffer())
    );

    // Reset the RomFS file content to prevent breaking other tests
    testCiaFile.romFs.files[0].content = TEST_TXT_INITIAL_CONTENT;
  });
});
