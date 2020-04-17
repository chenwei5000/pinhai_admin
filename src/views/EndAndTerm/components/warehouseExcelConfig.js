let excelMerges = [
  {
    'title': 'SKU编码',
    'merge': {
      s: {//s为开始
        c: 0,//开始列
        r: 0//可以看成开始行,实际是取值范围
      },
      e: {//e结束
        c: 0,//结束列
        r: 1//结束行
      }
    }
  },
  {
    'title': '仓库',
    'merge': {
      s: {//s为开始
        c: 1,//开始列
        r: 0//可以看成开始行,实际是取值范围
      },
      e: {//e结束
        c: 1,//结束列
        r: 1//结束行
      }
    }
  },
  {
    'title': '产品名',
    'merge': {
      s: {//s为开始
        c: 2,//开始列
        r: 0//可以看成开始行,实际是取值范围
      },
      e: {//e结束
        c: 2,//结束列
        r: 1//结束行
      }
    }
  },
  {
    'title': '期初',
    'merge': {
      s: {//s为开始
        c: 3,//开始列
        r: 0//可以看成开始行,实际是取值范围
      },
      e: {//e结束
        c: 7,//结束列
        r: 0//结束行
      }
    }
  },
  {'title': '', 'merge': null},
  {'title': '', 'merge': null},
  {'title': '', 'merge': null},
  {'title': '', 'merge': null},
  {
    'title': '入库',
    'merge': {
      s: {//s为开始
        c: 8,//开始列
        r: 0//可以看成开始行,实际是取值范围
      },
      e: {//e结束
        c: 12,//结束列
        r: 0//结束行
      }
    }
  },
  {'title': '', 'merge': null},
  {'title': '', 'merge': null},
  {'title': '', 'merge': null},
  {'title': '', 'merge': null},
  {
    'title': '出库',
    'merge': {
      s: {//s为开始
        c: 13,//开始列
        r: 0//可以看成开始行,实际是取值范围
      },
      e: {//e结束
        c: 17,//结束列
        r: 0//结束行
      }
    }
  },
  {'title': '', 'merge': null},
  {'title': '', 'merge': null},
  {'title': '', 'merge': null},
  {'title': '', 'merge': null},
  {
    'title': '期末',
    'merge': {
      s: {//s为开始
        c: 18,//开始列
        r: 0//可以看成开始行,实际是取值范围
      },
      e: {//e结束
        c: 22,//结束列
        r: 0//结束行
      }
    }
  },
]

let excelField = [
  {'attrName': 'skuCode', 'type': 's', 'name': '#SKU编码#'},
  {'attrName': 'warehouseName', 'type': 's', 'name': '#仓库#'},
  {'attrName': 'productName', 'type': 's', 'name': '#产品名#'},

  {'attrName': 'initialStageVolume', 'type': 'n', 'name': '#体积(m³)#'},
  {'attrName': 'initialStageCartonQty', 'type': 'n', 'name': '#箱数#'},
  {'attrName': 'initialStageQty', 'type': 'n', 'name': '#件数#'},
  {'attrName': 'initialStagePrice', 'type': 'n', 'name': '#单价#'},
  {'attrName': 'initialStageAmount', 'type': 'n', 'name': '#总额#'},

  {'attrName': 'inTotalVolume', 'type': 'n', 'name': '#体积(m³)#'},
  {'attrName': 'inTotalCartonQty', 'type': 'n', 'name': '#箱数#'},
  {'attrName': 'inTotalQty', 'type': 'n', 'name': '#件数#'},
  {'attrName': 'inTotalPrice', 'type': 'n', 'name': '#单价#'},
  {'attrName': 'inTotalAmount', 'type': 'n', 'name': '#总额#'},

  {'attrName': 'outTotalVolume', 'type': 'n', 'name': '#体积(m³)#'},
  {'attrName': 'outTotalCartonQty', 'type': 'n', 'name': '#箱数#'},
  {'attrName': 'outTotalQty', 'type': 'n', 'name': '#件数#'},
  {'attrName': 'outTotalPrice', 'type': 'n', 'name': '#单价#'},
  {'attrName': 'outTotalAmount', 'type': 'n', 'name': '#总额#'},

  {'attrName': 'endStageVolume', 'type': 'n', 'name': '#体积(m³)#'},
  {'attrName': 'endStageCartonQty', 'type': 'n', 'name': '#箱数#'},
  {'attrName': 'endStageQty', 'type': 'n', 'name': '#件数#'},
  {'attrName': 'endStagePrice', 'type': 'n', 'name': '#单价#'},
  {'attrName': 'endStageAmount', 'type': 'n', 'name': '#总额#'},
]

export default {
  excelField: excelField,
  excelMerges: excelMerges
}
