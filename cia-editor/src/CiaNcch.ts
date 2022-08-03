import { getHash, getSignature } from './utils';

// NCCH is sometimes referred to as "content"
// https://www.3dbrew.org/wiki/NCCH
// http://problemkaputt.de/gbatek-3ds-files-ncch-format.htm
// Starts at 0x3900
export class CiaNcch {
  private arrayBuffer: ArrayBuffer;
  private startingByte: number;

  constructor(arrayBuffer: ArrayBuffer, startingByte: number) {
    this.arrayBuffer = arrayBuffer;
    this.startingByte = startingByte;
  }

  // 0x3900
  get signature() {
    return new Uint8Array(this.arrayBuffer, this.startingByte, 0x100);
  }

  updateSignature = () => {
    const dataToSign = new Uint8Array(
      this.arrayBuffer,
      this.startingByte + 0x100,
      0x100
    );

    this.signature.set(getSignature(dataToSign));
  };

  // TODO: this needs a setter
  // TODO: set content size everywhere at once (header, TMD, NCCH)
  // Content size, in bytes
  // Internally, this is stored in "media units" and we convert it to bytes
  // 0x3a04
  get contentSize() {
    const dataView = new DataView(
      this.arrayBuffer,
      this.startingByte + 0x104,
      0x4
    );
    const contentSizeInMediaUnits = dataView.getUint32(0, true);
    return contentSizeInMediaUnits * 0x200;
  }

  // 0x3a08
  get titleId() {
    return new Uint8Array(
      this.arrayBuffer,
      this.startingByte + 0x108,
      0x8
      // The title ID is backwards here. Go figure
    ).reverse();
  }

  set titleId(newTitleId: Uint8Array) {
    // Copy newTitleId and reverse the copy to avoid changing the value we're passed
    const copyOfNewTitleId = new Uint8Array(newTitleId);
    copyOfNewTitleId.reverse();

    this.titleId.set(copyOfNewTitleId);
  }

  // 0x3a18
  get programId() {
    return new Uint8Array(
      this.arrayBuffer,
      this.startingByte + 0x118,
      0x8
      // The title ID is backwards here. Go figure
    ).reverse();
  }

  set programId(newProgramId: Uint8Array) {
    // Copy newProgramId and reverse the copy to avoid changing the value we're passed
    const copyOfNewProgramId = new Uint8Array(newProgramId);
    copyOfNewProgramId.reverse();

    this.programId.set(copyOfNewProgramId);
  }

  // TODO: does this need to be changed/be unique?
  // 0x3a50
  get productCode() {
    const uintArray = new Uint8Array(
      this.arrayBuffer,
      this.startingByte + 0x150,
      0x10
    );
    // Decode the text and remove the null characters at the end
    return new TextDecoder('utf8').decode(uintArray).replace(/\0.*$/g, '');
  }

  // RomFS offset, in bytes
  // 0x3ab0
  get romFsOffset() {
    const dataView = new DataView(
      this.arrayBuffer,
      this.startingByte + 0x1b0,
      0x4
    );
    const romFsOffsetInMediaUnits = dataView.getUint32(0, true);
    return romFsOffsetInMediaUnits * 0x200;
  }

  // TODO: this needs a setter
  // RomFS size, in bytes
  // 0x3ab4
  get romFsSize() {
    const dataView = new DataView(
      this.arrayBuffer,
      this.startingByte + 0x1b4,
      0x4
    );
    const romFsSizeInMediaUnits = dataView.getUint32(0, true);
    return romFsSizeInMediaUnits * 0x200;
  }

  private get romFsHeaderSize() {
    const dataView = new DataView(
      this.arrayBuffer,
      this.startingByte + 0x1b8,
      0x4
    );
    const romFsHeaderSizeInMediaUnits = dataView.getUint32(0, true);
    return romFsHeaderSizeInMediaUnits * 0x200;
  }

  // Hash of the first 0x200 block (1 "media unit") of data in the RomFS
  // 0x3ae0 (0x1e0 offset in the NCCH)
  get romFsHash() {
    return new Uint8Array(this.arrayBuffer, this.startingByte + 0x1e0, 0x20);
  }

  updateRomFsHash = (): void => {
    const dataToHash = new Uint8Array(
      this.arrayBuffer,
      this.startingByte + this.romFsOffset,
      this.romFsHeaderSize
    );

    this.romFsHash.set(getHash(dataToHash));
    this.updateSignature();
  };
}
