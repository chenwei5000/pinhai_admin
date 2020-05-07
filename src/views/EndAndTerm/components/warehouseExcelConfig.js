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
    'title': '货币',
    'merge': {
      s: {//s为开始
        c: 3,//开始列
        r: 0//可以看成开始行,实际是取值范围
      },
      e: {//e结束
        c: 3,//结束列
        r: 1//结束行
      }
    }
  },
  {
    'title': '期初',
    'merge': {
      s: {//s为开始
        c: 4,//开始列
        r: 0//可以看成开始行,实际是取值范围
      },
      e: {//e结束
        c: 8,//结束列
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
        c: 9,//开始列
        r: 0//可以看成开始行,实际是取值范围
      },
      e: {//e结束
        c: 13,//结束列
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
        c: 14,//开始列
        r: 0//可以看成开始行,实际是取值范围
      },
      e: {//e结束
        c: 18,//结束列
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
        c: 19,//开始列
        r: 0//可以看成开始行,实际是取值范围
      },
      e: {//e结束
        c: 23,//结束列
        r: 0//结束行
      }
    }
  },
  {'title': '', 'merge': null},
  {'title': '', 'merge': null},
  {'title': '', 'merge': null},
  {'title': '', 'merge': null},
  {
    'title': '出口',
    'merge': {
      s: {//s为开始
        c: 24,//开始列
        r: 0//可以看成开始行,实际是取值范围
      },
      e: {//e结束
        c: 28,//结束列
        r: 0//结束行
      }
    }
  },
  {'title': '', 'merge': null},
  {'title': '', 'merge': null},
  {'title': '', 'merge': null},
  {'title': '', 'merge': null},
  {
    'title': '库龄30天',
    'merge': {
      s: {//s为开始
        c: 29,//开始列
        r: 0//可以看成开始行,实际是取值范围
      },
      e: {//e结束
        c: 30,//结束列
        r: 0//结束行
      }
    }
  },
  {'title': '', 'merge': null},
  {
    'title': '库龄31-90天',
    'merge': {
      s: {//s为开始
        c: 31,//开始列
        r: 0//可以看成开始行,实际是取值范围
      },
      e: {//e结束
        c: 32,//结束列
        r: 0//结束行
      }
    }
  },
  {'title': '', 'merge': null},
  {
    'title': '库龄91天以上',
    'merge': {
      s: {//s为开始
        c: 33,//开始列
        r: 0//可以看成开始行,实际是取值范围
      },
      e: {//e结束
        c: 34,//结束列
        r: 0//结束行
      }
    }
  },
  {'title': '', 'merge': null},
]

let excelField = [
  {'attrName': 'skuCode', 'type': 's', 'name': '#SKU编码#'},
  {'attrName': 'warehouseName', 'type': 's', 'name': '#仓库#'},
  {'attrName': 'productName', 'type': 's', 'name': '#产品名#'},
  {'attrName': 'currencyName', 'type': 's', 'name': '#货币#'},

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

  {'attrName': 'exportTotalVolume', 'type': 'n', 'name': '#体积(m³)#'},
  {'attrName': 'exportTotalCartonQty', 'type': 'n', 'name': '#箱数#'},
  {'attrName': 'exportTotalQty', 'type': 'n', 'name': '#件数#'},
  {'attrName': 'exportTotalPrice', 'type': 'n', 'name': '#单价#'},
  {'attrName': 'exportTotalAmount', 'type': 'n', 'name': '#总额#'},

  {'attrName': 'stockAgeCartonQty1', 'type': 'n', 'name': '#箱数#'},
  {'attrName': 'stockAgeQty1', 'type': 'n', 'name': '#件数#'},

  {'attrName': 'stockAgeCartonQty2', 'type': 'n', 'name': '#箱数#'},
  {'attrName': 'stockAgeQty2', 'type': 'n', 'name': '#件数#'},

  {'attrName': 'stockAgeCartonQty3', 'type': 'n', 'name': '#箱数#'},
  {'attrName': 'stockAgeQty3', 'type': 'n', 'name': '#件数#'},
]

export default {
  excelField: excelField,
  excelMerges: excelMerges
}
