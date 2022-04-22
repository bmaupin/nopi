import { Blob } from 'buffer';
import { BinaryLike } from 'crypto';

export class CiaHeader {
  // All the parts of the CIA header, in order
  private ciaHeaderParts = {
    headerSize: new ArrayBuffer(4),
    ciaType: new ArrayBuffer(2),
    ciaVersion: new ArrayBuffer(2),
    certificateChainSize: new ArrayBuffer(4),
    ticketSize: new ArrayBuffer(4),
    tmdFileSize: new ArrayBuffer(4),
    metaSize: new ArrayBuffer(4),
    contentSize: new ArrayBuffer(8),
    contentIndex: new ArrayBuffer(0x2000),
  };

  constructor() {
    // We can call this right away since the size of the header is known
    this.setHeaderSize();

    // TODO: set certificateChainSize, ticketSize, tmdFileSize, metaSize, contentSize, contentIndex
    // An options variable in the constructor might be the easiest way
  }

  private setHeaderSize = () => {
    let size = 0;

    for (const ciaHeaderPart in this.ciaHeaderParts) {
      size += this.ciaHeaderParts[ciaHeaderPart].byteLength;
    }

    // Write the size of the header to a 4-byte little-endian integer; surely there's a better way to do this!
    const dataView = new DataView(this.ciaHeaderParts.headerSize);
    dataView.setInt32(0, size, true);
  };

  public write = (): Blob => {
    const headerData = new Blob(
      Object.keys(this.ciaHeaderParts).map(
        // "as BinaryLike" is required to fix a type issue :/
        (ciaHeaderPart) => this.ciaHeaderParts[ciaHeaderPart] as BinaryLike
      ),
      {
        type: 'application/octet-stream',
      }
    );

    return headerData;
  };
}
