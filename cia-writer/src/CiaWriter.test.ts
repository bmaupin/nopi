import { Blob } from 'buffer';
import { beforeAll, describe, expect, test } from 'vitest';

import { CiaWriter } from './CiaWriter';

let testCiaFile: Blob;
let testCiaArrayBuffer: ArrayBuffer;

beforeAll(async () => {
  testCiaFile = await new CiaWriter().toBlob();
  testCiaArrayBuffer = await testCiaFile.arrayBuffer();
});

describe('CIA', () => {
  test('header is where it should be', () => {
    const dataView = new DataView(testCiaArrayBuffer);
    expect(dataView.getInt32(0x0)).toBe(0x20200000);
  });

  test('cert chain should be 64-byte aligned', () => {
    const dataView = new DataView(testCiaArrayBuffer);
    expect(dataView.getInt32(0x2440)).toBe(0x00010004);
  });
});
