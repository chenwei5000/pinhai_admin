<template>

  <infoTable v-if="isProperty" ref="infoTable" :type="type" :defaultFilters="filters"></infoTable>
  <infoTable2 v-else ref="infoTable2" :type="type" :defaultFilters="filters"></infoTable2>

</template>

<script>
  import infoTable from './table'
  import infoTable2 from './table2'
import { get } from 'http';

  export default {
    components: {
      infoTable,
      infoTable2
    },
    props: {
      type: {
        type: String,
        default: 'valid'
      }
    },
    computed: {
      isProperty(){
       if (this.type === 'orderExecuting' || this.type === 'orderPartShipped'){
         return true;
       }else{
         return false;
       }
      },
      //待发货采购单
      filters() {
        if (this.type === 'orderExecuting') {
          return {
            'field': 'status',
            op: 'in',
            data: 6
          }
        }
        //部分发货
        else if (this.type === 'orderPartShipped') {
          return {
            field: 'status',
            op: 'in',
            data: 7
          }
        }
        //待确认发货任务
        else if (this.type === 'executing') {
          return {
            field: 'status',
            op: 'in',
            data: 3
          }
        }
        //待收货
        else if (this.type === 'shipped') {
          return {
            field: 'status',
            op: 'in',
            data: 4
          }
        }
        //完成
        else if (this.type === 'complete') {
          return {
            field: 'status',
            op: 'in',
            data: 6
          }
        }

        //全部
        else if (this.type === 'all'){
            return {
              field: 'status',
              op: 'in',
              data: ''
          }
        }
      }
    },
    methods: {
      onRefreshTable() {
        this.$refs.infoTable.onRefreshTable();
      }
    }
  }
</script>

