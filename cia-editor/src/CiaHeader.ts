// https://www.3dbrew.org/wiki/CIA#CIA_Header
export class CiaHeader {
  dataView: DataView;

  constructor(arrayBuffer: ArrayBuffer) {
    // Only create the dataview for the size of the header; at the very least it will
    // prevent us from accidentally writing other parts of the file, but maybe it will
    // also be more memory efficient as well
    this.dataView = new DataView(arrayBuffer, 0, 0x2020);
  }

  get size() {
    return this.dataView.getUint32(0, true);
  }

  get contentSize() {
    return this.dataView.getBigUint64(24, true);
  }

  set contentSize(newContentSize: bigint) {
    this.dataView.setBigUint64(24, newContentSize, true);
  }
}
