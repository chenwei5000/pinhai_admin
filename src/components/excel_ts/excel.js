import XLSX from "xlsx";
import ExcelDataClass from './data'

let excelData = new ExcelDataClass();

function getLocation(col, row) {
  let location = `${row}`;
  let allUppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  if (col < 26) {
    return allUppers[col] + location;
  } else {
    return 'A' + allUppers[col - 26] + location;
  }
}

function download(data, name) {
  let firstRowName = []
  let wb = XLSX.utils.book_new();
  // 创建第一行
  let firstRow = excelData.getFirstRow();
  // 创建一个 sheet
  for (let i = 0; i < firstRow.length; i++) {
    // 去掉 #
    firstRowName.push(firstRow[i].name.slice(1, -1))
  }
  let ws = XLSX.utils.aoa_to_sheet([firstRowName]);

  for (let i = 0; i < data.length; i++) {
    let row = i + 2;
    for (let j = 0; j < firstRow.length; j++) {
      const e = firstRow[j];
      const name = e.name
      let location = getLocation(excelData.findByName(name), row);
      if (e.type === 'n') {
        ws[location] = {
          t: 'n',
          v: data[i][e.name.slice(1, -1)]
        }
      } else if (e.type === 's') {
        ws[location] = {
          t: 's',
          v: data[i][e.name.slice(1, -1)]
        }
      } else {
        // 公式
        let formulae = e.formulae;
        // 替换字符串
        e.relation.forEach(source => {
          let col = excelData.findByName(source);
          let replaceStr = getLocation(col, row);
          formulae = formulae.split(source).join(replaceStr);
        })
        ws[location] = {
          t: 'f',
          f: formulae,
          F: `${location}:${location}`
        }
      }
    }
  }
  // 更改 !ref
  ws['!ref'] = `A1:${getLocation(firstRow.length - 1, data.length + 1)}`;
  console.log('ws', ws)
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  return XLSX.writeFile(wb, `${name}.xlsx`);
}

export default {
  download
}
