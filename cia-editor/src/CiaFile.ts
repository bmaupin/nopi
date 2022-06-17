import { CiaHeader } from './CiaHeader';

// https://www.3dbrew.org/wiki/CIA
export class CiaFile {
  arrayBuffer: ArrayBuffer;
  header: CiaHeader;

  constructor(arrayBuffer: ArrayBuffer) {
    this.arrayBuffer = arrayBuffer;
    this.header = new CiaHeader(this.arrayBuffer);
  }

  public static async fromBlob(blob: Blob): Promise<CiaFile> {
    return new CiaFile(await blob.arrayBuffer());
  }

  // toBlob = (): Blob => {};
}
