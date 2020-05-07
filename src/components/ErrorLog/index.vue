<template>
  <div v-if="errorLogs.length>0">
    <el-badge :is-dot="true" style="line-height: 25px;margin-top: -5px;" @click.native="dialogTableVisible=true">
      <el-button style="padding: 8px 10px;" size="mini" type="danger">
        <svg-icon icon-class="bug"/>
      </el-button>
    </el-badge>

    <el-dialog class="ph-dialog" :visible.sync="dialogTableVisible" title="Error Log" width="80%" append-to-body>
      <div class="ph-table">
        <el-table :data="errorLogs"
                  border
                  cell-class-name="ph-cell"
                  header-cell-class-name="ph-cell-header"
        >

          <el-table-column label="操作" size="mini" min-width="200px">
            <template slot-scope="{row}">
              <div>
                <el-tag type="success">
                  {{ row.title }}
                </el-tag>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="错误提示" min-width="300px">
            <template slot-scope="{row}">
              <div>
                <el-tag type="danger" v-html="row.message">
                </el-tag>
              </div>
            </template>
          </el-table-column>


          <el-table-column label="操作时间" size="mini" width="120px">
            <template slot-scope="{row}">
              <div>
                  <span>{{ row.time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
              </div>
            </template>
          </el-table-column>

        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'ErrorLog',
    data() {
      return {
        dialogTableVisible: false
      }
    },
    computed: {
      errorLogs() {
        return this.$store.getters.errorLogs
      }
    }
  }
</script>

<style scoped>
  .message-title {
    font-size: 16px;
    color: #333;
    font-weight: bold;
    padding-right: 8px;
  }
</style>
