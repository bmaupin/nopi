import utils from './utils';

export class CiaContent {
  // https://www.3dbrew.org/wiki/NCCH#NCCH_Header
  private ncchHeaderParts = {
    // TODO: generate signature
    signature: new Uint8Array(0x100),
    // "NCCH"
    magic: new Uint8Array([0x4e, 0x43, 0x43, 0x48]),
    // TODO: this needs to be set
    ncchSize: new Uint8Array(4),
    // TODO: this needs to be the same as the title ID in the ticket, but little endian :P
    titleId: new Uint8Array(8),
    // Default maker code ("00")
    makerCode: new Uint8Array([0x30, 0x30]),
    formatVersion: new Uint8Array([0x02, 0x00]),
    padding0: new Uint8Array(4),
    // TODO: set this to the exact same value as the titleID (above)
    programId: new Uint8Array(8),
    // 0x3a20
    padding1: new Uint8Array(0x10),
    // TODO: how to calculate this?
    // 0x3a30
    logoHash: new Uint8Array(0x20),
    // TODO: this needs to be set according to a pattern plus a random value; see NSUI UI for examples
    // 0x3a50
    productCode: new Uint8Array(0x10),
    // TODO: this needs to be calculated
    // 0x3a60
    exhdrHash: new Uint8Array(0x20),
    // 0x3a80
    exhdrSize: new Uint8Array([0x00, 0x04, 0x00, 0x00]),
    padding2: new Uint8Array(4),
    // TODO: these need to be set
    // 0x3a88
    flags: new Uint8Array(8),
    // 0x3a90
    plainRegionOffset: new Uint8Array(4),
    plainRegionSize: new Uint8Array(4),
    logoOffset: new Uint8Array([0x05, 0x00, 0x00, 0x00]),
    logoSize: new Uint8Array([0x10, 0x00, 0x00, 0x00]),
    // 0x3aa0
    exefsOffset: new Uint8Array([0x15, 0x00, 0x00, 0x00]),
    // TODO: this needs to be set
    exefsSize: new Uint8Array(4),
    exefsHashSize: new Uint8Array([0x01, 0x00, 0x00, 0x00]),
    padding4: new Uint8Array(4),
    // TODO: this needs to be set; empty in hello world, not empty in NSUI
    // 0x3ab0
    romfsOffset: new Uint8Array(4),
    // TODO: this needs to be set; empty in hello world, not empty in NSUI
    romfsSize: new Uint8Array(4),
    // TODO: this needs to be set; empty in hello world, not empty in NSUI
    romfsHashSize: new Uint8Array(4),
    padding5: new Uint8Array(4),
    // TODO: this needs to be set
    // 0x3ac0
    exefsHash: new Uint8Array(0x20),
    // TODO: this needs to be set; empty in hello world, not empty in NSUI
    // 0x3ae0
    romfsHash: new Uint8Array(0x20),
  };

  // private exeFsHeader = {
  //   // TODO: this needs to be set
  //   // 0x3b00
  //   name: new Uint8Array(8),
  //   // TODO: this needs to be set
  //   offset: new Uint8Array(4),
  //   // TODO: this needs to be set
  //   size: new Uint8Array(4),
  // };

  private codeSetInfoParts = {
    // TODO: this needs to be set; could it be anything? Like "Nopi" :)
    // 0x3b00
    name: new Uint8Array(8),
    padding0: new Uint8Array(5),
    // Bit 2 set: app uses SD card
    flag: new Uint8Array([0x02]),
    // I think we can ignore this; seems to be set in the RSF file (zero in hello world, non-zero in NSUI)
    remasterVersion: new Uint8Array(2),

    // 0x3b10
    // This comes directly from the ELF file!
    /*
     * readelf -S hello-world.elf
     *
      [ 1] .text             PROGBITS        00100000 010000 02120c 00  AX  0   0 32
      [ 2] .rel.text         REL             00000000 0b6080 005658 08   I 33   1  4
      [ 3] .rodata           PROGBITS        00122000 032000 007988 00   A  0   0  8
      [ 4] .rel.rodata       REL             00000000 0bb6d8 000108 08   I 33   3  4
      [ 5] .eh_frame         PROGBITS        00129988 039988 000000 00   A  0   0  4
      [ 6] .data             PROGBITS        0012a000 03a000 001efc 00  WA  0   0  8
      [ 7] .rel.data         REL             00000000 0bb7e0 000930 08   I 33   6  4
      [ 8] .got              PROGBITS        0012befc 03befc 000008 00  WA  0   0  4
      [ 9] .got.plt          PROGBITS        0012bf04 03bf04 00000c 04  WA  0   0  4
      [10] .tdata            PROGBITS        0012bf10 03bf18 000000 00 WAT  0   0  1
      [11] .tbss             NOBITS          0012bf10 03bf10 000c08 00 WAT  0   0  4
      [12] .init_array       INIT_ARRAY      0012bf10 03bf10 000004 04  WA  0   0  4
      [13] .rel.init_array   REL             00000000 0bc110 000008 08   I 33  12  4
      [14] .fini_array       FINI_ARRAY      0012bf14 03bf14 000004 04  WA  0   0  4
      [15] .rel.fini_array   REL             00000000 0bc118 000008 08   I 33  14  4
      [16] .bss              NOBITS          0012bf18 03bf18 0028cc 00  WA  0   0  8
     */
    // TODO: this needs to be set; address of the ELF .text section
    textAddress: new Uint8Array(4),
    // TODO: this needs to be set
    textNumMaxPages: new Uint8Array(4),
    // TODO: this needs to be set; size of the ELF .text section in bytes, little-endian
    textCodeSize: new Uint8Array(4),
  };

  setNumMaxPages = (codeSize: number) => {
    return utils.calculateAlignedSize(codeSize, 0x1000) / 0x1000;
  };
}
