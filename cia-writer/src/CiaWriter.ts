import { Blob } from 'buffer';

import { CiaHeader } from './CiaHeader';

export class CiaWriter {
  private header: CiaHeader;

  constructor() {
    this.header = new CiaHeader();

    // NOTE: the header is 0x2020, but the next section (certificate chain) will start at 0x2040 because the data is aligned in 64-byte blocks
  }

  // TODO: should we use a different name than "write"?
  // Node.js doesn't support File; it supports Blob starting with v14
  public write = (): Blob => {
    const ciaData = [this.header.write()];

    // TODO: piece together the final file from the individual sections
    return new Blob(ciaData, {
      type: 'application/octet-stream',
    });
  };
}
