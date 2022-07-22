import { getSignatureSectionSize, getSignatureSize } from './utils';

// https://www.3dbrew.org/wiki/Title_metadata
// http://problemkaputt.de/gbatek-3ds-files-title-metadata-tmd.htm
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
  // 0x2fa4 (0x1e4 offset in the TMD)
  get infoRecordHash() {
    return new Uint8Array(
      this.arrayBuffer,
      this.startingByte + getSignatureSectionSize(this.signatureType) + 0xa4,
      0x20
    );
  }

  // TODO: this needs a setter
  // 0x2fc8 (0x208 offset in the TMD, 0x4 offset in the content info records section)
  get contentChunkHash() {
    return new Uint8Array(
      this.arrayBuffer,
      this.startingByte + getSignatureSectionSize(this.signatureType) + 0xc8,
      0x20
    );
  }

  // TODO: this needs a setter
  // TODO: set content size everywhere at once (header, TMD, NCCH)
  // 0x38cc (0xb0c offset in the TMD, 0x8 offset in the content chunk records section)
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
  // 0x38d4 (0xb14 offset in the TMD, 0x10 offset in the content chunk records section)
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
