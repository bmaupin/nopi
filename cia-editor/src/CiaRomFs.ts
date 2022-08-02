// https://www.3dbrew.org/wiki/RomFS
// http://problemkaputt.de/gbatek-3ds-files-ncch-romfs.htm

import { RomFsFile } from './RomFsFile';
import { calculateAlignedSize, getHash } from './utils';

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
      // Technically this and the level 2/3 sizes are 64-bit, but it becomes a bit of a
      // nightmare to pass around BigInt values everywhere; some places (like the
      // Uint8Array constructor) simply won't take a BigInt. A 32-bit value can represent
      // up to 4 GB of data, so I think that's more than enough for our use.
      0x4
    );
    return dataView.getUint32(0, true);
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
  // Size of level 2 content in bytes (before padding to block size)
  // test.cia: 0xb92c
  // retroarch cia: 0x49f92c
  get level2Size() {
    const dataView = new DataView(
      this.arrayBuffer,
      this.startingByte + 0x2c,
      0x4
    );
    return dataView.getUint32(0, true);
  }

  // TODO: this needs a setter
  // Size of level 3 content in bytes (before padding to block size)
  // test.cia: 0xb944
  // retroarch cia: 0x49f944
  get level3Size() {
    const dataView = new DataView(
      this.arrayBuffer,
      this.startingByte + 0x44,
      0x4
    );
    return dataView.getUint32(0, true);
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
  // test.cia: 0xb960
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
  // test.cia: 0xc91c
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

  // This is the offset of the file data from the start of the level 3 section,
  // which starts at offset 0x1000 in the RomFS
  // test.cia: 0xc924
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
    const currentFiles: RomFsFile[] = [];

    let currentByte = fileTableStartingByte;
    let currentFile: RomFsFile;

    while (currentByte < fileTableStartingByte + this.fileTableLength) {
      currentFile = new RomFsFile(
        this.arrayBuffer,
        currentByte,
        this.startingByte + CiaRomFs.LEVEL_3_OFFSET + this.fileDataOffset,
        this.update
      );
      currentFiles.push(currentFile);
      currentByte += currentFile.metadataSize;
    }

    return currentFiles;
  }

  /*
    - bottom_menu.png
      - location: 0x4a0f60 - 0x4a281a
         0x49f900 + 0x1000 + file data offset (0x290) + offset (0x3d0)
    - fceumm_libretro.cia
      - location: 04a2820 - 0x4a2820 (0 bytes)
          0x49f900 + 0x1000 + file data offset (0x290) + offset (0x1c90)
  */

  /* TODO: what after files is different?
     - dummy: PNG starts at 0x004a0f60
     - modified: PNG starts at 0x004e0f60

  */

  // TODO: handle this difference
  // I believe this is "level 1", which are hashes of each 0x1000-byte block in level 2 :P
  // get level 1 offset and size from the RomFS header
  // 0x20 bytes; looks like a hash
  // - dummy: 0x004a2900 - 0x004a2920
  // - modified: 0x004e2900 - 0x004e2920
  //
  /*
     - Level 1 starting location
       - info
        - level 3 block size is 0c (2^12 = 0x1000)
        - level 3 size of directory/file area (at 0x44) = 0x1f20
       - calculation
          0x49f900 (starting byte) + (0x1f20 (level 3 size) rounded up to nearest block size (0x1000) = 0x2000?)


      - this.startingByte + 0x1000 + level 3 size? (at 0x44) = 0x1f20 = 4a2820
  */

  // TODO: handle this difference
  // I believe this is "level 2", which are hashes of each 0x1000-byte block in level 3 :P
  // get level 2 offset and size from the RomFS header
  // 0x840 bytes; ... is this the file lookup table?
  // - dummy: 0x004a3900 - 0x004a4140
  // - modified: 0x004e3900 - 0x004e4140
  /*

    Starting offset calculation, I think
     level 1 starting location + (level 1 size (at 0x14) = 0x20, rounded up to nearest block size (0x1000) = 0x1000)

   */

  // Level 1 contains hashes for each 0x1000 block of level 2
  // test.cia: 0xd900
  get level1Hashes() {
    const level1HashesStartingByte =
      this.startingByte +
      CiaRomFs.LEVEL_3_OFFSET +
      calculateAlignedSize(this.level3Size, this.level3BlockSize);
    const hashes: Uint8Array[] = [];

    let currentByte = level1HashesStartingByte;

    while (currentByte < level1HashesStartingByte + this.level1Size) {
      const hash = new Uint8Array(this.arrayBuffer, currentByte, 0x20);
      hashes.push(hash);

      currentByte += 0x20;
    }

    return hashes;
  }

  updateLevel1Hashes = (): void => {
    for (
      let currentByte = this.level2HashesStartingByte, i = 0;
      currentByte < this.level2HashesStartingByte + this.level2Size;
      currentByte += 0x1000, i++
    ) {
      const dataToHash = new Uint8Array(this.arrayBuffer, currentByte, 0x1000);
      this.level1Hashes[i].set(getHash(dataToHash));
    }
  };

  // Level 2 contains hashes for each 0x1000 block of level 3
  // test.cia: 0xe900
  get level2Hashes() {
    const hashes: Uint8Array[] = [];

    for (
      let currentByte = this.level2HashesStartingByte;
      currentByte < this.level2HashesStartingByte + this.level1Size;
      currentByte += 0x20
    ) {
      const hash = new Uint8Array(this.arrayBuffer, currentByte, 0x20);
      hashes.push(hash);
    }

    return hashes;
  }

  private get level2HashesStartingByte() {
    return (
      this.startingByte +
      CiaRomFs.LEVEL_3_OFFSET +
      calculateAlignedSize(this.level3Size, this.level3BlockSize) +
      calculateAlignedSize(this.level1Size, this.level1BlockSize)
    );
  }

  updateLevel2Hashes = (): void => {
    const level3StartingByte = this.startingByte + CiaRomFs.LEVEL_3_OFFSET;

    for (
      let currentByte = level3StartingByte, i = 0;
      currentByte < level3StartingByte + this.level3Size;
      currentByte += 0x1000, i++
    ) {
      const dataToHash = new Uint8Array(this.arrayBuffer, currentByte, 0x1000);
      this.level2Hashes[i].set(getHash(dataToHash));
    }
  };

  update = (): void => {
    this.updateLevel2Hashes();
    this.updateLevel1Hashes();
    // TODO: update master hash
    // TODO: call NCCH update method
  };
}
