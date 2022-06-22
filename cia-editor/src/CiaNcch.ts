// https://www.3dbrew.org/wiki/NCCH
export class CiaNcch {
  private arrayBuffer: ArrayBuffer;
  private startingByte: number;

  readonly signature: Uint8Array;

  constructor(arrayBuffer: ArrayBuffer, startingByte: number) {
    this.arrayBuffer = arrayBuffer;
    this.startingByte = startingByte;

    // TODO: implement functionality to write these properties

    // TODO: move this into a getter for more consistency?
    // 0x3900
    this.signature = new Uint8Array(arrayBuffer, startingByte, 0x100);
  }

  // TODO: this needs to be set
  // 0x3a04
  // "Content size, in media units (1 media unit = 0x200 bytes)" 🤷‍♂️
  // https://www.3dbrew.org/wiki/NCCH#NCCH_Header
  get size() {
    const dataView = new DataView(
      this.arrayBuffer,
      this.startingByte + 0x104,
      0x4
    );
    const contentSizeInMediaUnits = dataView.getUint32(0, true);
    return contentSizeInMediaUnits * 0x200;
  }

  // TODO: set content size everywhere at once (header, TMD, NCCH)
  // 0x3a08
  get titleId() {
    return new Uint8Array(
      this.arrayBuffer,
      this.startingByte + 0x108,
      0x8
      // The title ID is backwards here. Go figure
    ).reverse();
  }

  // TODO: update this when we update title ID
  // 0x3a08
  get programId() {
    return new Uint8Array(
      this.arrayBuffer,
      this.startingByte + 0x118,
      0x8
      // The title ID is backwards here. Go figure
    ).reverse();
  }

  // 0x3a50
  get productCode() {
    const uintArray = new Uint8Array(
      this.arrayBuffer,
      this.startingByte + 0x150,
      0x10
    );
    // Decode the text and remove the null characters at the end
    return new TextDecoder('utf8').decode(uintArray).replace(/\0.*$/g, '');
  }

  // 0x3ab4
  // "RomFS size, in media units"
  // https://www.3dbrew.org/wiki/NCCH#NCCH_Header
  get romFsSize() {
    const dataView = new DataView(
      this.arrayBuffer,
      this.startingByte + 0x1b4,
      0x4
    );
    const romFsSizeInMediaUnits = dataView.getUint32(0, true);
    return romFsSizeInMediaUnits * 0x200;
  }

  // 0x3ae0
  get romFsHash() {
    return new Uint8Array(this.arrayBuffer, this.startingByte + 0x1e0, 0x20);
  }
}
