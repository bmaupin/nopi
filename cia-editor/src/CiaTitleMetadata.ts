import {
  calculateAlignedSize,
  getHash,
  getSignature,
  getSignatureSectionSize,
  getSignatureSize,
} from './utils';

// https://www.3dbrew.org/wiki/Title_metadata
// http://problemkaputt.de/gbatek-3ds-files-title-metadata-tmd.htm
// Starts at 0x2dc0
export class CiaTitleMetadata {
  private arrayBuffer: ArrayBuffer;
  private startingByte: number;

  private signatureType: Uint8Array;

  constructor(arrayBuffer: ArrayBuffer, startingByte: number) {
    this.arrayBuffer = arrayBuffer;
    this.startingByte = startingByte;

    // 0x2dc0
    this.signatureType = new Uint8Array(arrayBuffer, startingByte, 4);
  }

  // 0x2dc4
  get signature() {
    return new Uint8Array(
      this.arrayBuffer,
      this.startingByte + 4,
      getSignatureSize(this.signatureType)
    );
  }

  updateSignature = () => {
    const dataToSign = new Uint8Array(
      this.arrayBuffer,
      this.startingByte + getSignatureSectionSize(this.signatureType),
      0xc4
    );

    this.signature.set(getSignature(dataToSign));
  };

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

  // *** Content info records ***

  private get contentIndexOffset() {
    const dataView = new DataView(
      this.arrayBuffer,
      this.startingByte + getSignatureSectionSize(this.signatureType) + 0xc4,
      0x2
    );
    // big endian
    return dataView.getUint16(0, false);
  }

  private get contentCommandCount() {
    const dataView = new DataView(
      this.arrayBuffer,
      this.startingByte + getSignatureSectionSize(this.signatureType) + 0xc6,
      0x2
    );
    // big endian
    return dataView.getUint16(0, false);
  }

  // Hash of all of the content chunks
  // Number of content chunks seems to be determined by contentCommandCount?
  // 0x2fc8 (0x208 offset in the TMD, 0x4 offset in the content info records section)
  get contentChunkHash() {
    return new Uint8Array(
      this.arrayBuffer,
      this.startingByte + getSignatureSectionSize(this.signatureType) + 0xc8,
      0x20
    );
  }

  // The content chunk hash must be updated if contentHash changes
  updateContentChunkHash = () => {
    const dataToHash = new Uint8Array(
      this.arrayBuffer,
      this.startingByte +
        getSignatureSectionSize(this.signatureType) +
        0x9c4 +
        this.contentIndexOffset,
      // this.contentCommandCount content chunk records, 0x30 bytes each
      0x30 * this.contentCommandCount
    );

    this.contentChunkHash.set(getHash(dataToHash));
  };

  // *** Content chunk records ***

  // TODO: this needs a setter
  // TODO: set content size everywhere at once (header, TMD, NCCH)
  // Size in bytes of the content (the NCCH, including the ExeFS and the RomFS)
  // 0x38cc (0xb0c offset in the TMD, 0x8 offset in the content chunk records section)
  get contentSize() {
    const dataView = new DataView(
      this.arrayBuffer,
      // This is technically a 64-bit integer at 0x9cc, but get a 32-bit integer at 0x9d0 (big endian) instead
      this.startingByte + getSignatureSectionSize(this.signatureType) + 0x9d0,
      0x4
    );
    // big endian 😝
    return dataView.getUint32(0, false);
  }

  // Hash over the entire content (the NCCH, including the ExeFS and the RomFS)
  // 0x38d4 (0xb14 offset in the TMD, 0x10 offset in the content chunk records section)
  get contentHash() {
    return new Uint8Array(
      this.arrayBuffer,
      this.startingByte + getSignatureSectionSize(this.signatureType) + 0x9d4,
      0x20
    );
  }

  updateContentHash = () => {
    const dataToHash = new Uint8Array(
      this.arrayBuffer,
      // This corresponds with the starting byte of the NCCH section
      calculateAlignedSize(this.startingByte + this.size, 0x40),
      this.contentSize
    );

    this.contentHash.set(getHash(dataToHash));
    this.updateContentChunkHash();
  };

  get size() {
    return getSignatureSectionSize(this.signatureType) + 0x9f4;
  }
}
