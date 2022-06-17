import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { beforeAll, describe, expect, test } from 'vitest';
import { CiaFile } from './CiaFile';

import { CiaHeader } from './CiaHeader';

let testCiaHeader: CiaHeader;

beforeAll(async () => {
  const ciaArrayBuffer = (
    await readFile(resolve(__dirname, 'testdata/test.cia'))
  ).buffer;
  const ciaFile = new CiaFile(ciaArrayBuffer);
  testCiaHeader = ciaFile.header;
});

describe('header', () => {
  test('get size', async () => {
    expect(testCiaHeader.size).toBe(0x2020);
  });

  test('get contentSize', async () => {
    expect(testCiaHeader.contentSize).toBe(BigInt(0x23000));
  });
});
