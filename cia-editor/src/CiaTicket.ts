import { getSignatureSectionSize, getSignatureSize } from './utils';

// https://www.3dbrew.org/wiki/Ticket
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

    // TODO: implement functionality to write these properties
    this.signature = new Uint8Array(
      arrayBuffer,
      startingByte + 4,
      getSignatureSize(this.signatureType)
    );

    this.titleKey = new Uint8Array(
      arrayBuffer,
      startingByte + getSignatureSectionSize(this.signatureType) + 0x7f,
      0x10
    );

    this.ticketId = new Uint8Array(
      arrayBuffer,
      startingByte + getSignatureSectionSize(this.signatureType) + 0x90,
      0x8
    );

    // TODO: titleId setter should be in CiaFile so we can set it everywhere at once (ticket, TMD, NCCH)
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
