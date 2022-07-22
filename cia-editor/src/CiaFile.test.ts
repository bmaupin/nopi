import { Blob } from 'fetch-blob';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { beforeAll, describe, expect, test } from 'vitest';

import { CiaFile } from './CiaFile';
import { fromHexString } from './testutils';

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

    expect(testCiaFile.titleMetadata.titleId).toEqual(
      fromHexString('000400009f07c400')
    );
    expect(testCiaFile.ncch.titleId).toEqual(fromHexString('000400009f07c400'));
    expect(testCiaFile.ncch.programId).toEqual(
      fromHexString('000400009f07c400')
    );
  });
});
