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

    <el-dropdown @command="onDefaultCommand">
      <el-button type="primary" icon="el-icon-folder-opened" size="small">
        导入导出<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="downloadTpl">下载模版</el-dropdown-item>
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
      onAdd: {
        type: Function
      },
      hasEdit: {
        type: Boolean,
        default: false
      },
      onEdit: {
        type: Function
      },
      hasDelete: {
        type: Boolean,
        default: false
      },
      onDelete: {
        type: Function
      },
      hasExport: {
        type: Boolean,
        default: false
      },
      onExport: {
        type: Function
      },
      hasExportTpl: {
        type: Boolean,
        default: false
      },
      onExportTpl: {
        type: Function
      },
      hasImport: {
        type: Boolean,
        default: false
      },
      onImport: {
        type: Function
      },
    },
    mounted() {
      this.$nextTick(() => {
      })
    },
    methods: {
      onDefaultAdd() {
        if (this.onAdd) {
          this.onAdd();
        }
        else {
          this.$message.error("未指定处理方法!");
        }
      },
      onDefaultEdit() {
        if (this.onEdit) {
          this.onEdit();
        }
        else {
          this.$message.error("未指定处理方法!");
        }
      },
      onDefaultDelete() {
        if (this.onDelete) {
          this.onDelete();
        }
        else {
          this.$message.error("未指定处理方法!");
        }
      },
      onDefaultCommand(command) {
        if (command == 'downloadTpl') {

          if (this.onExportTpl) {
            this.onExportTpl();
          }
          else {
            this.$message.error("未指定处理方法!");
          }
        }
        else if (command == 'downloadData') {

          if (this.onExport) {
            this.onExport();
          }
          else {
            this.$message.error("未指定处理方法!");
          }
        }
        else if (command == 'importData') {
          if (this.onImport) {
            this.onImport();
          }
          else {
            this.$message.error("未指定处理方法!");
          }
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
