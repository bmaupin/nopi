import { Blob } from 'fetch-blob';
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { beforeAll, describe, expect, test } from 'vitest';

import { CiaFile } from './CiaFile';
import {
  fromHexString,
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

  test('get titleId', () => {
    expect(testCiaFile.titleId).toEqual(fromHexString('000400000ff3ff00'));
  });

  test('set titleId', () => {
    testCiaFile.titleId = fromHexString('000400009f07c400');

    expect(testCiaFile.titleId).toEqual(fromHexString('000400009f07c400'));

    expect(testCiaFile.ticket.titleId).toEqual(
      fromHexString('000400009f07c400')
    );
    expect(testCiaFile.ticket.ticketId).not.toEqual(
      fromHexString('0004a13e80326061')
    );
    expect(testCiaFile.ticket.titleKey).not.toEqual(
      fromHexString('3A9F60D1AB3FFEA3B00816EB7B7CEB7E')
    );
    expect(testCiaFile.ticket.signature.slice(0, 4)).not.toEqual(
      fromHexString('84C81489')
    );

    expect(testCiaFile.titleMetadata.titleId).toEqual(
      fromHexString('000400009f07c400')
    );
    expect(testCiaFile.titleMetadata.signature.slice(0, 4)).not.toEqual(
      fromHexString('7A7F734B')
    );

    expect(testCiaFile.ncchHeader.titleId).toEqual(
      fromHexString('000400009f07c400')
    );
    expect(testCiaFile.ncchHeader.programId).toEqual(
      fromHexString('000400009f07c400')
    );
    expect(testCiaFile.ncchHeader.signature.slice(0, 32)).not.toEqual(
      fromHexString(
        '8F76B8644AAF4ADE7FA8B17440C53EB27329EA7E20864753FC2F98067DE00E74'
      )
    );
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
