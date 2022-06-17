import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { beforeAll, describe, expect, test } from 'vitest';
import { CiaFile } from './CiaFile';

import { CiaTicket } from './CiaTicket';

let testCiaTicket: CiaTicket;

beforeAll(async () => {
  const ciaArrayBuffer = (
    await readFile(resolve(__dirname, 'testdata/test.cia'))
  ).buffer;
  const ciaFile = new CiaFile(ciaArrayBuffer);
  // TODO: remove hardcoded starting point???
  testCiaTicket = new CiaTicket(ciaFile.arrayBuffer, 0x2a40);
});

describe('ticket', () => {
  test('get signature', () => {
    // ctrtool only returns the first part of the signature, which should be plenty just to test
    expect(testCiaTicket.signature.slice(0, 4)).toEqual(
      fromHexString('C790939A')
    );
  });

  test('get titleKey', () => {
    expect(testCiaTicket.titleKey).toEqual(
      fromHexString('E969FD59613C14DB3FDC6FA82E013D08')
    );
  });

  test('get ticketId', () => {
    expect(testCiaTicket.ticketId).toEqual(fromHexString('0004b4d2d65543e4'));
  });

  test('get titleId', () => {
    expect(testCiaTicket.titleId).toEqual(fromHexString('000400000ff3ff00'));
  });
});

// https://stackoverflow.com/a/50868276/399105
const fromHexString = (hexString: string): Uint8Array => {
  return Uint8Array.from(
    hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
  );
};
