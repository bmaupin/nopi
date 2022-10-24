export class CiaTitleMetadata {
  private signatureParts = {
    // Hardcode the signature type (RSA_2048 SHA256)
    signatureType: new Uint8Array([0x00, 0x01, 0x00, 0x04]),
    // TODO: this needs to be set
    signature: new Uint8Array(0x100),
    padding: new Uint8Array(0x3c),
  };

  // 0x2f00
  private headerParts = {
    // Hardcode the issuer since we've hardcoded the certs
    issuer: new Uint8Array([
      0x52, 0x6f, 0x6f, 0x74, 0x2d, 0x43, 0x41, 0x30, 0x30, 0x30, 0x30, 0x30,
      0x30, 0x30, 0x33, 0x2d, 0x58, 0x53, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30,
      0x30, 0x63, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
    ]),
    formatVersion: new Uint8Array([0x01]),
    caCrlVersion: new Uint8Array(1),
    signerCrlVersion: new Uint8Array(1),
    padding0: new Uint8Array(1),
    systemVersion: new Uint8Array(8),
    // TODO: this should match the title ID in the ticket
    titleId: new Uint8Array([
      // 0x00,
      // 0x04,
      // 0x00,
      // 0x00,
      // ...utils.randomBytes(3),
      // 0x00,
      // TODO: testing signature of hello world CIA
      0x00, 0x04, 0x00, 0x00, 0x0f, 0xf3, 0xff, 0x00
    ]),
    titleType: new Uint8Array([0x00, 0x00, 0x00, 0x40]),
    groupId: new Uint8Array(2),
    saveDataSize: new Uint8Array(4),
    privateSaveDataSize: new Uint8Array(4),
    padding1: new Uint8Array(4),
    twlFlag: new Uint8Array(1),
    padding2: new Uint8Array(0x31),
    accessRights: new Uint8Array(4),
    // TODO: this is non-zero in NSUI-generated CIAs; is this needed?
    titleVersion: new Uint8Array(2),
    contentCount: new Uint8Array([0x00, 0x01]),
    bootContent: new Uint8Array(2),
    padding3: new Uint8Array(2),
    // TODO: this needs to be set
    infoRecordHash: new Uint8Array(0x20),
  }

  // 0x2fc4
  private contentInfoRecordParts = {
    contentIndexOffset: new Uint8Array(2),
    contentCommandCount: new Uint8Array([0x00, 0x01]),
    // TODO: this needs to be set
    contentChunkHash: new Uint8Array(0x20),
    // There are 64 content info record entries, but we only need to use the first one
    padding: new Uint8Array(0x24 * 63),
  }

  // 0x38c4 ???
  private contentChunkRecordParts = {
    // TODO: this is empty in NSUI-generated CIA, but non-empty in hello world
    contentId: new Uint8Array(4),
    contentIndex: new Uint8Array(2),
    contentFlags: new Uint8Array(2),
    // TODO: this needs to be set; seems to be big-endian
    // 0x38cc?
    contentSize: new Uint8Array(8),
    // TODO: this needs to be set
    // TODO: what is the difference between this and contentInfoRecordParts.contentChunkHash?
    //    maybe this is the hash of the content itself, whereas the above is the hash of the content chunk? so content needs to be set first :)
    contentHash: new Uint8Array(0x20),
  }

  constructor() {
    // TODO
    // this.calculateContentSize();

    // TODO
    // this.calculateContentHash();

    // TODO
    // this.calculateContentChunkHash();

    // TODO
    // this.calculateInfoRecordHash();

    // TODO
    // this.calculateSignature();
  }
}
