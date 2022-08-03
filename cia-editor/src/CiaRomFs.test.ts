import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { beforeAll, describe, expect, test } from 'vitest';

import { CiaFile } from './CiaFile';
import { CiaRomFs } from './CiaRomFs';

// This represents "test\n"
const TEST_TXT_CONTENT = new Uint8Array([0x74, 0x65, 0x73, 0x74, 0x0a]);
// This represents "nopi\n"
const TEST_TXT_NEW_CONTENT = new Uint8Array([0x6e, 0x6f, 0x70, 0x69, 0x0a]);

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
    expect(testCiaRomFs.masterHashesSize).toBe(0x20);
  });

  test('get level1Size', () => {
    expect(testCiaRomFs.level1Size).toBe(0x20);
  });

  test('get level1BlockSize', () => {
    expect(testCiaRomFs.level1BlockSize).toBe(0x1000);
  });

  test('get level2Size', () => {
    expect(testCiaRomFs.level2Size).toBe(0x20);
  });

  test('get level3Size', () => {
    expect(testCiaRomFs.level3Size).toBe(0x95);
  });

  test('get level3BlockSize', () => {
    expect(testCiaRomFs.level3BlockSize).toBe(0x1000);
  });

  test('masterHashes', () => {
    expect(testCiaRomFs.masterHashes.length).toBe(1);
    expect(testCiaRomFs.masterHashes[0]).toEqual(
      // To get this value: npx ts-node --files ../cia-writer/scripts/extract-content.ts src/testdata/test.cia 0xb960 0xb980
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

  test('get fileDataOffset', () => {
    expect(testCiaRomFs.fileDataOffset).toBe(0x90);
  });

  test('get files', () => {
    expect(testCiaRomFs.files.length).toBe(1);
    expect(testCiaRomFs.files[0].name).toEqual('test.txt');
    expect(testCiaRomFs.files[0].content).toEqual(TEST_TXT_CONTENT);
  });

  test('level1Hashes', () => {
    testCiaRomFs.files[0].content = TEST_TXT_CONTENT;
    expect(testCiaRomFs.level1Hashes.length).toBe(1);
    expect(testCiaRomFs.level1Hashes[0]).toEqual(
      // To get this value: npx ts-node --files ../cia-writer/scripts/extract-content.ts src/testdata/test.cia 0xd900 0xd920
      new Uint8Array([
        0x59, 0xf8, 0xa2, 0x29, 0x1d, 0xe0, 0xb8, 0xe4, 0xf6, 0xb7, 0xc4, 0x53,
        0x11, 0x03, 0x3d, 0xf9, 0x06, 0xd6, 0xd2, 0x1a, 0x17, 0x83, 0x02, 0x0a,
        0x8c, 0xe9, 0x6c, 0x64, 0x33, 0x5d, 0xf7, 0xd7,
      ])
    );

    // Change the RomFS file content and make sure the hash changes
    testCiaRomFs.files[0].content = TEST_TXT_NEW_CONTENT;
    expect(testCiaRomFs.level1Hashes.length).toBe(1);
    expect(testCiaRomFs.level1Hashes[0]).not.toEqual(
      new Uint8Array([
        0x59, 0xf8, 0xa2, 0x29, 0x1d, 0xe0, 0xb8, 0xe4, 0xf6, 0xb7, 0xc4, 0x53,
        0x11, 0x03, 0x3d, 0xf9, 0x06, 0xd6, 0xd2, 0x1a, 0x17, 0x83, 0x02, 0x0a,
        0x8c, 0xe9, 0x6c, 0x64, 0x33, 0x5d, 0xf7, 0xd7,
      ])
    );
  });

  test('level2Hashes', () => {
    testCiaRomFs.files[0].content = TEST_TXT_CONTENT;
    expect(testCiaRomFs.level2Hashes.length).toBe(1);
    expect(testCiaRomFs.level2Hashes[0]).toEqual(
      // To get this value: npx ts-node --files ../cia-writer/scripts/extract-content.ts src/testdata/test.cia 0xe900 0xe920
      new Uint8Array([
        0xa7, 0xf4, 0xf8, 0xd9, 0x05, 0x6c, 0x66, 0xd5, 0x5e, 0x71, 0x83, 0x30,
        0x37, 0xac, 0xe1, 0xd9, 0x9c, 0x90, 0xed, 0xeb, 0xc9, 0xb2, 0xbf, 0x8b,
        0xa8, 0x5a, 0x0e, 0xfd, 0x46, 0x9d, 0xe0, 0xf6,
      ])
    );

    // Change the RomFS file content and make sure the hash changes
    testCiaRomFs.files[0].content = TEST_TXT_NEW_CONTENT;
    expect(testCiaRomFs.level2Hashes.length).toBe(1);
    expect(testCiaRomFs.level2Hashes[0]).not.toEqual(
      new Uint8Array([
        0xa7, 0xf4, 0xf8, 0xd9, 0x05, 0x6c, 0x66, 0xd5, 0x5e, 0x71, 0x83, 0x30,
        0x37, 0xac, 0xe1, 0xd9, 0x9c, 0x90, 0xed, 0xeb, 0xc9, 0xb2, 0xbf, 0x8b,
        0xa8, 0x5a, 0x0e, 0xfd, 0x46, 0x9d, 0xe0, 0xf6,
      ])
    );
  });
});
