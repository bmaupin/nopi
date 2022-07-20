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

describe('RomFS', () => {
  test('get magic', () => {
    expect(testCiaRomFs.magic).toEqual(
      new Uint8Array([0x49, 0x56, 0x46, 0x43, 0x00, 0x00, 0x01, 0x00])
    );
  });

  test('get masterHashSize', () => {
    expect(testCiaRomFs.masterHashSize).toBe(0x20);
  });

  test('get level2HashdataSize', () => {
    expect(testCiaRomFs.level2HashdataSize).toBe(BigInt(0x20));
  });

  test('get level3HashdataSize', () => {
    expect(testCiaRomFs.level3HashdataSize).toBe(BigInt(0x95));
  });

  // To get this value: npx ts-node --files ../cia-writer/scripts/extract-content.ts src/testdata/test.cia 0xb960 0xb980
  test('get masterHash', () => {
    expect(testCiaRomFs.masterHash).toEqual(
      new Uint8Array([
        0x34, 0x25, 0x1f, 0x69, 0xf7, 0xed, 0x8c, 0x4c, 0x40, 0x72, 0x59, 0x35,
        0xb6, 0xf9, 0x68, 0x39, 0xdd, 0xec, 0x56, 0x5c, 0x7d, 0x3a, 0xd5, 0xb5,
        0x17, 0xa5, 0xae, 0x2d, 0xac, 0xee, 0x3e, 0xa7,
      ])
    );
  });

  test('get fileTableOffset', () => {
    expect(testCiaRomFs.fileTableOffset).toBe(0x58);
  });

  test('get fileTableLength', () => {
    expect(testCiaRomFs.fileTableLength).toBe(0x30);
  });

  test('get files', () => {
    expect(testCiaRomFs.files[0].fileName).toEqual('test.txt');
  });
});
