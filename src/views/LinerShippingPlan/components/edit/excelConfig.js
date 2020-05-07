let excelField = [
  {'attrName': 'skuCode', 'type': 's', 'name': '#SKU#'},
  {'attrName': 'product.category.name', 'type': 's', 'name': '#分类#'},
  {'attrName': 'product.groupName', 'type': 's', 'name': '#款式#'},
  {'attrName': 'product.name', 'type': 's', 'name': '#名称#'},
  {'attrName': 'product.asin', 'type': 's', 'name': '#ASIN#'},
  {'attrName': 'product.fnSku', 'type': 's', 'name': '#FNSKU#'},
  {'attrName': 'product.model', 'type': 's', 'name': '#型号#'},
  {'attrName': 'product.color', 'type': 's', 'name': '#颜色#'},
  {'attrName': 'cartonSpecCode', 'type': 's', 'name': '#箱规#'},
  {'attrName': 'numberOfCarton', 'type': 'n', 'name': '#装箱数#'},
  {'attrName': 'product.grossWeight', 'type': 'n', 'name': '#产品重量(Kg)#'},
  {'attrName': 'cartonSpec.grossWeight', 'type': 'n', 'name': '#箱子重量(Kg)#'},
  {'attrName': 'cartonSpecSize', 'type': 's', 'name': '#箱子尺寸#'},
  {'attrName': 'cartonSpecVolume', 'type': 'n', 'name': '#箱子体积(m³)#'},
  {'attrName': 'nwoneCartonSpecWeight', 'type': 'n', 'name': '#单箱净重(Kg)#'},
  {'attrName': 'gwoneCartonSpecWeight', 'type': 'n', 'name': '#单箱毛重(Kg)#'},
  {'attrName': 'qty', 'type': 'n', 'name': '#应发件数#'},
  {'attrName': 'cartonQty', 'type': 'n', 'name': '#应发箱数#'},
  {'attrName': 'sumProductWeight', 'type': 'n', 'name': '#应发净重(Kg)#'},
  {'attrName': 'sumCartonSpecWeight', 'type': 'n', 'name': '#应发毛重(Kg)#'},
  {'attrName': 'sumCartonVolume', 'type': 'n', 'name': '#应发体积(m³)#'},
]

export default {
  excelField: excelField
}
