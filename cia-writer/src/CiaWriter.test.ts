import { Blob } from 'buffer';
import { beforeAll, describe, test } from 'vitest';

import { CiaWriter } from './CiaWriter';

const testFilename = 'test.cia';
let testCiaFile: Blob;

beforeAll(() => {
  testCiaFile = new CiaWriter().write();
});

describe('header', () => {
  test('header size', async () => {
    const arrayBuffer = await testCiaFile.arrayBuffer();
    console.log('arrayBuffer.slice(0)=', arrayBuffer.slice(0));
  });
});
