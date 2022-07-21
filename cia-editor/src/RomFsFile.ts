import { RomFsFileMetadata } from './RomFsFileMetadata';

export class RomFsFile {
  private arrayBuffer: ArrayBuffer;

  readonly metadata: RomFsFileMetadata;
  readonly metadataSize: number;

  constructor(arrayBuffer: ArrayBuffer, metadataStartingByte: number) {
    this.arrayBuffer = arrayBuffer;

    this.metadata = new RomFsFileMetadata(arrayBuffer, metadataStartingByte);
    this.metadataSize = this.metadata.size;
  }

  // TODO: this needs a setter
  get name() {
    return this.metadata.fileName;
  }
}
