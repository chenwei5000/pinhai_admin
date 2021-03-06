/* eslint-disable */
import XLSX from 'xlsx'
import global from '@/api/global'
import moment from 'moment';

require('script-loader!file-saver');

function generateArray(table) {
  var out = [];
  var rows = table.querySelectorAll('tr');
  var ranges = [];
  for (var R = 0; R < rows.length; ++R) {
    var outRow = [];
    var row = rows[R];
    var columns = row.querySelectorAll('td');
    for (var C = 0; C < columns.length; ++C) {
      var cell = columns[C];
      var colspan = cell.getAttribute('colspan');
      var rowspan = cell.getAttribute('rowspan');
      var cellValue = cell.innerText;
      if (cellValue !== "" && cellValue == +cellValue) cellValue = +cellValue;

      //Skip ranges
      ranges.forEach(function (range) {
        if (R >= range.s.r && R <= range.e.r && outRow.length >= range.s.c && outRow.length <= range.e.c) {
          for (var i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(null);
        }
      });

      //Handle Row Span
      if (rowspan || colspan) {
        rowspan = rowspan || 1;
        colspan = colspan || 1;
        ranges.push({
          s: {
            r: R,
            c: outRow.length
          },
          e: {
            r: R + rowspan - 1,
            c: outRow.length + colspan - 1
          }
        });
      }
      ;

      //Handle Value
      outRow.push(cellValue !== "" ? cellValue : null);

      //Handle Colspan
      if (colspan)
        for (var k = 0; k < colspan - 1; ++k) outRow.push(null);
    }
    out.push(outRow);
  }
  return [out, ranges];
};

function datenum(v, date1904) {
  if (date1904) v += 1462;
  var epoch = Date.parse(v);
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, opts) {
  var ws = {};
  var range = {
    s: {
      c: 10000000,
      r: 10000000
    },
    e: {
      c: 0,
      r: 0
    }
  };

  for (var R = 0; R != data.length; ++R) {
    for (var C = 0; C != data[R].length; ++C) {
      if (range.s.r > R) range.s.r = R;
      if (range.s.c > C) range.s.c = C;
      if (range.e.r < R) range.e.r = R;
      if (range.e.c < C) range.e.c = C;
      var cell = {
        v: data[R][C]
      };
      if (cell.v == null) continue;
      var cell_ref = XLSX.utils.encode_cell({
        c: C,
        r: R
      });

      if (typeof cell.v === 'number') {
        if (cell.v >= 1000000000000) {
          cell.t = 's';
          cell.v = moment(cell.v).format("YYYY-MM-DD HH:mm")
        }
        else {
          cell.t = 'n';
        }
      }
      else if (typeof cell.v === 'boolean') {
        cell.t = 'b';
      }
      else if (cell.v instanceof Date) {
        cell.t = 'n';
        cell.z = XLSX.SSF._table[14];
        cell.v = datenum(cell.v);
      } else cell.t = 's';


      ws[cell_ref] = cell;
    }
  }
  if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
  return ws;
}

function Workbook() {
  if (!(this instanceof Workbook)) return new Workbook();
  this.SheetNames = [];
  this.Sheets = {};
}

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}

export function export_table_to_excel(id) {
  var theTable = document.getElementById(id);
  var oo = generateArray(theTable);
  var ranges = oo[1];

  /* original data */
  var data = oo[0];
  var ws_name = "SheetJS";

  var wb = new Workbook(),
    ws = sheet_from_array_of_arrays(data);

  /* add ranges to worksheet */
  // ws['!cols'] = ['apple', 'banan'];
  ws['!merges'] = ranges;

  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;

  var wbout = XLSX.write(wb, {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary'
  });

  saveAs(new Blob([s2ab(wbout)], {
    type: "application/octet-stream"
  }), "test.xlsx")
}

