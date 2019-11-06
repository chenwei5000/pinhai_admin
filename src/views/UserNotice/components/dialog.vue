<template>

  <el-dialog :title="dialogTitle"
             append-to-body
             v-if="dialogVisible"
             class="ph-dialog"
             width="60%"
             top="10vh"
             @close='closeDialog'
             :visible.sync="dialogVisible">
    <div class="ph-table">
      <p v-html="br(this.data.notice.content)">
            </p>
    </div>
  </el-dialog>
</template>

<script>

  import {mapGetters} from 'vuex'
  import {currency} from '@/utils'
  import {checkPermission} from "@/utils/permission";
  import {parse} from 'path'
  import {parseLineBreak} from '@/utils';

  export default {
    components: {},
    props: {},
    computed: {
      ...mapGetters([
        'device',
        'rolePower'
      ]),
      dialogTitle() {
        return "消息内容";
      },
    },

    filters: {
      currency: currency
    },

    data() {
      return {
        dialogVisible: false,
        data: {},
        // 表格最大高度
        tableMaxHeight: this.device !== 'mobile' ? 500 : 40000000,
      }
    },

    created() {
    },

    mounted() {
      this.$nextTick(() => {
        this.initData();
      })
    },

    methods: {
      /********************* 基础方法  *****************************/
      //初始化加载数据 TODO:根据实际情况调整
      initData() {
      },

       br(text) {
        return parseLineBreak(text);
      },


      closeDialog() {
        this.dialogVisible = false;
      },

      openDialog(row) {
        this.data = row;
        this.dialogVisible = true;
      },

    }
  }
</script>

<style type="text/less" lang="scss" scoped>

  .panel-heading {
    color: #444;
    border: 1px #cfd9db solid;
    width: 100%;
  }

  .panel-title {
    display: table-cell;
    vertical-align: middle;
    padding: 0 10px;
  }

</style>

