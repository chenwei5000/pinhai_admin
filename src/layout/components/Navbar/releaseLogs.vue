<template>
  <div class="block ph-form">
    <span>系统更新日志</span>
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
          <p v-html="br(log.caption)">
          </p>
          <hr/>
          <p>版本{{log.version}}</p>
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
    },
    computed: {
      logLine() {
        let _logs = [];
        if (this.logs) {
          this.logs.forEach(obj => {
            let _log = {};
            _log.timestamp = parseTime(obj.lastModified, '{y}-{m}-{d} {h}:{i}:{s}');
            _log.caption = obj.caption;
            _log.version = obj.version;
            _logs.push(_log);
          });
        }
        return _logs;
      }
    },

    data() {
      return {
        logs: []
      }
    },

    created() {
      this.initData();
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
        this.global.axios.get("/releaseLogs").then(resp => {
          this.logs = resp.data;
        })
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

