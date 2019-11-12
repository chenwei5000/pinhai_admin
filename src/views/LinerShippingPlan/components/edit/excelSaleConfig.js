
let excelField = [
  {'attrName': 'skuCode', 'type': 's', 'name': '#SKU#'},
  {'attrName': 'product.category.name', 'type': 's', 'name': '#分类#'},
  {'attrName': 'product.groupName', 'type': 's', 'name': '#款式#'},
  {'attrName': 'product.name', 'type': 's', 'name': '#名称#'},
  {'attrName': 'product.asin', 'type': 's', 'name': '#ASIN#'},
  {'attrName': 'product.fnSku', 'type': 's', 'name': '#FNSKU#'},
  {'attrName': 'product.vipLevel', 'type': 's', 'name': '#Vip级别#'},
  {'attrName': 'cartonSpecCode', 'type': 's', 'name': '#箱规#'},
  {'attrName': 'numberOfCarton', 'type': 'n', 'name': '#装箱数#'},
  {'attrName': 'sevenSalesCount', 'type': 'n', 'name': '#7日销量(件)#'},
  {'attrName': 'logisticsWeek', 'type': 'n', 'name': '#运输周数#'},
  {'attrName': 'safetyWeek', 'type': 'n', 'name': '#销售周数#'},
  {'attrName': 'coverageWeek', 'type': 'n', 'name': '#覆盖周数#'},
  {'attrName': 'soldOutTime', 'type': 'd', 'name': '#销售截止日#'},
  // {'attrName': '', 'type': 'n', 'name': '#需求总量(箱)#'},
  {
    'attrName': 'demandedCartonQty',
    'type': 'f',
    'name': '#需求总量(箱)#',
    'relation': ['#7日销量(件)#', '#销售周数#', '#装箱数#'],
    'formulae': 'ROUNDUP(#7日销量(件)#*#销售周数#/#装箱数#,0)'
  },

  {'attrName': 'validateStockQty', 'type': 'n', 'name': '#有效库存(件)#'},
  {'attrName': 'domesticStockCartonQty', 'type': 'n', 'name': '#国内库存(箱)#'},
  {'attrName': 'cartonQty', 'type': 'n', 'name': '#应发箱数#'},
  {'attrName': 'cartonSpecVolume', 'type': 'n', 'name': '#单箱体积(m³)#'},
  {
    'attrName': 'sumCartonVolume',
    'type': 'f',
    'name': '#应发体积(m³)#',
    'relation': ['#应发箱数#', '#单箱体积(m³)#'],
    'formulae': 'ROUNDUP(#单箱体积(m³)#*#应发箱数#,2)'
  },
  {
    'attrName': 'sendNumFor',
    'type': 'f',
    'name': '#应补箱数#',
    'relation': ['#装箱数#', '#7日销量(件)#', '#销售周数#', '#有效库存(件)#'],
    'formulae': 'CEILING((#7日销量(件)#*#销售周数#-#有效库存(件)#)/#装箱数#,1)'
  },
  // {
  //   'attrName': 'tuoFor',
  //   'type': 'f',
  //   'name': '#应发托数-公式#',
  //   'relation': ['#托盘装箱数#', '#应发箱数#'],
  //   'formulae': 'ROUND(#应发箱数#/#托盘装箱数#,3)'
  // },
  {
    'attrName': 'minF',
    'type': 'f',
    'name': '#缺口/库存取小值箱数#',
    'relation': ['#国内库存(箱)#', '#应补箱数#'],
    'formulae': 'MIN(#国内库存(箱)#,#应补箱数#)'
  },
  {
    'attrName': '',
    'type': 'f',
    'name': '#剩余库存(箱)#',
    'relation': ['#国内库存(箱)#', '#应发箱数#'],
    'formulae': '#国内库存(箱)#-#应发箱数#'
  },
  {
    'attrName': '',
    'type': 'f',
    'name': '#超发(箱)#',
    'relation': ['#国内库存(箱)#', '#应发箱数#'],
    'formulae': 'IF(#应发箱数#>#国内库存(箱)#,#应发箱数#-#国内库存(箱)#,"")'
  },
  {
    'attrName': '',
    'type': 'f',
    'name': '#有效库存可售周数#',
    'relation': ['#7日销量(件)#', '#有效库存(件)#'],
    'formulae': 'IF(#7日销量(件)#>0,ROUND(#有效库存(件)#/#7日销量(件)#,1),0)'
  },
  {
    'attrName': '',
    'type': 'f',
    'name': '#最终覆盖周数#',
    'relation': ['#装箱数#', '#7日销量(件)#', '#运输周数#', '#有效库存(件)#', '#应发箱数#'],
    'formulae': 'IF(#7日销量(件)#>0,ROUND((#应发箱数#*#装箱数#+#有效库存(件)#)/#7日销量(件)#,1)+#运输周数#,0)'
  },
  {
    'attrName': '',
    'type': 'f',
    'name': '#最终覆盖周数超过预期2周#',
    'relation': ['#覆盖周数#', '#最终覆盖周数#'],
    'formulae': 'IF((#最终覆盖周数#)>VALUE(#覆盖周数#),#最终覆盖周数#-VALUE(#覆盖周数#),"")'
  },
  // {
  //   'attrName': '',
  //   'type': 'f',
  //   'hasRow': true,
  //   'name': '#同一箱规总箱数#',
  //   'relation': ['#箱规#', '#应发箱数#'],
  //   'formulae': 'SUMIF(#箱规##ROW.start+1#:#箱规##ROW.end#,"Rug_Big",#应发箱数##ROW.start+1#:#应发箱数##ROW.end#)'
  // },
  // {
  //   'attrName': '',
  //   'type': 'f',
  //   'name': '#同一箱规总托数#',
  //   'relation': ['#托盘装箱数#', '#同一箱规总箱数#'],
  //   'formulae': 'ROUND(#同一箱规总箱数#/#托盘装箱数#,2)'
  // },
  // {
  //   'attrName': '',
  //   'type': 'f',
  //   'name': '#整托缺少箱数#',
  //   'relation': ['#SKU编码#', '#托盘装箱数#', '#同一箱规总箱数#'],
  //   'formulae': 'IF(ISNUMBER(#SKU编码#),IF(MOD(#SKU编码#,1)=0,0,(FLOOR(#SKU编码#,1)+1)*#托盘装箱数#-#同一箱规总箱数#),0)'
  // },
  // {
  //   'attrName': '',
  //   'type': 'f',
  //   'hasRow': true,
  //   'name': '#总托数#',
  //   'relation': ['#SKU编码#'],
  //   'formulae': 'SUM(#SKU编码##ROW.start+1#:#SKU编码##ROW.end#)'
  // },
  // {
  //   'attrName': '',
  //   'type': 'f',
  //   'hasRow': true,
  //   'name': '#总体积(m³)#',
  //   'relation': ['#应发体积(m³)-公式#'],
  //   'formulae': 'SUM(#应发体积(m³)-公式##ROW.start+1#:#应发体积(m³)-公式##ROW.end#)'
  // }
]

export default {
  excelField: excelField
}
