import { RomFsFileMetadata } from './RomFsFileMetadata';

export class RomFsFile {
  private arrayBuffer: ArrayBuffer;
  private fileDataStartingByte: number;
  private updateRomFs: () => void;

  readonly metadata: RomFsFileMetadata;
  readonly metadataSize: number;

  private _content: Uint8Array;

  constructor(
    arrayBuffer: ArrayBuffer,
    metadataStartingByte: number,
    fileDataStartingByte: number,
    // TODO: this is basically an observer pattern hack; should we use the observer pattern?
    // We could use an abstract class or parent class for the Subject so it could include
    // the implementationand then just use an interface for Observer
    updateRomFs: () => void
  ) {
    this.arrayBuffer = arrayBuffer;
    this.fileDataStartingByte = fileDataStartingByte;
    this.updateRomFs = updateRomFs;

    this.metadata = new RomFsFileMetadata(arrayBuffer, metadataStartingByte);
    this.metadataSize = this.metadata.size;

    this._content = new Uint8Array(
      this.arrayBuffer,
      this.fileDataStartingByte + this.metadata.fileDataOffset,
      this.metadata.fileDataSize
    );
  }

  get name() {
    return this.metadata.fileName;
  }

  /*
     TODO: development notes; clean up
     - rom.bin content starts at 0x4a0f50
       - this is calculated starting with the starting offset of the RomFS (0x49f900)
       - add the offset for

     - rom.bin offset is 0x3c0
     - file data section offset (defined at 0x0x4a0924): 0x290
   */
  // Use getters and setters for the content for two reasons:
  // 1. To make it easier to set the content (set it directly instead of having to call .set)
  // 2. When the content is changed, we'll need to trigger methods to update the various hashes throughout the CIA file
  get content() {
    return this._content;
  }

  set content(newValue: ArrayLike<number>) {
    this._content.set(newValue);
    this.updateRomFs();
  }

  /* TODO: development notes; clean up

      Now the fun begins... here's what needs to be updated if the contents change (if the size stays the same):
      - [x] Level 2 hash needs to be updated to reflect changed file contents (level 3)
      - [ ] Level 1 hash needs to be updated to reflect changed level 2 contents
      - [ ] Master hash needs to be updated to reflect changed level 1 contents
      - [ ] NCCH RomFS hash needs to be updated to reflect changed RomFS contents
      - [ ] NCCH signature needs to be updated to reflect changed NCCH header contents?
      - [ ] Title metadata contentHash needs to be updated?
      - [ ] Title metadata contentChunkHash needs to be updated?
      - [ ] Title metadata infoRecordHash? (I'm not even sure what this is :P)
      - [ ] Title metadata signature

      If the size of the content changes, here's what needs to be updated (in addition to the above):
      - [ ] Everything after the changed content needs to be moved in the file
      - [ ] RomFsFileMetadata fileDataSize
      - [ ] RomFsFileMetadata fileDataOffset for all files after the changed file
      - [ ] CiaRomFs level3Size
      - [ ] CiaRomFs level2Size
      - [ ] (We shouldn't need to change this) CiaRomFs level1Size
      - [ ] (We shouldn't need to change this) CiaRomFs masterHashSize
      - [ ] CiaNcch romFsSize
      - [ ] CiaNcch contentSize
      - [ ] CiaTitleMetadata contentSize
      - [ ] header contentSize
     */
}
