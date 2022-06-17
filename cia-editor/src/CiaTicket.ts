import { compareUint8Arrays } from './utils';

// https://www.3dbrew.org/wiki/Ticket
export class CiaTicket {
  private signatureType: Uint8Array;
  signature: Uint8Array;
  titleKey: Uint8Array;
  ticketId: Uint8Array;
  titleId: Uint8Array;

  constructor(arrayBuffer: ArrayBuffer, startingByte: number) {
    this.signatureType = new Uint8Array(arrayBuffer, startingByte, 4);

    // TODO: implement functionality to write these properties
    this.signature = new Uint8Array(
      arrayBuffer,
      startingByte + 4,
      this.signatureSize
    );

    this.titleKey = new Uint8Array(
      arrayBuffer,
      startingByte + this.signatureSectionSize + 0x7f,
      0x10
    );

    this.ticketId = new Uint8Array(
      arrayBuffer,
      startingByte + this.signatureSectionSize + 0x90,
      0x8
    );

    this.titleId = new Uint8Array(
      arrayBuffer,
      startingByte + this.signatureSectionSize + 0x9c,
      0x8
    );
  }

  private get signatureSize() {
    if (
      compareUint8Arrays(
        this.signatureType,
        new Uint8Array([0x00, 0x01, 0x00, 0x04])
      )
    ) {
      return 0x100;
    } else {
      throw new Error('Unknown signature type in ticket');
    }
  }

  private get signatureSectionSize() {
    if (
      compareUint8Arrays(
        this.signatureType,
        new Uint8Array([0x00, 0x01, 0x00, 0x04])
      )
    ) {
      return 0x140;
    } else {
      throw new Error('Unknown signature type in ticket');
    }
  }
}
