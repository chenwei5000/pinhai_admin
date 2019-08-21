import XLSX from "xlsx";
import ExcelDataClass from './data'

function getLocation(col, row, hasRow = false) {
  let location = hasRow ? '' : `${row}`;
  let allUppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  if (col < 26) {
    return allUppers[col] + location;
  } else {
    return 'A' + allUppers[col - 26] + location;
  }
}

function replaceAll(str, oldpart, newpart) {
  return str.split(oldpart).join(newpart);
}

class WorkBook {
  constructor() {
    this.wb = XLSX.utils.book_new();
  }
  addFirstRow(firstRowName) {
    this.ws = XLSX.utils.aoa_to_sheet([firstRowName]);
  }
  writeCellWithValue(location, type, value) {
    this.ws[location] = {
      t: type,
      v: value
    }
  }
  writeCellWithFormulae(formulae, location) {
    this.ws[location] = {
      t: 'f',
      f: formulae,
      F: `${location}:${location}`
    }
  }
  // 更改 ref
  cahngeRef(value) {
    this.ws['!ref'] = value;
  }
  addSheet(sheetName) {
    XLSX.utils.book_append_sheet(this.wb, this.ws, sheetName);
  }
  download(filename) {
    XLSX.writeFile(this.wb, filename);
  }
};

function download(data, formatDataName, filename) {
  let excelData = new ExcelDataClass(formatDataName);
  let excel = new WorkBook()
  let firstRowName = []
  // 创建第一行
  let firstRow = excelData.getFirstRow();
  // 创建一个 sheet
  for (let i = 0; i < firstRow.length; i++) {
    // 去掉 #
    firstRowName.push(firstRow[i].name.slice(1, -1))
  }
  excel.addFirstRow(firstRowName)

  // eslint-disable-next-line no-unused-vars
  let ROW = {
    start: 1,
    end: data.length + 1
  }
  for (let i = 0; i < data.length; i++) {
    let row = i + 2;
    for (let j = 0; j < firstRow.length; j++) {
      const e = firstRow[j];
      const name = e.name
      let location = getLocation(excelData.findByName(name), row);
      if (e.type === 'n' || e.type === 's') {
        excel.writeCellWithValue(location, e.type, data[i][e.name.slice(1, -1)]);
      } else {
        // 匹配列名
        let formulae = e.formulae
        // console.log('e', e)
        e.relation.forEach(source => {
          let col = excelData.findByName(source);
          let replaceStr = getLocation(col, row, e.hasRow);
          formulae = replaceAll(formulae, source, replaceStr);
        })
        if (e.hasRow) {
          // 匹配行号
          let regexp = /#.*?#/g;
          let allMatch = [...formulae.matchAll(regexp)];
          allMatch.forEach(content => {
            let rawContent = content[0]
            // console.log('rawContent ', rawContent)
            let evalContent = rawContent.slice(1, -1)
            // eslint-disable-next-line no-eval
            let value = eval(evalContent);
            formulae = replaceAll(formulae, rawContent, `${value}`)
          })
        }

        excel.writeCellWithFormulae(formulae, location);
      }
    }
  }

  // 更改 !ref
  excel.cahngeRef(`A1:${getLocation(firstRow.length - 1, data.length + 1)}`);
  excel.addSheet('Sheet1')
  return excel.download(filename)
}

export default {
  download
}
