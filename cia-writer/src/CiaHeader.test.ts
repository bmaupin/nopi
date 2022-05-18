import { beforeAll, describe, expect, test } from 'vitest';

import { CiaHeader } from './CiaHeader';

let testCiaHeader: Blob;

beforeAll(() => {
  testCiaHeader = new CiaHeader({ certChainSize: 0 }).toBlob();
});

describe('header', () => {
  test('size in header should equal size of header', async () => {
    const dataView = new DataView(await testCiaHeader.arrayBuffer());
    expect(dataView.getInt32(0, true)).toBe(testCiaHeader.size);
  });
});
