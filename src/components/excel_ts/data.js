import allDataFormat from './dataFormat'

export default class {
  constructor(option) {
    this.firstRow = allDataFormat[option];
  }
  findByName(name) {
    for (let i = 0; i < this.firstRow.length; i++) {
      const e = this.firstRow[i];
      if (e.name === name) {
        return i;
      }
    }
    return -1;
  }
  getFirstRow() {
    return this.firstRow;
  }
};
