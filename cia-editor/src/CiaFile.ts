import { CiaCertChain } from './CiaCertChain';
import { CiaHeader } from './CiaHeader';
import { CiaTicket } from './CiaTicket';
import { calculateAlignedSize } from './utils';

// https://www.3dbrew.org/wiki/CIA
export class CiaFile {
  arrayBuffer: ArrayBuffer;
  header: CiaHeader;
  certChain: CiaCertChain;
  ticket: CiaTicket;

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
  }

  public static async fromBlob(blob: Blob): Promise<CiaFile> {
    return new CiaFile(await blob.arrayBuffer());
  }

  // toBlob = (): Blob => {};
}
