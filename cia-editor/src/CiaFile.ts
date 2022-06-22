import { CiaCertChain } from './CiaCertChain';
import { CiaHeader } from './CiaHeader';
import { CiaNcch } from './CiaNcch';
import { CiaTicket } from './CiaTicket';
import { CiaTitleMetadata } from './CiaTitleMetadata';
import { calculateAlignedSize } from './utils';

// https://www.3dbrew.org/wiki/CIA
export class CiaFile {
  arrayBuffer: ArrayBuffer;
  header: CiaHeader;
  certChain: CiaCertChain;
  ticket: CiaTicket;
  titleMetadata: CiaTitleMetadata;
  ncch: CiaNcch;

  constructor(arrayBuffer: ArrayBuffer) {
    this.arrayBuffer = arrayBuffer;
    this.header = new CiaHeader(this.arrayBuffer);

    // Each section in the CIA file is 64-byte aligned
    const certChainStartingByte = calculateAlignedSize(this.header.size, 0x40);
    this.certChain = new CiaCertChain();

    const ticketStartingByte = calculateAlignedSize(
      certChainStartingByte + this.certChain.size,
      0x40
    );
    this.ticket = new CiaTicket(this.arrayBuffer, ticketStartingByte);

    const titleMetadataStartingByte = calculateAlignedSize(
      ticketStartingByte + this.ticket.size,
      0x40
    );
    this.titleMetadata = new CiaTitleMetadata(
      this.arrayBuffer,
      titleMetadataStartingByte
    );

    const ncchStartingByte = calculateAlignedSize(
      titleMetadataStartingByte + this.titleMetadata.size,
      0x40
    );
    this.ncch = new CiaNcch(this.arrayBuffer, ncchStartingByte);
  }

  public static async fromBlob(blob: Blob): Promise<CiaFile> {
    return new CiaFile(await blob.arrayBuffer());
  }

  // toBlob = (): Blob => {};
}
