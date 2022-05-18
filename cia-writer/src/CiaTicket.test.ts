import { beforeAll, describe, expect, test } from 'vitest';

import { CiaTicket } from './CiaTicket';

let testTicket: Blob;

beforeAll(() => {
  testTicket = new CiaTicket().toBlob();
});

describe('ticket', () => {
  test('ticket size (without padding)', async () => {
    expect((await testTicket.arrayBuffer()).byteLength).toBe(0x350);
  });
});
