// import utils from './utils';

// class CiaTicketHeader {
//   private ciaTicketHeaderParts = {
//     // Hardcode the issuer since we've hardcoded the certs
//     issuer: new Uint8Array([
//       0x52, 0x6f, 0x6f, 0x74, 0x2d, 0x43, 0x41, 0x30, 0x30, 0x30, 0x30, 0x30,
//       0x30, 0x30, 0x33, 0x2d, 0x58, 0x53, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30,
//       0x30, 0x63, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
//       0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
//       0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
//       0x00, 0x00, 0x00, 0x00,
//     ]),
//     eccPublicKey: new Uint8Array(0x3c),
//     formatVersion: new Uint8Array([1]),
//     // https://github.com/3DSGuy/Project_CTR/blob/319c4c6a24747a6def3c012312ed13a2f76bb369/makerom/cia.c#L170
//     caCrlVersion: new Uint8Array([0]),
//     // https://github.com/3DSGuy/Project_CTR/blob/319c4c6a24747a6def3c012312ed13a2f76bb369/makerom/cia.c#L171
//     signerCrlVersion: new Uint8Array([0]),
//     // TODO: title key comes from user settings?
//     // Last byte is padding
//     // https://github.com/3DSGuy/Project_CTR/blob/319c4c6a24747a6def3c012312ed13a2f76bb369/makerom/cia.c#L188
//     // titleKey: new Uint8Array([...utils.randomBytes(0x10), 0]),
//     // TODO: test signature
//     titleKey: new Uint8Array([
//       0x83, 0xfe, 0x87, 0x7c, 0x0a, 0x38, 0x1e, 0xca, 0x1e, 0xc0, 0x65, 0x39,
//       0xe5, 0x3a, 0x65, 0x97, 0x00,
//     ]),
//     // Ticket ID always seems to be random
//     // https://github.com/3DSGuy/Project_CTR/blob/319c4c6a24747a6def3c012312ed13a2f76bb369/makerom/cia.c#L179
//     // ticketId: new Uint8Array([0x00, 0x04, ...utils.randomBytes(6)]),
//     // TODO: test signature
//     ticketId: new Uint8Array([0x00, 0x04, 0x5e, 0x41, 0xbe, 0xc6, 0xac, 0x3f]),
//     // https://github.com/3DSGuy/Project_CTR/blob/319c4c6a24747a6def3c012312ed13a2f76bb369/makerom/user_settings.c#L114
//     deviceId: new Uint8Array(4),
//     // Create a random title ID, last 2 bytes are padding
//     // https://www.3dbrew.org/w/index.php?title=Titles&mobileaction=toggle_view_mobile
//     titleId: new Uint8Array([
//       0x00,
//       0x04,
//       0x00,
//       0x00,
//       // ...utils.randomBytes(3),
//       // TODO: testing signature
//       0x0f, 0xf3, 0xff,
//       0x00,
//       0x00,
//       0x00,
//     ]),
//     // TODO: TicketVersion: 2.0.0 (2048)
//     // The Ticket Title Version is generally the same as the title version stored in the Title Metadata. Although it doesn't have to match the TMD version to be valid.
//     // https://www.3dbrew.org/wiki/Ticket
//     ticketVersion: new Uint8Array(10),
//     licenseType: new Uint8Array(1),
//     keyId: new Uint8Array(0x2b),
//     eShopAccountId: new Uint8Array(5),
//     audit: new Uint8Array(0x43),
//     limits: new Uint8Array(0x40),
//   };
// }

// /*
//  * Ticket starts at 0x2a40
//  * - signature data
//  *   - signature type: 0x2a40
//  * 0x00, 0x01, 0x00, 0x04

//  *   - signature: 0x2a44 (type 00010004 should be 0x100 size)
//       0xa7, 0xad, 0x8d, 0xb1
//  *   - padding: 0x2b44 - 0x2b80
//  * - ticket data
//  *   - issuer: 0x2b80
//  *   - Ecc publickey: 0x2bc0
//  *   - formatVersion: 0x2bfc (always 1)
//  *   - cacrlversion: 0x2bfd (0)
//  *   - signercrlversion: 0x2bfe (0)
//  *   - titlekey: 0x2bff
//  *   - reserved: 0x2c0f
//  *   - ticketid: 0x2c10
//  *   - consoleId/deviceId?: 0x2c18 (0)
//  *   - titleId: 0x2c1c
//  *   - ticketVersion: 0x2c26
//  *   - licenseType: 0x2c30
//  *   - keyId: 0x2c31
//  *   - eShopAccountId : 0x2c5c
//  *   - audit: 0x2c61
//  *   - limits: 0x2ca4
//  * - content index: 0x2ce4
//  *   - header: 0x2ce4
//  *   - content?: 0x2d0c - 0x2d90?
//  */
