import XLSX from "xlsx";
import global from '@/api/global'

require('script-loader!file-saver');

function getLocation(col, row) {
  var cell_ref = XLSX.utils.encode_cell({
    r: row,
    c: col
  })
  return cell_ref;
}

function findByName(name, excelField) {
  for (let i = 0; i < excelField.length; i++) {
    const e = excelField[i];
    if (e.name === name) {
      return i;
    }
  }
  return -1;
}

function relation(content) {
  return content.match(/#(.*?)#/g);
}

function replaceAll(str, oldpart, newpart) {

  return str.split(oldpart).join(newpart);
}

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}

class WorkBook {
  constructor() {
    this.wb = XLSX.utils.book_new();
  }

  addHeaderRow(headerRowName) {
    this.ws = XLSX.utils.aoa_to_sheet([headerRowName]);
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
      F: location
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
    //XLSX.writeFile(this.wb, `${filename}.xlsx`);
    try {
      var wbout = XLSX.write(this.wb, {
        bookType: "xlsx",
        bookSST: false,
        type: 'binary'
      });

      saveAs(new Blob([s2ab(wbout)], {
        type: "application/octet-stream"
      }), `${filename}.xlsx`);
    }
    catch (e) {
      console.log(e);
    }
  }
};

//TODO: add By Tankai
export function export_json_url_to_excel_with_formulae({
                                                         url,  //下载链接
                                                         excelField = [], //字段配置
                                                         filename //导出文件名
                                                       } = {}) {
  var ws_name = "SheetJS";
  var excel = new WorkBook();
  excelField = excelField || [];
  filename = filename || 'excel-list';

  // 写入标题
  let header = [];
  excelField.forEach(r => {
    // 去掉头尾 #
    header.push(r.name.slice(1, -1));
  });
  excel.addHeaderRow(header);

  // 后台加载数据
  global.axios.get(url).then(resp => {
    let res = resp.data
    let excelData = res || [];

    try {
      for (var row = 0; row < excelData.length; row++) {
        const rowData = excelData[row];

        for (var col = 0; col < excelField.length; col++) {
          var cell_ref = XLSX.utils.encode_cell({
            r: row + 1,
            c: col
          });
          const field = excelField[col];

          if (field.type == 'f') { // 公式特殊处理
            // 匹配列名
            let formulae = field.formulae;
            let rels = relation(formulae);
            rels.forEach(source => {
              let replaceStr = getLocation(findByName(source, excelField), row + 1);
              formulae = replaceAll(formulae, source, replaceStr);
            });

            excel.writeCellWithFormulae(formulae, cell_ref);
          }
          else { //其它内容
            // 解析值
            let value = null;
            if (field.attrName.indexOf(".") > -1) {
              // 处理多级对象
              let tmp = field.attrName.split(".");
              let _obj = rowData;

              tmp.forEach(obj => {
                if (_obj[obj]) {
                  _obj = _obj[obj];
                } else {
                  _obj = '';
                }
              });
              value = _obj;
            } else {
              value = rowData[field.attrName];
            }
            excel.writeCellWithValue(cell_ref, field.type, value);
          }
        }
      }
    }
    catch (e) {
      console.log(e);
    }

    excel.addSheet('Sheet1');
    excel.cahngeRef(`A1:${getLocation(excelField.length - 1, excelData.length + 1)}`);
    console.log(excel);
    return excel.download(filename);
  })
    .catch(err => {

    });
}


