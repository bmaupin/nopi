import { Blob } from 'buffer';
import { beforeAll, describe, expect, test } from 'vitest';

import { CiaWriter } from './CiaWriter';

let testCiaFile: Blob;

beforeAll(() => {
  testCiaFile = new CiaWriter().toBlob();
});

describe('CIA', () => {
  // TODO: write some real tests :)
  test('dump cia contents', async () => {
    console.log('testCiaFile.arrayBuffer()=', await testCiaFile.arrayBuffer());
  });
});
