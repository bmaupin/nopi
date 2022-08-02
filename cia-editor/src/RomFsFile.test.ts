import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { beforeAll, describe, expect, test } from 'vitest';

import { CiaFile } from './CiaFile';
import { CiaRomFs } from './CiaRomFs';

let testCiaRomFs: CiaRomFs;

beforeAll(async () => {
  const ciaArrayBuffer = (
    await readFile(resolve(__dirname, 'testdata/test.cia'))
  ).buffer;
  const ciaFile = new CiaFile(ciaArrayBuffer);
  testCiaRomFs = ciaFile.romFs;
});

describe('RomFS file', () => {
  test('set file content', () => {
    // This represents "nopi\n"
    testCiaRomFs.files[0].content = new Uint8Array([
      0x6e, 0x6f, 0x70, 0x69, 0x0a,
    ]);
    expect(testCiaRomFs.files[0].content).toEqual(
      new Uint8Array([0x6e, 0x6f, 0x70, 0x69, 0x0a])
    );
  });
});
