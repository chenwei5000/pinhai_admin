<template>
  <el-row class="table-tool" type="flex" justify="space-between">

    <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleUpload">


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
  import XLSX from 'xlsx'

  export default {
    props: {
      uploadUrl: {
        type: String,
        default: null
      },
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
          this.$refs['excel-upload-input'].click();
        }
      },

      /*上传导入功能*/
      handleUpload(e) {
        const files = e.target.files
        const rawFile = files[0] // only use files[0]
        if (!rawFile) return;
        this.upload(rawFile)
      },
      generateData({rawFile, header, results}) {
        let excelData = {};
        excelData.rawFile = rawFile;
        excelData.header = header;
        excelData.results = results;
        this.$emit("onToolBarImportData", excelData);
      },
      upload(rawFile) {
        // fix can't select the same excel
        this.$refs['excel-upload-input'].value = null;
        this.readerData(rawFile)
      },
      readerData(rawFile) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = e => {
            const data = e.target.result
            const workbook = XLSX.read(data, {type: 'array'})
            const firstSheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[firstSheetName]
            const header = this.getHeaderRow(worksheet)
            const results = XLSX.utils.sheet_to_json(worksheet)
            this.generateData({rawFile, header, results})
            resolve()
          }
          reader.readAsArrayBuffer(rawFile)
        })
      },
      getHeaderRow(sheet) {
        const headers = []
        const range = XLSX.utils.decode_range(sheet['!ref'])
        let C
        const R = range.s.r
        /* start in the first row */
        for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
          const cell = sheet[XLSX.utils.encode_cell({c: C, r: R})]
          /* find the cell in the first row */
          let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
          if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
          headers.push(hdr)
        }
        return headers
      },
      isExcel(file) {
        return /\.(xlsx|xls|csv)$/.test(file.name)
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
