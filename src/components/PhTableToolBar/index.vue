<template>
  <el-row class="table-tool" type="flex" justify="space-between">

    <el-col :md="18">
      <el-button v-if="hasAdd" type="primary" icon="el-icon-circle-plus" @click="onDefaultAdd"
                 size="small" id="table-add">
        新增
      </el-button>

      <el-button v-if="hasDelete" type="danger" icon="el-icon-error" @click="onDefaultDelete"
                 size="small">
        删除
      </el-button>
    </el-col>

    <el-dropdown @command="onDefaultCommand" v-if="hasExportTpl || hasExport || hasImport">
      <el-button type="primary" icon="el-icon-folder-opened" size="small">
        导入导出<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="downloadTpl" v-if="hasExportTpl">下载模版</el-dropdown-item>
        <el-dropdown-item command="downloadData" v-if="hasExport" divided>导出数据</el-dropdown-item>
        <el-dropdown-item command="importData" v-if="hasImport" divided>导入数据</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

  </el-row>
</template>

<script>
  export default {
    props: {
      hasAdd: {
        type: Boolean,
        default: false
      },
      hasEdit: {
        type: Boolean,
        default: false
      },
      hasDelete: {
        type: Boolean,
        default: false
      },
      hasExport: {
        type: Boolean,
        default: false
      },
      hasExportTpl: {
        type: Boolean,
        default: false
      },
      hasImport: {
        type: Boolean,
        default: false
      },
    },
    mounted() {
      this.$nextTick(() => {
      })
    },
    methods: {
      onDefaultAdd() {
        this.$emit("onToolBarAdd");
      },
      onDefaultEdit() {
        this.$emit("onToolBarEdit");
      },
      onDefaultDelete() {
        this.$emit("onToolBarDelete");
      },
      onDefaultCommand(command) {
        if (command == 'downloadTpl') {
          this.$emit("onToolBarDownloadTpl");
        }
        else if (command == 'downloadData') {
          this.$emit("onToolBarDownloadData");
        }
        else if (command == 'importData') {
          this.$emit("onToolBarImportData");
        }
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

</style>
