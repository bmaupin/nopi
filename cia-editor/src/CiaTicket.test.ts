import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { beforeAll, describe, expect, test } from 'vitest';

import { CiaFile } from './CiaFile';
import { CiaTicket } from './CiaTicket';
import {
  TEST_INITIAL_TICKET_ID,
  TEST_INITIAL_TICKET_SIGNATURE,
  TEST_INITIAL_TITLE_ID,
  TEST_INITIAL_TITLE_KEY,
  TEST_NEW_TITLE_ID,
} from './testutils';

let testCiaTicket: CiaTicket;

beforeAll(async () => {
  const ciaArrayBuffer = (
    await readFile(resolve(__dirname, 'testdata/test.cia'))
  ).buffer;
  const ciaFile = new CiaFile(ciaArrayBuffer);
  testCiaTicket = ciaFile.ticket;
});

describe('ticket', () => {
  test('signature', () => {
    expect(testCiaTicket.signature.slice(0, 4)).toEqual(
      TEST_INITIAL_TICKET_SIGNATURE
    );

    testCiaTicket.titleId = TEST_NEW_TITLE_ID;
    expect(testCiaTicket.signature.slice(0, 4)).not.toEqual(
      TEST_INITIAL_TICKET_SIGNATURE
    );

    testCiaTicket.titleId = TEST_INITIAL_TITLE_ID;
    expect(testCiaTicket.signature.slice(0, 4)).toEqual(
      TEST_INITIAL_TICKET_SIGNATURE
    );
  });

  test('titleKey', () => {
    expect(testCiaTicket.titleKey).toEqual(TEST_INITIAL_TITLE_KEY);

    testCiaTicket.generateNewTitleKey();
    expect(testCiaTicket.titleKey).not.toEqual(TEST_INITIAL_TITLE_KEY);
  });

  test('ticketId', () => {
    expect(testCiaTicket.ticketId).toEqual(TEST_INITIAL_TICKET_ID);

    testCiaTicket.generateNewTicketId();
    expect(testCiaTicket.ticketId).not.toEqual(TEST_INITIAL_TICKET_ID);
  });

  test('titleId', () => {
    expect(testCiaTicket.titleId).toEqual(TEST_INITIAL_TITLE_ID);

    testCiaTicket.titleId = TEST_NEW_TITLE_ID;
    expect(testCiaTicket.titleId).toEqual(TEST_NEW_TITLE_ID);

    testCiaTicket.titleId = TEST_INITIAL_TITLE_ID;
    expect(testCiaTicket.titleId).toEqual(TEST_INITIAL_TITLE_ID);
  });
});
