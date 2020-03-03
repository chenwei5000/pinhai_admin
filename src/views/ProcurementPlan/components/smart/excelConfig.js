let excelField = [
  {'attrName': 'skuCode', 'type': 's', 'name': '#SKU编码#'},
  {'attrName': 'productName', 'type': 's', 'name': '#产品名#'},
  {'attrName': 'categoryName', 'type': 's', 'name': '#分类#'},
  {'attrName': 'groupName', 'type': 's', 'name': '#款式#'},
  {'attrName': 'vipLevel', 'type': 'n', 'name': '#Vip级别#'},
  {'attrName': 'fnSku', 'type': 's', 'name': '#FNSKU#'},
  {'attrName': 'cartonSpecCode', 'type': 's', 'name': '#箱规#'},
  {'attrName': 'numberOfCarton', 'type': 'n', 'name': '#装箱数#'},
  {'attrName': 'sevenAmendQty', 'type': 'n', 'name': '#7日销量(件)#'},
  {'attrName': 'safetyWeek', 'type': 'n', 'name': '#备货周数#'},
  {'attrName': 'demandedCartonQty', 'type': 'n', 'name': '#需求总量(箱)#'},
  {'attrName': 'totalQty', 'type': 'n', 'name': '#亚马逊总库存(件)#'},
  {'attrName': 'passageQty', 'type': 'n', 'name': '#亚马逊在途库存(件)#'},
  {'attrName': 'domesticStockCartonQty', 'type': 'n', 'name': '#国内库存(箱)#'},
  {'attrName': 'unfinishedPlanCartonQty', 'type': 'n', 'name': '#未完成采购计划数(箱)#'},
  {'attrName': 'replenishmentCartonPlanQty', 'type': 'n', 'name': '#采购箱数#'},
  {
    'attrName': '', 'type': 'f', 'name': '#采购件数-公式#',
    'formulae': '#采购箱数#*#装箱数#'
  },
  {
    'attrName': '',
    'type': 'f',
    'name': '#可售周数-公式#',
    'formulae': 'IF(#7日销量(件)#>0,ROUND(((#采购箱数#+#国内库存(箱)#+#未完成采购计划数(箱)#)*#装箱数#+#亚马逊总库存(件)#)/#7日销量(件)#,1),0)'
  },
  {
    'attrName': '',
    'type': 'f',
    'name': '#可售周数超过预期2周-公式#',
    'formulae': 'IF((#可售周数-公式#-2)>VALUE(#备货周数#),#可售周数-公式#-VALUE(#备货周数#),"")'
  }
]

export default {
  excelField: excelField
}
