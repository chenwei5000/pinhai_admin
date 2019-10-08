let excelField = [
  {'attrName': 'product.skuCode', 'type': 's', 'name': '#SKU编码#'},
  {'attrName': 'product.name', 'type': 's', 'name': '#产品名#'},
  {'attrName': 'product.category.name', 'type': 's', 'name': '#分类#'},
  {'attrName': 'product.vipLevel', 'type': 'n', 'name': '#Vip级别#'},
  {'attrName': 'cartonSpecCode', 'type': 's', 'name': '#箱规#'},
  {'attrName': 'numberOfCarton', 'type': 'n', 'name': '#装箱数#'},
  {'attrName': 'sevenSalesCount', 'type': 'n', 'name': '#7日销量(件)#'},
  {'attrName': 'safetyStockWeek', 'type': 'n', 'name': '#备货周数#'},
  {'attrName': 'demandedCartonQty', 'type': 'n', 'name': '#需求总量(箱)#'},
  {'attrName': 'amazonTotalStock', 'type': 'n', 'name': '#在途加亚马逊库存(件)#'},
  {'attrName': 'domesticStockCartonQty', 'type': 'n', 'name': '#国内库存(箱)#'},
  {'attrName': 'unfinishedPlanQty', 'type': 'n', 'name': '#国内在途(箱)#'},
  {'attrName': 'cartonQty', 'type': 'n', 'name': '#采购箱数#'},
  {
    'attrName': '', 'type': 'f', 'name': '#采购件数-公式#',
    'formulae': '#采购箱数#*#装箱数#'
  },
  {
    'attrName': '',
    'type': 'f',
    'name': '#可售周数-公式#',
    'formulae': 'IF(#7日销量(件)#>0,ROUND(((#采购箱数#+#国内库存(箱)#+#国内在途(箱)#)*#装箱数#+#在途加亚马逊库存(件)#)/#7日销量(件)#,1),0)'
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
