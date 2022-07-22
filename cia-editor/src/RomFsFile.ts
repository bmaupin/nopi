import { RomFsFileMetadata } from './RomFsFileMetadata';

export class RomFsFile {
  private arrayBuffer: ArrayBuffer;
  private fileDataStartingByte: number;

  readonly metadata: RomFsFileMetadata;
  readonly metadataSize: number;

  constructor(
    arrayBuffer: ArrayBuffer,
    metadataStartingByte: number,
    fileDataStartingByte: number
  ) {
    this.arrayBuffer = arrayBuffer;
    this.fileDataStartingByte = fileDataStartingByte;

    this.metadata = new RomFsFileMetadata(arrayBuffer, metadataStartingByte);
    this.metadataSize = this.metadata.size;
  }

  // TODO: this needs a setter
  get name() {
    return this.metadata.fileName;
  }

  /*
     TODO: development notes; clean up
     - rom.bin content starts at 0x4a0f50
       - this is calculated starting with the starting offset of the RomFS (0x49f900)
       - add the offset for

     - rom.bin offset is 0x3c0
     - file data section offset (defined at 0x0x4a0924): 0x290
   */
  get content() {
    return new Uint8Array(
      this.arrayBuffer,
      this.fileDataStartingByte + this.metadata.fileDataOffset,
      this.metadata.fileDataSize
    );
  }
}
