import { getSignatureSectionSize, getSignatureSize } from './utils';

// https://www.3dbrew.org/wiki/Ticket
// Starts at 0x2a40
export class CiaTicket {
  private arrayBuffer: ArrayBuffer;
  private startingByte: number;

  private readonly ticketDataSize = 0x210;

  private signatureType: Uint8Array;
  readonly signature: Uint8Array;
  titleKey: Uint8Array;
  readonly ticketId: Uint8Array;
  titleId: Uint8Array;

  constructor(arrayBuffer: ArrayBuffer, startingByte: number) {
    this.arrayBuffer = arrayBuffer;
    this.startingByte = startingByte;

    this.signatureType = new Uint8Array(arrayBuffer, startingByte, 4);

    // TODO: this needs a setter
    // 0x2a44
    this.signature = new Uint8Array(
      arrayBuffer,
      startingByte + 4,
      getSignatureSize(this.signatureType)
    );

    // TODO: this needs a setter
    // 0x2bff
    this.titleKey = new Uint8Array(
      arrayBuffer,
      startingByte + getSignatureSectionSize(this.signatureType) + 0x7f,
      0x10
    );

    // TODO: this needs a setter
    // 0x2c10
    this.ticketId = new Uint8Array(
      arrayBuffer,
      startingByte + getSignatureSectionSize(this.signatureType) + 0x90,
      0x8
    );

    // TODO: titleId setter should be in CiaFile so we can set it everywhere at once (ticket, TMD, NCCH)
    // TODO: this needs a setter
    // 0x2c1c
    this.titleId = new Uint8Array(
      arrayBuffer,
      startingByte + getSignatureSectionSize(this.signatureType) + 0x9c,
      0x8
    );
  }

  get size() {
    return getSignatureSectionSize(this.signatureType) + this.ticketDataSize;
  }
}
