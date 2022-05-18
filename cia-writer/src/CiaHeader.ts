import { Blob } from 'fetch-blob';

export interface CiaHeaderOptions {
  certChainSize: number;
}

// TODO: is this class overengineered? if we always know the header size, we could just
// create a fixed length ArrayBuffer for everything and write values at hardcoded locations
export class CiaHeader {
  // All the parts of the CIA header, in order
  private ciaHeaderParts = {
    headerSize: new ArrayBuffer(4),
    ciaType: new ArrayBuffer(2),
    ciaVersion: new ArrayBuffer(2),
    certChainSize: new ArrayBuffer(4),
    ticketSize: new ArrayBuffer(4),
    tmdFileSize: new ArrayBuffer(4),
    metaSize: new ArrayBuffer(4),
    contentSize: new ArrayBuffer(8),
    contentIndex: new ArrayBuffer(0x2000),
  };

  constructor(options: CiaHeaderOptions) {
    CiaHeader.writeInt32(this.size, this.ciaHeaderParts.headerSize);

    CiaHeader.writeInt32(
      options.certChainSize,
      this.ciaHeaderParts.certChainSize
    );

    // TODO: set ticketSize, tmdFileSize, metaSize, contentSize, contentIndex
  }

  // Write integer to a 4-byte little-endian integer; surely there's a better way to do this!
  private static writeInt32(integer: number, destination: ArrayBuffer) {
    const dataView = new DataView(destination);
    dataView.setInt32(0, integer, true);
  }

  get size(): number {
    let size = 0;

    for (const ciaHeaderPart in this.ciaHeaderParts) {
      size += this.ciaHeaderParts[ciaHeaderPart].byteLength;
    }

    return size;
  }

  public toBlob = (): Blob => {
    const headerData = new Blob(
      Object.keys(this.ciaHeaderParts).map(
        (ciaHeaderPart) => this.ciaHeaderParts[ciaHeaderPart]
      ),
      {
        type: 'application/octet-stream',
      }
    );

    return headerData;
  };
}
