<template>
  <div>
    <el-row class="table-tool" type="flex" justify="space-between">
      <el-col :md="18">
        <el-button type="primary" icon="el-icon-circle-plus" @click="onDefaultAdd"
                   size="mini">
          新增
        </el-button>

      </el-col>

    </el-row>

  </div>
</template>

<script>

  export default {
    props: {
      primary: {
        type: [Object],
        default: null
      }
    },
    components: {},
    computed: {},

    mounted() {
      this.$nextTick(() => {
      })
    },
    methods: {
      onDefaultAdd() {
        this.$emit("onAdd");
      }
    }
  }

</script>

<style type="text/less" lang="scss" scoped>
  .table-tool {
    background-color: #dfe6ec;
    position: relative;
    z-index: 890;
    width: 100%;
    min-height: 40px;
    line-height: 30px;
    padding: 5px 10px;
  }

  .excel-upload-input {
    display: none !important;
  }

</style>
