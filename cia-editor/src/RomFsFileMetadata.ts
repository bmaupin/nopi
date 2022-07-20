import { calculateAlignedSize } from './utils';

export class RomFsFileMetadata {
  private arrayBuffer: ArrayBuffer;
  private startingByte: number;

  constructor(arrayBuffer: ArrayBuffer, startingByte: number) {
    this.arrayBuffer = arrayBuffer;
    this.startingByte = startingByte;
  }

  get directoryOffset() {
    const dataView = new DataView(this.arrayBuffer, this.startingByte, 0x4);
    return dataView.getUint32(0, true);
  }

  get nextFileOffset() {
    const dataView = new DataView(
      this.arrayBuffer,
      this.startingByte + 0x4,
      0x4
    );
    return dataView.getUint32(0, true);
  }

  // TODO: this needs a setter
  get fileDataOffset() {
    const dataView = new DataView(
      this.arrayBuffer,
      this.startingByte + 0x8,
      0x8
    );
    return dataView.getBigUint64(0, true);
  }

  // TODO: this needs a setter
  get fileDataSize() {
    const dataView = new DataView(
      this.arrayBuffer,
      this.startingByte + 0x10,
      0x8
    );
    return dataView.getBigUint64(0, true);
  }

  get fileNameLength() {
    const dataView = new DataView(
      this.arrayBuffer,
      this.startingByte + 0x1c,
      0x4
    );
    return dataView.getUint32(0, true);
  }

  get fileName() {
    const uintArray = new Uint16Array(
      this.arrayBuffer,
      this.startingByte + 0x20,
      this.fileNameLength / 2
    );
    return new TextDecoder('utf-16le').decode(uintArray);
  }

  get size() {
    return calculateAlignedSize(0x20 + this.fileNameLength, 0x4);
  }
}
