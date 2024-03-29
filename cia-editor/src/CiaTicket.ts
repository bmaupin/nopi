import {
  getSignature,
  getSignatureSectionSize,
  getSignatureSize,
  randomBytes,
} from './utils';

// https://www.3dbrew.org/wiki/Ticket
// Starts at 0x2a40
export class CiaTicket {
  private static readonly TICKET_DATA_SIZE = 0x210;

  private arrayBuffer: ArrayBuffer;
  private startingByte: number;
  private signatureType: Uint8Array;

  constructor(arrayBuffer: ArrayBuffer, startingByte: number) {
    this.arrayBuffer = arrayBuffer;
    this.startingByte = startingByte;

    this.signatureType = new Uint8Array(arrayBuffer, startingByte, 4);
  }

  // 0x2a44
  get signature() {
    return new Uint8Array(
      this.arrayBuffer,
      this.startingByte + 4,
      getSignatureSize(this.signatureType)
    );
  }

  updateSignature = () => {
    const dataToSign = new Uint8Array(
      this.arrayBuffer,
      this.startingByte + getSignatureSectionSize(this.signatureType),
      CiaTicket.TICKET_DATA_SIZE
    );

    this.signature.set(getSignature(dataToSign));
  };

  // 0x2bff
  get titleKey() {
    return new Uint8Array(
      this.arrayBuffer,
      this.startingByte + getSignatureSectionSize(this.signatureType) + 0x7f,
      0x10
    );
  }

  // It seems that the title key can be random
  // https://github.com/3DSGuy/Project_CTR/blob/319c4c6a24747a6def3c012312ed13a2f76bb369/makerom/cia.c#L188
  generateNewTitleKey = () => {
    this.titleKey.set(new Uint8Array(randomBytes(0x10)));
    this.updateSignature();
  };

  // 0x2c10
  get ticketId() {
    return new Uint8Array(
      this.arrayBuffer,
      this.startingByte + getSignatureSectionSize(this.signatureType) + 0x90,
      0x8
    );
  }

  // Ticket ID always seems to be random
  // https://github.com/3DSGuy/Project_CTR/blob/319c4c6a24747a6def3c012312ed13a2f76bb369/makerom/cia.c#L179
  generateNewTicketId = () => {
    this.ticketId.set(new Uint8Array([0x00, 0x04, ...randomBytes(6)]));
    this.updateSignature();
  };

  // 0x2c1c
  get titleId() {
    return new Uint8Array(
      this.arrayBuffer,
      this.startingByte + getSignatureSectionSize(this.signatureType) + 0x9c,
      0x8
    );
  }

  set titleId(newTitleId: Uint8Array) {
    this.titleId.set(newTitleId);
    this.updateSignature();
  }

  get size() {
    return (
      getSignatureSectionSize(this.signatureType) + CiaTicket.TICKET_DATA_SIZE
    );
  }
}
