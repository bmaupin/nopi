import { beforeAll, describe, expect, test } from 'vitest';

import { CiaCertChain } from './CiaCertChain';

let testCiaCertChain: Blob;

beforeAll(() => {
  testCiaCertChain = new CiaCertChain().toBlob();
});

describe('cert chain', () => {
  test('cert chain size', async () => {
    expect((await testCiaCertChain.arrayBuffer()).byteLength).toBe(0xa00);
  });
});
