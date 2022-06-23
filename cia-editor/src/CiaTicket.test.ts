import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { beforeAll, describe, expect, test } from 'vitest';

import { CiaFile } from './CiaFile';
import { CiaTicket } from './CiaTicket';
import { fromHexString } from './testutils';

let testCiaTicket: CiaTicket;

beforeAll(async () => {
  const ciaArrayBuffer = (
    await readFile(resolve(__dirname, 'testdata/test.cia'))
  ).buffer;
  const ciaFile = new CiaFile(ciaArrayBuffer);
  testCiaTicket = ciaFile.ticket;
});

describe('ticket', () => {
  test('get signature', () => {
    // ctrtool only returns the first part of the signature, which should be plenty just to test
    expect(testCiaTicket.signature.slice(0, 4)).toEqual(
      fromHexString('84C81489')
    );
  });

  test('get titleKey', () => {
    expect(testCiaTicket.titleKey).toEqual(
      fromHexString('3A9F60D1AB3FFEA3B00816EB7B7CEB7E')
    );
  });

  test('get ticketId', () => {
    expect(testCiaTicket.ticketId).toEqual(fromHexString('0004a13e80326061'));
  });

  test('get titleId', () => {
    expect(testCiaTicket.titleId).toEqual(fromHexString('000400000ff3ff00'));
  });
});
