import { CiaCertChain } from './CiaCertChain';
import { CiaHeader } from './CiaHeader';
import { CiaNcch } from './CiaNcch';
import { CiaRomFs } from './CiaRomFs';
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
  romFs: CiaRomFs;

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

    // TODO: implement this
    // const exeFsStartingByte = ncchStartingByte + this.ncch.exeFsOffset;
    // this.exeFs = new CiaExeFs(this.arrayBuffer, exeFsStartingByte);

    const romFsStartingByte = ncchStartingByte + this.ncch.romFsOffset;
    this.romFs = new CiaRomFs(this.arrayBuffer, romFsStartingByte);
  }

  public static async fromBlob(blob: Blob): Promise<CiaFile> {
    return new CiaFile(await blob.arrayBuffer());
  }

  // The title ID occurs at different points in the CIA file; we'll consider the one in
  // the ticket to be the authoritative title ID, even though they should all be the same
  get titleId() {
    return this.ticket.titleId;
  }

  set titleId(newTitleId: Uint8Array) {
    console.log('newTitleId=', newTitleId);

    this.ticket.titleId = newTitleId;
    this.ticket.generateNewTicketId();
    this.ticket.generateNewTitleKey();
    // TODO: update ticket signature

    this.titleMetadata.titleId = newTitleId;
    // TODO: update TMD signature

    this.ncch.titleId = newTitleId;
    this.ncch.programId = newTitleId;
    // TODO: update NCCH signature
  }

  // toBlob = (): Blob => {};
}