export function export_json_to_excel({
                                       multiHeader = [],
                                       header,
                                       data,
                                       filename,
                                       merges = [],
                                       autoWidth = true,
                                       bookType = 'xlsx'
                                     } = {}) {
  /* original data */
  filename = filename || 'excel-list'
  data = [...data]
  data.unshift(header);

  for (let i = multiHeader.length - 1; i > -1; i--) {
    data.unshift(multiHeader[i])
  }

  var ws_name = "SheetJS";
  var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);

  if (merges.length > 0) {
    if (!ws['!merges']) ws['!merges'] = [];
    merges.forEach(item => {
      ws['!merges'].push(XLSX.utils.decode_range(item))
    })
  }

  if (autoWidth) {
    /*设置worksheet每列的最大宽度*/
    const colWidth = data.map(row => row.map(val => {
      /*先判断是否为null/undefined*/
      if (val == null) {
        return {
          'wch': 10
        };
      }
      /*再判断是否为中文*/
      else if (val.toString().charCodeAt(0) > 255) {
        return {
          'wch': val.toString().length * 2
        };
      } else {
        return {
          'wch': val.toString().length
        };
      }
    }))
    /*以第一行为初始值*/
    let result = colWidth[0];
    for (let i = 1; i < colWidth.length; i++) {
      for (let j = 0; j < colWidth[i].length; j++) {
        if (result[j]['wch'] < colWidth[i][j]['wch']) {
          result[j]['wch'] = colWidth[i][j]['wch'];
        }
      }
    }
    ws['!cols'] = result;
  }

  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;

  var wbout = XLSX.write(wb, {
    bookType: bookType,
    bookSST: false,
    type: 'binary'
  });

  saveAs(new Blob([s2ab(wbout)], {
    type: "application/octet-stream"
  }), `${filename}.${bookType}`);
}

//TODO: add By Tankai
export function export_el_table_to_excel({
                                           table, //表格对象
                                           downloadUrl, //下载链接
                                           filename, //导出文件名
                                           noExportProps = [], //不需要导出的字段
                                           tpl = false, //是否是模版
                                           params,
                                         } = {}) {

  // 导出头部标题
  let tHeader = [];
  // 需要哪些属性导出
  let props = [];
  // 导出数据内容
  let data = [];

  // 解析表格列
  let columns = (table && table.columns) ? table.columns : [];
  columns.forEach(obj => {
    if (!obj.label || !obj.property) {
      return;
    }
    if (noExportProps.indexOf(obj.label) > -1) { //去掉不需要导出的属性
      return;
    }
    tHeader.push(obj.label);
    props.push(obj.property);
  });

  if (tpl) {
    export_json_to_excel({
      header: tHeader,
      data,
      filename: filename,
      autoWidth: true,
      bookType: 'xlsx'
    })
  } else {
    //获取数据
    global.axios
      .get(downloadUrl + (params ? params : ''))
      .then(resp => {
        let res = resp.data
        data = res || []
        data = data.map(v => props.map(j => {
          let _val;
          if (j.indexOf(".") > -1) {
            let tmp = j.split(".");
            let _obj = v;

            tmp.forEach(obj => {
              if (_obj[obj] != null) {
                _obj = _obj[obj];
              } else {
                _obj = '';
              }
            });

            _val = _obj;
          } else {
            _val = v[j];
          }
          return _val;
        }));

        export_json_to_excel({
          header: tHeader,
          data,
          filename: filename,
          autoWidth: true,
          bookType: 'xlsx'
        })
      })
      .catch(err => {

      });
  }
}


//TODO: add By Tankai
export function export_json_url_to_excel_with_formulae({
                                                         url,  //下载链接
                                                         excelField = [], //字段配置
                                                         filename, //导出文件名
                                                         tpl = false, //是否是模版
                                                       } = {}) {

  var ws_name = "SheetJS";
  var wb = new Workbook();
  excelField = excelField || [];
  filename = filename || 'excel-list';

  // 写入标题
  let header = [];

  excelField.forEach(r => {
    // 去掉头尾 #
    header.push(r.name.slice(1, -1));
  });
  wb.addFirstRow(header);

  //let excelData = new ExcelDataClass(formatDataName);
  //let excel = new WorkBook()
  // 后天加载数据

  if (tpl) {
    let data = [];
    export_json_to_excel({
      header: header,
      data,
      filename: filename,
      autoWidth: true,
      bookType: 'xlsx'
    })
    return false;

  } else {
    let excelData = [];
    global.axios.get(url)
      .then(resp => {
        let res = resp.data
        excelData = res || []
        excelData = excelData.map(v => excelField.map(j => {
          let _val;
          if (j.indexOf(".") > -1) {
            let tmp = j.split(".");
            let _obj = v;

            tmp.forEach(obj => {
              if (_obj[obj] != null) {
                _obj = _obj[obj];
              } else {
                _obj = '';
              }
            });

            _val = _obj;
          } else {
            _val = v[j];
          }
          return _val;
        }));
      })
      .catch(err => {

      });
  }
}



