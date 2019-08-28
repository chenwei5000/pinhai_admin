<template>
  <div class="block ph-form">
    <el-timeline>

      <el-timeline-item v-for="(log, index) in logLine"
                        :key="index"
                        :timestamp="log.timestamp"
                        :type="log.type"
                        :icon="log.icon"
                        size="large"
                        placement="top">
        <el-card>
          <h4>{{log.content}}</h4>
          <p v-html="br(log.note)">
          </p>
          <hr/>
          <p>{{ log.userName}} 提交于 {{ log.timestamp }}</p>
        </el-card>
      </el-timeline-item>

    </el-timeline>
  </div>
</template>

<script>
  import {intArrToStrArr, parseTime, parseLineBreak} from '@/utils';
  import phMembers from '@/components/PhMembers';

  export default {
    components: {
      phMembers
    },
    props: {
      logs: {
        type: Array,
        default() {
          return []
        }
      }
    },
    computed: {
      logLine() {
        let _logs = [];
        if (this.logs) {
          this.logs.forEach(obj => {
            let _log = {};
            _log.timestamp = parseTime(obj.lastModified, '{y}-{m}-{d} {h}:{i}:{s}');
            _log.note = obj.note;
            _log.userName = obj.creator.name;

            if (obj.type == 'createOrder') {
              _log.type = 'success';
              _log.content = '创建采购单';
              _log.icon = 'el-icon-circle-plus';
            }
            else if (obj.type == 'updateOrder') {
              _log.type = 'primary';
              _log.content = '更新采购单基本信息';
              _log.icon = 'el-icon-edit';
            }
            else if (obj.type == 'updateOrderDetail') {
              _log.type = 'primary';
              _log.content = '更新采购单信息';
              _log.icon = 'el-icon-edit-outline';
            }
            else if (obj.type == 'commitOrder') {
              _log.type = 'primary';
              _log.content = '采购单提交审核';
              _log.icon = 'el-icon-s-check';
            }
            else if (obj.type == 'agreeOrder') {
              _log.type = 'success';
              _log.content = '采购单审核通过';
              _log.icon = 'el-icon-success';
            }
            else if (obj.type == 'refuseOrder') {
              _log.type = 'danger';
              _log.content = '采购单审核拒绝';
              _log.icon = 'el-icon-error';
            }
            else if (obj.type == 'withdrawOrder') {
              _log.type = 'danger';
              _log.content = '采购单撤回';
              _log.icon = 'el-icon-error';
            }
            else if (obj.type == 'assignOrder') {
              _log.type = 'danger';
              _log.content = '采购单指派负责人';
              _log.icon = 'el-icon-error';
            }
            else if (obj.type == 'cancelAssignOrder') {
              _log.type = 'danger';
              _log.content = '采购单取消指派负责人';
              _log.icon = 'el-icon-error';
            }
            else if (obj.type == 'removeOrder') {
              _log.type = 'danger';
              _log.content = '删除采购单';
              _log.icon = 'el-icon-error';
            }
            else if (obj.type == 'handoverOrder') {
              _log.type = 'warning';
              _log.content = '交接采购单';
            }
            else if (obj.type == 'share') {
              _log.type = 'warning';
              _log.content = '分享采购单';
            }
            else if (obj.type == 'complete') {
              _log.type = 'success';
              _log.content = '采购单结束';
              _log.icon = 'el-icon-star-on';
            }
            _logs.push(_log);
          });
        }
        return _logs;
      }
    },

    data() {
      return {}
    },

    created() {
    },

    mounted() {
      this.$nextTick(() => {
        this.initData();
      });
    },
    methods: {
      br(text) {
        return parseLineBreak(text);
      },
      /********************* 基础方法  *****************************/
      /**
       * 初始化数据
       */
      initData() {
      },
    }
  }
</script>

<style type="text/less" lang="scss" scoped>

  .panel-heading {
    color: #444;
    border: 1px #cfd9db solid;
  }

  .panel-title {
    display: table-cell;
    vertical-align: middle;
    padding: 0 10px;
  }

  .el-form-item {
    //margin-bottom: 7px;
  }

  .tag-group {
    .el-tag {
      margin-right: 10px;
    }
  }

</style>

