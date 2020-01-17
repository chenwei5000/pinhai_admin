let excelField = [
  {'attrName': 'procurementOrder.supplier.name', 'type': 's', 'name': '#供货商#'},
  {'attrName': 'procurementOrder.code', 'type': 's', 'name': '#采购单编号#'},
  {'attrName': 'procurementOrder.name', 'type': 's', 'name': '#采购单名称#'},
  {'attrName': 'product.skuCode', 'type': 's', 'name': '#SKU编码#'},
  {'attrName': 'product.name', 'type': 's', 'name': '#产品名#'},
  {'attrName': 'product.cartonSpecCode', 'type': 's', 'name': '#箱规#'},
  {'attrName': 'numberOfCarton', 'type': 'n', 'name': '#装箱数#'},
  {'attrName': 'cartonQty', 'type': 'n', 'name': '#采购箱数#'},
  {'attrName': 'orderCartonQty', 'type': 'n', 'name': '#已确认箱数#'},
  {'attrName': 'deliveryTime', 'type': 's', 'name': '#交货日期#'},
  {
    'attrName': 'deliveryCartonQty', 'type': 'f', 'name': '#计划交货箱数#',
    'formulae': '#采购箱数#-#已确认箱数#'
  },
  {'attrName': 'remark', 'type': 's', 'name': '#备注#'},
]

export default {
  excelField: excelField
}
