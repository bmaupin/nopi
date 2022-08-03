import { CiaCertChain } from './CiaCertChain';
import { CiaHeader } from './CiaHeader';
import { CiaNcch } from './CiaNcch';
import { CiaRomFs } from './CiaRomFs';
import { CiaTicket } from './CiaTicket';
import { CiaTitleMetadata } from './CiaTitleMetadata';
import { calculateAlignedSize } from './utils';

// https://www.3dbrew.org/wiki/CIA
export class CiaFile {
  arrayBuffer: ArrayBuffer;

  header: CiaHeader;
  certChain: CiaCertChain;
  ticket: CiaTicket;
  titleMetadata: CiaTitleMetadata;
  ncch: CiaNcch;
  romFs: CiaRomFs;

  constructor(arrayBuffer: ArrayBuffer) {
    this.arrayBuffer = arrayBuffer;
    this.header = new CiaHeader(this.arrayBuffer);

    // Each section in the CIA file is 64-byte aligned
    const certChainStartingByte = calculateAlignedSize(this.header.size, 0x40);
    this.certChain = new CiaCertChain();

    const ticketStartingByte = calculateAlignedSize(
      certChainStartingByte + this.certChain.size,
      0x40
    );
    this.ticket = new CiaTicket(this.arrayBuffer, ticketStartingByte);

    const titleMetadataStartingByte = calculateAlignedSize(
      ticketStartingByte + this.ticket.size,
      0x40
    );
    this.titleMetadata = new CiaTitleMetadata(
      this.arrayBuffer,
      titleMetadataStartingByte
    );

    const ncchStartingByte = calculateAlignedSize(
      titleMetadataStartingByte + this.titleMetadata.size,
      0x40
    );
    this.ncch = new CiaNcch(this.arrayBuffer, ncchStartingByte);

    // TODO: implement this
    // const exeFsStartingByte = ncchStartingByte + this.ncch.exeFsOffset;
    // this.exeFs = new CiaExeFs(this.arrayBuffer, exeFsStartingByte);

    const romFsStartingByte = ncchStartingByte + this.ncch.romFsOffset;
    this.romFs = new CiaRomFs(this.arrayBuffer, romFsStartingByte, this.ncch);
  }

  public static fromBlob = async (blob: Blob): Promise<CiaFile> => {
    return new CiaFile(await blob.arrayBuffer());
  };

  // The title ID occurs at different points in the CIA file; we'll consider the one in
  // the ticket to be the authoritative title ID, even though they should all be the same
  get titleId() {
    return this.ticket.titleId;
  }

  /* TODO: this feels a bit hacky
     Idea:
      - Make the ticketId/titleKey generation a separate process
        - Make sure we have tests for them
      - Have each property update the signature when it's changed?
      - Make this consistent with how other properties are changed
        - We have to update RomFS files from the RomFS object, so maybe we should update
          these properties from their containing objects and just have them upate the
          others using whatever method (e.g. Observer pattern) we use for the RomFS file
          changes
  */
  set titleId(newTitleId: Uint8Array) {
    this.ticket.titleId = newTitleId;
    this.ticket.generateNewTicketId();
    this.ticket.generateNewTitleKey();
    this.ticket.updateSignature();

    this.titleMetadata.titleId = newTitleId;
    this.titleMetadata.updateSignature();

    this.ncch.titleId = newTitleId;
    this.ncch.programId = newTitleId;
    this.ncch.updateSignature();
  }

  /* TODO: how to change file content
      - Ideas
        - Have some kind of method here, e.g. setRomFsFileContent(... fileIndex?)
          - Feels pretty hacky ...
        - Observer pattern? This might work in a lot of situations ...
          - Ex
            - If RomFS file changes, it needs to notify RomFS
            - If RomFS changes, it needs to notify NCCH
          - Implementation
            - RomFS creates new RomFS file instance
            - RomFS subscribes to RomFS file changes
              romFsFile.registerObserver(...)
            - RomFS file is updated
              - it calls its own notifyObserver method, which calls the update method of the observers?
              - the update method of the observers calls the other needed methods of other classes

  */

  /* TODO: High level idea for changing dependent properties
     - Inside a class, change everything dependent that needs to be changed in that class
       - e.g. if a property of a class changes, update that class's signature
       - e.g. if the content chunk changes, update the content chunk hash. if the info record changes, update the info record hash
     - Outside a class, change everything that needs to be changed independently in that class and other classes
  */

  /* TODO: Thoughts on Observer pattern
      - Get a working implementation first (using whatever works for now)
      - Observer pattern would be good if we ever have multiple observers for one subject
      - Observer pattern might be overkill if we only have one observer per subject
        - Also it may not meet our needs if different classes need to be updated differently;
          an "update" method may not be sufficient
          - Changes in the RomFS mean the NCCH RomFS hash needs to be changed, but the NCCH title ID doesn't need to change
          - We may choose to have changes to the ticket title ID also update the NCCH title ID, but the NCCH RomFS hash doesn't need to change
          - In this case, we would probably just want to pass in the object so other objects can call whatever methods they need to call
      - Otherwise, we could probably just pass in methods or objects that need to be called and call them directly when needed
  */
}
