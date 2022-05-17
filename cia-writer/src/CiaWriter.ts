import { Blob } from 'buffer';

import { CiaCertChain } from './CiaCertChain';
import { CiaHeader } from './CiaHeader';
import { CiaTicket } from './CiaTicket';

export class CiaWriter {
  // Node.js doesn't support File; it supports Blob starting with v14
  public toBlob = async (): Promise<Blob> => {
    const certChain = new CiaCertChain();
    const header = new CiaHeader({ certChainSize: certChain.size });
    const ticket = new CiaTicket();

    return new Blob(
      [
        await CiaWriter.padTo64Bytes(header.toBlob()),
        await CiaWriter.padTo64Bytes(certChain.toBlob()),
        await CiaWriter.padTo64Bytes(ticket.toBlob()),
      ],
      {
        type: 'application/octet-stream',
      }
    );
  };

  // Each section in the file should be 64-byte aligned; this adds padding if necessary
  private static padTo64Bytes = async (blob: Blob): Promise<Blob> => {
    const initialArrayBuffer = await blob.arrayBuffer();
    const initialSize = initialArrayBuffer.byteLength;

    if (initialSize % 64 !== 0) {
      const newSize = initialSize + (64 - (initialSize % 64));
      const newIntArray = new Uint8Array(newSize);
      newIntArray.set(new Uint8Array(initialArrayBuffer));

      return new Blob([newIntArray]);
    } else {
      return blob;
    }
  };
}
