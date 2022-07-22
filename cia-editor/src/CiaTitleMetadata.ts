import { getSignatureSectionSize, getSignatureSize } from './utils';

// https://www.3dbrew.org/wiki/Title_metadata
// Starts at 0x2dc0
export class CiaTitleMetadata {
  private arrayBuffer: ArrayBuffer;
  private startingByte: number;

  private signatureType: Uint8Array;
  readonly signature: Uint8Array;

  constructor(arrayBuffer: ArrayBuffer, startingByte: number) {
    this.arrayBuffer = arrayBuffer;
    this.startingByte = startingByte;

    // 0x2dc0
    this.signatureType = new Uint8Array(arrayBuffer, startingByte, 4);

    // TODO: this needs a setter
    // 0x2dc4
    this.signature = new Uint8Array(
      arrayBuffer,
      startingByte + 4,
      getSignatureSize(this.signatureType)
    );
  }

  // 0x2f4c
  get titleId() {
    return new Uint8Array(
      this.arrayBuffer,
      this.startingByte + getSignatureSectionSize(this.signatureType) + 0x4c,
      0x8
    );
  }

  set titleId(newTitleId: Uint8Array) {
    this.titleId.set(newTitleId);
  }

  // TODO: this needs a setter
  // 0x2fa4
  get infoRecordHash() {
    return new Uint8Array(
      this.arrayBuffer,
      this.startingByte + getSignatureSectionSize(this.signatureType) + 0xa4,
      0x20
    );
  }

  // TODO: this needs a setter
  // 0x2fc8
  get contentChunkHash() {
    return new Uint8Array(
      this.arrayBuffer,
      this.startingByte + getSignatureSectionSize(this.signatureType) + 0xc8,
      0x20
    );
  }

  // TODO: this needs a setter
  // TODO: set content size everywhere at once (header, TMD, NCCH)
  // 0x38cc
  get contentSize(): bigint {
    const dataView = new DataView(
      this.arrayBuffer,
      this.startingByte + getSignatureSectionSize(this.signatureType) + 0x9cc,
      0x8
    );
    // big endian 😝
    return dataView.getBigUint64(0, false);
  }

  // TODO: this needs a setter
  // 0x38d4
  get contentHash() {
    return new Uint8Array(
      this.arrayBuffer,
      this.startingByte + getSignatureSectionSize(this.signatureType) + 0x9d4,
      0x20
    );
  }

  get size() {
    return getSignatureSectionSize(this.signatureType) + 0x9f4;
  }
}
