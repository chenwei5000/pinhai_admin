<template>
  <button class="btn btn-success" @click="download">Export</button>
</template>

<script>
import excel from "./excel";

let data = [
  {
    'SKU编码': "a",
    '产品名': "a",
    '分类': "a",
    'Vip级别': "a",
    '箱规': "a",
    '装箱数': 74,
    '托盘装箱数': 5,
    "7日销量(件)": 55,
    '运输周数': 62,
    '销售周数': 74,
    '覆盖周数': 2,
    "需求总量(箱)": 27,
    "有效库存(件)": 60,
    "国内库存(箱)": 63,
    '应发箱数': 36,
    "单箱体积(m³)": 84
  },
  {
    'SKU编码': "b",
    '产品名': "b",
    '分类': "b",
    'Vip级别': "b",
    '箱规': "b",
    '装箱数': 93,
    '托盘装箱数': 88,
    "7日销量(件)": 99,
    '运输周数': 20,
    '销售周数': 34,
    '覆盖周数': 87,
    "需求总量(箱)": 82,
    "有效库存(件)": 13,
    "国内库存(箱)": 42,
    '应发箱数': 74,
    "单箱体积(m³)": 22
  }
];

export default {
  methods: {
    download() {
      return excel.download(data, 'final')
    }
  }
};
</script>

<style>
</style>
