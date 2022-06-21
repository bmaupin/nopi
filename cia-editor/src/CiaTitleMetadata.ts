import { getSignatureSectionSize, getSignatureSize } from './utils';

// https://www.3dbrew.org/wiki/Title_metadata
export class CiaTitleMetadata {
  private arrayBuffer: ArrayBuffer;
  private startingByte: number;

  private signatureType: Uint8Array;
  readonly signature: Uint8Array;
  readonly titleId: Uint8Array;

  constructor(arrayBuffer: ArrayBuffer, startingByte: number) {
    this.arrayBuffer = arrayBuffer;
    this.startingByte = startingByte;

    // 0x2dc0
    this.signatureType = new Uint8Array(arrayBuffer, startingByte, 4);

    // TODO: implement functionality to write these properties
    // 0x2dc4
    this.signature = new Uint8Array(
      arrayBuffer,
      startingByte + 4,
      getSignatureSize(this.signatureType)
    );

    // 0x2f4c
    // TODO: titleId setter should be in CiaFile so we can set it everywhere at once (ticket, TMD, NCCH)
    this.titleId = new Uint8Array(
      arrayBuffer,
      startingByte + getSignatureSectionSize(this.signatureType) + 0x4c,
      0x8
    );
  }

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

  // TODO: contentSize setter should be in CiaFile so we can set it everywhere at once (header, TMD, NCCH)

  // 0x38d4
  get contentHash() {
    return new Uint8Array(
      this.arrayBuffer,
      this.startingByte + getSignatureSectionSize(this.signatureType) + 0x9d4,
      0x20
    );
  }
}
