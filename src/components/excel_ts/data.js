let data = [
  { 'attrName': 'skuCode', 'type': 's', 'name': '#SKU编码#' },
  { 'attrName': 'productName', 'type': 's', 'name': '#产品名#' },
  { 'attrName': 'type', 'type': 's', 'name': '#分类#' },
  { 'attrName': 'vipType', 'type': 's', 'name': '#Vip级别#' },
  { 'attrName': 'cartonSpecId', 'type': 's', 'name': '#箱规#' },
  { 'attrName': 'numberOfCarton', 'type': 'n', 'name': '#装箱数#' },
  { 'attrName': 'tuopan', 'type': 'n', 'name': '#托盘装箱数#' },
  { 'attrName': 'sevenSalesCount', 'type': 'n', 'name': '#7日销量(件)#' },
  { 'attrName': 'tranDuration', 'type': 'n', 'name': '#运输周数#' },
  { 'attrName': 'saleDuration', 'type': 'n', 'name': '#销售周数#' },
  { 'attrName': 'coverDuration', 'type': 'n', 'name': '#覆盖周数#' },
  { 'attrName': 'neddNum', 'type': 'n', 'name': '#需求总量(箱)#' },
  { 'attrName': 'realNum', 'type': 'n', 'name': '#有效库存(件)#' },
  { 'attrName': 'inventoryNum', 'type': 'n', 'name': '#国内库存(箱)#' },
  { 'attrName': 'sendNum', 'type': 'n', 'name': '#应发箱数#' },
  { 'attrName': 'volume', 'type': 'n', 'name': '#单箱体积(m³)#' },
  { 'attrName': 'sendVolume', 'type': 'f', 'name': '#应发体积(m³)-公式#', 'relation': ['#应发箱数#', '#单箱体积(m³)#'], 'formulae': '#单箱体积(m³)#*#应发箱数#' },
  { 'attrName': 'sendNumFor', 'type': 'f', 'name': '#应补箱数-公式#', 'relation': ['#装箱数#', '#7日销量(件)#', '#销售周数#', '#有效库存(件)#'], 'formulae': 'CEILING((#7日销量(件)#*#销售周数#-#有效库存(件)#)/#装箱数#,1)' },
  { 'attrName': 'tuoFor', 'type': 'f', 'name': '#应发托数-公式#', 'relation': ['#托盘装箱数#', '#应发箱数#'], 'formulae': 'ROUND(#应发箱数#/#托盘装箱数#,3)' },
  { 'attrName': 'Z', 'type': 'f', 'name': '#缺口/库存取小值箱数-公式#', 'relation': ['#国内库存(箱)#', '#应补箱数-公式#'], 'formulae': 'MIN(#国内库存(箱)#,#应补箱数-公式#)' },
  { 'attrName': '', 'type': 'f', 'name': '#剩余库存(箱)-公式#', 'relation': ['#国内库存(箱)#', '#应发箱数#'], 'formulae': '#国内库存(箱)#-#应发箱数#' },
  { 'attrName': '', 'type': 'f', 'name': '#超发(箱)-公式#', 'relation': ['#国内库存(箱)#', '#应发箱数#'], 'formulae': 'IF(#应发箱数#>#国内库存(箱)#,#应发箱数#-#国内库存(箱)#,"")' },
  { 'attrName': '', 'type': 'f', 'name': '#有效库存可售周数-公式#', 'relation': ['#7日销量(件)#', '#有效库存(件)#'], 'formulae': 'IF(#7日销量(件)#>0,ROUND(#有效库存(件)#/#7日销量(件)#,1),0)' },
  { 'attrName': '', 'type': 'f', 'name': '#最终覆盖周数-公式#', 'relation': ['#装箱数#', '#7日销量(件)#', '#运输周数#', '#有效库存(件)#', '#应发箱数#'], 'formulae': 'ROUND((#应发箱数#*#装箱数#+#有效库存(件)#)/#7日销量(件)#,1)+#运输周数#' },
  { 'attrName': '', 'type': 'f', 'name': '#最终覆盖周数超过预期2周-公式#', 'relation': ['#覆盖周数#', '#最终覆盖周数-公式#'], 'formulae': 'IF((#最终覆盖周数-公式#)>VALUE(#覆盖周数#),#最终覆盖周数-公式#-VALUE(#覆盖周数#),"")' },
  { 'attrName': '', 'type': 'f', 'hasRow': true, 'name': '#同一箱规总箱数#', 'relation': ['#箱规#', '#应发箱数#'], 'formulae': 'SUMIF(#箱规##ROW.start+1#:#箱规##ROW.end#,"Rug_Big",#应发箱数##ROW.start+1#:#应发箱数##ROW.end#)' },
  { 'attrName': '', 'type': 'f', 'name': '#同一箱规总托数#', 'relation': ['#托盘装箱数#', '#同一箱规总箱数#'], 'formulae': 'ROUND(#同一箱规总箱数#/#托盘装箱数#,2)' },
  { 'attrName': '', 'type': 'f', 'name': '#整托缺少箱数#', 'relation': ['#SKU编码#', '#托盘装箱数#', '#同一箱规总箱数#'], 'formulae': 'IF(ISNUMBER(#SKU编码#),IF(MOD(#SKU编码#,1)=0,0,(FLOOR(#SKU编码#,1)+1)*#托盘装箱数#-#同一箱规总箱数#),0)' },
  { 'attrName': '', 'type': 'f', 'hasRow': true, 'name': '#总托数#', 'relation': ['#SKU编码#'], 'formulae': 'SUM(#SKU编码##ROW.start+1#:#SKU编码##ROW.end#)' },
  { 'attrName': '', 'type': 'f', 'hasRow': true, 'name': '#总体积(m³)#', 'relation': ['#应发体积(m³)-公式#'], 'formulae': 'SUM(#应发体积(m³)-公式##ROW.start+1#:#应发体积(m³)-公式##ROW.end#)' }
]

export default class {
  constructor() {
    this.firstRow = data;
  }
  findByName(name) {
    for (let i = 0; i < this.firstRow.length; i++) {
      const e = this.firstRow[i];
      if (e.name === name) {
        return i;
      }
    }
    return -1;
  }
  getFirstRow() {
    return this.firstRow;
  }
};
