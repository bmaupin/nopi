// https://www.3dbrew.org/wiki/RomFS
// http://problemkaputt.de/gbatek-3ds-files-ncch-romfs.htm

import { RomFsFileMetadata } from './RomFsFileMetadata';
import { calculateAlignedSize } from './utils';

// first 0x5c bytes are the header
export class CiaRomFs {
  private arrayBuffer: ArrayBuffer;
  private startingByte: number;

  private static LEVEL_3_OFFSET = 0x1000;

  constructor(arrayBuffer: ArrayBuffer, startingByte: number) {
    this.arrayBuffer = arrayBuffer;
    this.startingByte = startingByte;
  }

  // test.cia: RomFs starts at 0xb900
  // retroarch cia: RomFs starts at 0x49f900
  get magic() {
    return new Uint8Array(this.arrayBuffer, this.startingByte, 0x8);
  }

  // test.cia: 0xb908
  // retroarch cia: 0x49f908
  get masterHashSize() {
    const dataView = new DataView(
      this.arrayBuffer,
      this.startingByte + 0x8,
      0x4
    );
    return dataView.getUint32(0, true);
  }

  // Size of level 1 (before padding to block size)
  // test.cia: 0xb914
  // retroarch cia: 0x49f914
  get level1Size() {
    const dataView = new DataView(
      this.arrayBuffer,
      this.startingByte + 0x14,
      0x8
    );
    return dataView.getBigUint64(0, true);
  }

  // test.cia: 0xb91c
  // retroarch cia: 0x49f91c
  get level1BlockSize() {
    const dataView = new DataView(
      this.arrayBuffer,
      this.startingByte + 0x1c,
      0x4
    );
    const level1BlockSizeLog2 = dataView.getUint32(0, true);
    return Math.pow(2, level1BlockSizeLog2);
  }

  // TODO: this needs a setter
  // Size of level 2 (before padding to block size)
  // test.cia: 0xb92c
  // retroarch cia: 0x49f92c
  get level2Size() {
    const dataView = new DataView(
      this.arrayBuffer,
      this.startingByte + 0x2c,
      0x8
    );
    return dataView.getBigUint64(0, true);
  }

  // TODO: this needs a setter
  // Size of level 3 (before padding to block size)
  // test.cia: 0xb944
  // retroarch cia: 0x49f944
  get level3Size() {
    const dataView = new DataView(
      this.arrayBuffer,
      this.startingByte + 0x44,
      0x8
    );
    return dataView.getBigUint64(0, true);
  }

  // test.cia: 0xb94c
  // retroarch cia: 0x49f94c
  get level3BlockSize() {
    const dataView = new DataView(
      this.arrayBuffer,
      this.startingByte + 0x4c,
      0x4
    );
    const level3BlockSizeLog2 = dataView.getUint32(0, true);
    return Math.pow(2, level3BlockSizeLog2);
  }

  // TODO: this needs a setter
  // 0xb960
  // retroarch cia: 0x49f960
  get masterHash() {
    return new Uint8Array(
      this.arrayBuffer,
      this.startingByte + 0x60,
      this.masterHashSize
    );
  }

  // TODO: clean this up
  // 0x1000 (0x4a0900): RomFS Directory/File area (aka Level 3)
  // test.cia: 0xc900
  /*
     ** first difference is after 0x190!!

     directory hash table: 0x28 + 0x14 = 0x3c
     directory table: 0x3c + 0xa0 = 0xdc
     file hash table: 0xdc + 0x1c = 0xf8
     file table: 0xf8 + 0x18c = 0x284
        (0x4a09f8)

      FILES
      - 1 (retroarch-salamander.cfg): 0x4a09f8
      - 2 (retroarch.cfg): 0x4a0a48
      - 3 (rom.bin): 0x4a0a84
      - 4 (??/bottom_menu.png): 0x4a0ab4

     file data:


     FILE TABLE TODO
     - rom.bin (0x4a0a84)
      - fileDataSize needs to change
     - bottom_menu.png (0x4a0ab4)
      - fileDataOffset needs to change
     - fceumm.libretro.cia (0x4a0af4)
      - fileDataOffset needs to change
     - fceumm_libretro.info
      - fileDataOffset needs to change
  */

  // Offset of the file metadata table inside the level 3 section
  // retroarch cia: 0x4a091c
  get fileTableOffset() {
    const dataView = new DataView(
      this.arrayBuffer,
      this.startingByte + 0x101c,
      0x4
    );
    return dataView.getUint32(0, true);
  }

  // retroarch cia: 0x4a0920
  get fileTableLength() {
    const dataView = new DataView(
      this.arrayBuffer,
      this.startingByte + 0x1020,
      0x4
    );
    return dataView.getUint32(0, true);
  }

  // retroarch cia: 0x4a0924
  get fileDataOffset() {
    const dataView = new DataView(
      this.arrayBuffer,
      this.startingByte + 0x1024,
      0x4
    );
    return dataView.getUint32(0, true);
  }

  // TODO: rename this to ... fileMetadata? We need to figure out what we want the API to look like...
  // retroarch cia: 0x4a09f8
  get files() {
    const fileTableStartingByte =
      this.startingByte + CiaRomFs.LEVEL_3_OFFSET + this.fileTableOffset;
    const currentFiles: RomFsFileMetadata[] = [];

    let currentByte = fileTableStartingByte;
    let currentFile: RomFsFileMetadata;

    while (currentByte < fileTableStartingByte + this.fileTableLength) {
      currentFile = new RomFsFileMetadata(this.arrayBuffer, currentByte);
      currentFiles.push(currentFile);
      currentByte += currentFile.size;
    }

    return currentFiles;
  }
}
