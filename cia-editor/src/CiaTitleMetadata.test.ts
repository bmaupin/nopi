import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { beforeAll, describe, expect, test } from 'vitest';
import { CiaFile } from './CiaFile';
import { CiaRomFs } from './CiaRomFs';

import { CiaTitleMetadata } from './CiaTitleMetadata';
import {
  TEST_INITIAL_CHUNK_HASH,
  TEST_INITIAL_CONTENT_CHUNK_HASH,
  TEST_INITIAL_INFO_RECORD_HASH,
  TEST_INITIAL_TITLE_ID,
  TEST_INITIAL_TMD_SIGNATURE,
  TEST_NEW_TITLE_ID,
  TEST_TXT_INITIAL_CONTENT,
  TEST_TXT_NEW_CONTENT,
} from './testutils';

let testCiaTitleMetadata: CiaTitleMetadata;
let testCiaRomFs: CiaRomFs;

beforeAll(async () => {
  const ciaArrayBuffer = (
    await readFile(resolve(__dirname, 'testdata/test.cia'))
  ).buffer;
  const ciaFile = new CiaFile(ciaArrayBuffer);
  testCiaTitleMetadata = ciaFile.titleMetadata;
  testCiaRomFs = ciaFile.romFs;
});

describe('title metadata', () => {
  test('signature', () => {
    expect(testCiaTitleMetadata.signature.slice(0, 4)).toEqual(
      // ctrtool only returns the first part of the signature, which should be plenty just to test
      TEST_INITIAL_TMD_SIGNATURE
    );

    // Change the RomFS file content and make sure the signature changes
    testCiaRomFs.files[0].content = TEST_TXT_NEW_CONTENT;
    expect(testCiaTitleMetadata.signature.slice(0, 4)).not.toEqual(
      TEST_INITIAL_TMD_SIGNATURE
    );

    // Reset the content and check the signature again
    testCiaRomFs.files[0].content = TEST_TXT_INITIAL_CONTENT;
    expect(testCiaTitleMetadata.signature.slice(0, 4)).toEqual(
      TEST_INITIAL_TMD_SIGNATURE
    );
  });

  test('titleId', () => {
    expect(testCiaTitleMetadata.titleId).toEqual(TEST_INITIAL_TITLE_ID);

    testCiaTitleMetadata.titleId = TEST_NEW_TITLE_ID;
    expect(testCiaTitleMetadata.titleId).toEqual(TEST_NEW_TITLE_ID);
    expect(testCiaTitleMetadata.titleId).toEqual(TEST_NEW_TITLE_ID);
    expect(testCiaTitleMetadata.signature.slice(0, 4)).not.toEqual(
      TEST_INITIAL_TMD_SIGNATURE
    );

    // Reset to the initial value
    testCiaTitleMetadata.titleId = TEST_INITIAL_TITLE_ID;
    expect(testCiaTitleMetadata.titleId).toEqual(TEST_INITIAL_TITLE_ID);
    expect(testCiaTitleMetadata.titleId).toEqual(TEST_INITIAL_TITLE_ID);
    expect(testCiaTitleMetadata.signature.slice(0, 4)).toEqual(
      TEST_INITIAL_TMD_SIGNATURE
    );
  });

  test('infoRecordHash', () => {
    expect(testCiaTitleMetadata.infoRecordHash).toEqual(
      TEST_INITIAL_INFO_RECORD_HASH
    );

    // Change the RomFS file content and make sure the hash changes
    testCiaRomFs.files[0].content = TEST_TXT_NEW_CONTENT;
    expect(testCiaTitleMetadata.infoRecordHash).not.toEqual(
      TEST_INITIAL_INFO_RECORD_HASH
    );
    expect(testCiaTitleMetadata.signature.slice(0, 4)).not.toEqual(
      TEST_INITIAL_TMD_SIGNATURE
    );

    // Reset the content and check the hash again
    testCiaRomFs.files[0].content = TEST_TXT_INITIAL_CONTENT;
    expect(testCiaTitleMetadata.infoRecordHash).toEqual(
      TEST_INITIAL_INFO_RECORD_HASH
    );
    expect(testCiaTitleMetadata.signature.slice(0, 4)).toEqual(
      TEST_INITIAL_TMD_SIGNATURE
    );
  });

  test('contentChunkHash', () => {
    expect(testCiaTitleMetadata.contentChunkHash).toEqual(
      TEST_INITIAL_CONTENT_CHUNK_HASH
    );

    // Change the RomFS file content and make sure the hash changes
    testCiaRomFs.files[0].content = TEST_TXT_NEW_CONTENT;
    expect(testCiaTitleMetadata.contentChunkHash).not.toEqual(
      TEST_INITIAL_CONTENT_CHUNK_HASH
    );
    expect(testCiaTitleMetadata.infoRecordHash).not.toEqual(
      TEST_INITIAL_INFO_RECORD_HASH
    );

    // Reset the content and check the hash again
    testCiaRomFs.files[0].content = TEST_TXT_INITIAL_CONTENT;
    expect(testCiaTitleMetadata.contentChunkHash).toEqual(
      TEST_INITIAL_CONTENT_CHUNK_HASH
    );
    expect(testCiaTitleMetadata.infoRecordHash).toEqual(
      TEST_INITIAL_INFO_RECORD_HASH
    );
  });

  test('get contentSize', () => {
    expect(testCiaTitleMetadata.contentSize).toEqual(0xc000);
  });

  test('contentHash', () => {
    expect(testCiaTitleMetadata.contentHash).toEqual(TEST_INITIAL_CHUNK_HASH);

    // Change the RomFS file content and make sure the hash changes
    // (The only way to test this is to change something inside the content (NCCH))
    testCiaRomFs.files[0].content = TEST_TXT_NEW_CONTENT;
    expect(testCiaTitleMetadata.contentHash).not.toEqual(
      TEST_INITIAL_CHUNK_HASH
    );
    expect(testCiaTitleMetadata.contentChunkHash).not.toEqual(
      TEST_INITIAL_CONTENT_CHUNK_HASH
    );

    // Reset the content and check the hash again
    testCiaRomFs.files[0].content = TEST_TXT_INITIAL_CONTENT;
    expect(testCiaTitleMetadata.contentHash).toEqual(TEST_INITIAL_CHUNK_HASH);
    expect(testCiaTitleMetadata.contentChunkHash).toEqual(
      TEST_INITIAL_CONTENT_CHUNK_HASH
    );
  });
});
