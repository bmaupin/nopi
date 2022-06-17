import { Blob } from 'fetch-blob';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { beforeAll, describe, expect, test } from 'vitest';

import { CiaFile } from './CiaFile';

let testCiaBlob: Blob;
let testCiaArrayBuffer: ArrayBuffer;

beforeAll(async () => {
  testCiaArrayBuffer = (await readFile(resolve(__dirname, 'testdata/test.cia')))
    .buffer;
  testCiaBlob = new Blob([testCiaArrayBuffer]);
});

describe('CiaFile', () => {
  test('Create new CiaFile from ArrayBuffer', () => {
    const ciaFile = new CiaFile(testCiaArrayBuffer);
    expect(ciaFile).toBeInstanceOf(CiaFile);
  });

  test('Create new CiaFile from Blob', async () => {
    const ciaFile = await CiaFile.fromBlob(testCiaBlob);
    expect(ciaFile).toBeInstanceOf(CiaFile);
  });
});
