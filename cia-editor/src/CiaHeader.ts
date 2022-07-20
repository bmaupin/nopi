// https://www.3dbrew.org/wiki/CIA#CIA_Header
export class CiaHeader {
  dataView: DataView;

  constructor(arrayBuffer: ArrayBuffer) {
    // Only create the dataview for the size of the header; at the very least it will
    // prevent us from accidentally writing other parts of the file, but maybe it will
    // also be more memory efficient as well
    this.dataView = new DataView(arrayBuffer, 0, 0x2020);
  }

  // 0x0
  get size() {
    return this.dataView.getUint32(0, true);
  }

  // 0x18
  get contentSize() {
    return this.dataView.getBigUint64(0x18, true);
  }

  // TODO: set content size everywhere at once (header, TMD, NCCH)
  /*   Idea for doing this:
       - Add setters everywhere as needed, but hide the header/TMD/NCCH getters and
         setters from the documentation (e.g. https://typedoc.org/tags/hidden/)
       - Then add a setter at the File level that sets them all and a getter that just gets
         one of them?
       - We could potientially do something similar for things that we won't be setting
         directly (e.g. hashes); have getters and setters for them that are only used
         internally and/or by tests. Whenever a value is changed that affects the hashes,
         have the setter for that value recalculate the hashes and set them using the
         hash's setter.
   */
  // set contentSize(newContentSize: bigint) {
  //   this.dataView.setBigUint64(0x18, newContentSize, true);
  // }
}
