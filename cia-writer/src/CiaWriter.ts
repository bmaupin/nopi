import { Blob } from 'buffer';
import { CiaCertChain } from './CiaCertChain';

import { CiaHeader } from './CiaHeader';

export class CiaWriter {
  // Node.js doesn't support File; it supports Blob starting with v14
  public toBlob = (): Blob => {
    const certChain = new CiaCertChain();
    const header = new CiaHeader({ certificateChainSize: certChain.size });

    return new Blob([header.toBlob(), certChain.toBlob()], {
      type: 'application/octet-stream',
    });
  };
}
