import { Blob } from 'buffer';
import { beforeAll, describe, expect, test } from 'vitest';

import { CiaWriter } from './CiaWriter';

let testCiaFile: Blob;

beforeAll(() => {
  testCiaFile = new CiaWriter().write();
});

describe('CIA', () => {
  test('dump cia contents', async () => {
    console.log('testCiaFile.arrayBuffer()=', await testCiaFile.arrayBuffer());
  });
});
