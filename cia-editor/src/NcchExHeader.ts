// NCCH extended header
// https://www.3dbrew.org/wiki/NCCH/Extended_Header#Main_Structure
// http://problemkaputt.de/gbatek-3ds-files-ncch-extended-header.htm
export class NcchExHeader {
  private arrayBuffer: ArrayBuffer;
  private startingByte: number;

  private _jumpId: Uint8Array;
  private _programId: Uint8Array;
  private _aci2ProgramId: Uint8Array;

  constructor(arrayBuffer: ArrayBuffer, startingByte: number) {
    this.arrayBuffer = arrayBuffer;
    this.startingByte = startingByte;

    // Handle these similarly to title ID/program ID in NCCH
    this._jumpId = new Uint8Array(
      this.arrayBuffer,
      this.startingByte + 0x1c8,
      0x8
    );
    this._programId = new Uint8Array(
      this.arrayBuffer,
      this.startingByte + 0x200,
      0x8
    );
    this._aci2ProgramId = new Uint8Array(
      this.arrayBuffer,
      this.startingByte + 0x600,
      0x8
    );
  }

  // *** "SCI" ***
  // Starts at 0x3b00 (0x200 offset in NCCH)

  // This seems to be the same as the title ID
  // 0x3cc8 (0x3c8 offset in NCCH, 0x1c8 offset in exheader)
  get jumpId() {
    return new Uint8Array(this._jumpId).reverse();
  }

  set jumpId(newId: Uint8Array) {
    // Copy newId and reverse the copy to avoid changing the value we're passed
    const copyOfNewId = new Uint8Array(newId);
    copyOfNewId.reverse();

    this._jumpId.set(copyOfNewId);
  }

  // *** "ACI" ***
  // Starts at 0x3d00

  // This seems to be the same as the title ID
  // 0x3d00 (0x400 offset in NCCH, 0x200 offset in exheader)
  get programId() {
    return new Uint8Array(this._programId).reverse();
  }

  set programId(newId: Uint8Array) {
    // Copy newId and reverse the copy to avoid changing the value we're passed
    const copyOfNewId = new Uint8Array(newId);
    copyOfNewId.reverse();

    this._programId.set(copyOfNewId);
  }

  // *** Signature ***

  // 0x3f00 (0x600 offset in NCCH, 0x400 offset in exheader)
  get signature() {
    return new Uint8Array(this.arrayBuffer, this.startingByte, 0x400);
  }

  updateSignature = () => {
    // TODO: "RSA-SHA256 Signature across [900h..BFFh] (using key from bootrom)"
    //
    // TODO: updating the signature here should trigger an update in the exheader hash in the NCCH header
  };

  // *** "ACI (for limitation of first ACI)" ***
  // Starts at 0x4100

  // This seems to be the same as the title ID
  // 0x4100 (0x800 offset in NCCH, 0x600 offset in exheader)
  get aci2ProgramId() {
    return new Uint8Array(this._aci2ProgramId).reverse();
  }

  set aci2ProgramId(newId: Uint8Array) {
    // Copy newId and reverse the copy to avoid changing the value we're passed
    const copyOfNewId = new Uint8Array(newId);
    copyOfNewId.reverse();

    this._aci2ProgramId.set(copyOfNewId);
  }
}
