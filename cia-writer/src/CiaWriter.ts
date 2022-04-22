import { Blob } from 'buffer';
import { BinaryLike } from 'crypto';

export class CiaWriter {
  // TODO: separate ArrayBuffers to handle different parts of the file
  private filedata: ArrayBuffer;

  constructor() {
    // TODO: move header logic into its own file and generate separately
    this.filedata = new ArrayBuffer(4);
    const headerSize = new DataView(this.filedata);
    headerSize.setInt32(0, 0x2020);
  }

  // TODO: should we use a different name than "write"?
  // Node.js doesn't support File; it supports Blob starting with v14
  public write = (): Blob => {
    // TODO: piece together the final file from the individual sections
    // "as BinaryLike" is required to fix a type issue
    return new Blob([this.filedata as BinaryLike], {
      type: 'application/octet-stream',
    });
  };
}
