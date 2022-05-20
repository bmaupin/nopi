import { Blob } from 'fetch-blob';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { beforeAll, describe, expect, test } from 'vitest';

import { CiaFile } from './CiaFile';

let testCiaBlob: Blob;

beforeAll(async () => {
  const testCiaBuffer = await readFile(resolve(__dirname, 'testdata/test.cia'));
  testCiaBlob = new Blob([testCiaBuffer]);
});

describe('CiaFile', () => {
  test('Create new CiaFile from file', () => {
    const ciaFile = CiaFile.fromBlob(testCiaBlob);
    expect(ciaFile).toBeInstanceOf(CiaFile);
  });
});
