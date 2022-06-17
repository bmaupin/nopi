// https://www.3dbrew.org/wiki/CIA
export class CiaFile {
  arrayBuffer: ArrayBuffer;

  constructor(arrayBuffer: ArrayBuffer) {
    this.arrayBuffer = arrayBuffer;
  }

  public static async fromBlob(blob: Blob): Promise<CiaFile> {
    return new CiaFile(await blob.arrayBuffer());
  }

  // toBlob = (): Blob => {};
}
