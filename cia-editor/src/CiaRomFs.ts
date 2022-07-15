// https://www.3dbrew.org/wiki/RomFS
// http://problemkaputt.de/gbatek-3ds-files-ncch-romfs.htm
export class CiaRomFs {
  private arrayBuffer: ArrayBuffer;
  private startingByte: number;

  constructor(arrayBuffer: ArrayBuffer, startingByte: number) {
    this.arrayBuffer = arrayBuffer;
    this.startingByte = startingByte;
  }

  // test.cia: RomFs starts at 0xb900
  // retroarch cia: RomFs starts at 0x49f900
  get magic() {
    return new Uint8Array(this.arrayBuffer, this.startingByte, 0x8);
  }

  get masterHashSize() {
    const dataView = new DataView(
      this.arrayBuffer,
      this.startingByte + 0x8,
      0x4
    );
    return dataView.getUint32(0, true);
  }

  // TODO: this needs a setter
  get level2HashdataSize() {
    const dataView = new DataView(
      this.arrayBuffer,
      this.startingByte + 0x2c,
      0x8
    );
    return dataView.getBigUint64(0, true);
  }

  // TODO: this needs a setter
  get level3HashdataSize() {
    const dataView = new DataView(
      this.arrayBuffer,
      this.startingByte + 0x44,
      0x8
    );
    return dataView.getBigUint64(0, true);
  }

  // TODO: this needs a setter
  get masterHash() {
    return new Uint8Array(
      this.arrayBuffer,
      this.startingByte + 0x60,
      this.masterHashSize
    );
  }
}
