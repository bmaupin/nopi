import { Blob } from 'buffer';
import { beforeAll, describe, expect, test } from 'vitest';

import { CiaHeader } from './CiaHeader';

let testCiaHeader: Blob;

beforeAll(() => {
  testCiaHeader = new CiaHeader().write();
});

describe('header', () => {
  test('header size', async () => {
    const dataView = new DataView(await testCiaHeader.arrayBuffer());
    expect(dataView.getInt32(0, true)).toBe(0x2020);
  });
});
