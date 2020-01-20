<template>

  <div class="ph-table">
    <!-- 编辑表单 TODO:-->
    <el-form :model="detailItem" status-icon
             ref="detailItem" label-position="right"
             label-width="120px"
             inline-message
             v-if="initComplete"
             @submit.native.prevent
             v-loading="loading"
    >

      <el-row>
        <el-col :md="12">
          <el-form-item label="编码:" prop="code">
            <span style="font-size: 12px">{{primary.code}}</span>
          </el-form-item>
        </el-col>

        <el-col :md="12">
          <el-form-item label="仓库:" prop="warehouseId">
            <span style="font-size: 12px">{{primary.warehouse.name}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :md="12">
          <el-form-item label="截止时间:" prop="formatLimitTime">
            <span style="font-size: 12px">{{primary.formatLimitTime}}</span>
          </el-form-item>
        </el-col>

        <el-col :md="12">
          <el-form-item label="库存总件数">
            <span style="font-size: 12px;color: blue;">{{allQty}}件</span>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>

    <el-row>
      <el-col :md="12">
        <el-row type="flex" justify="center">
          <el-button type="warning" style="margin-top: 40px" size="small" @click="onBack">
            < 上一步
          </el-button>
        </el-row>
      </el-col>
      <el-col :md="12">
        <el-row type="flex" justify="center">
          <el-button type="primary" style="margin-top: 40px" size="small" @click="onSave">
            完成盘点
          </el-button>
        </el-row>
      </el-col>
    </el-row>

  </div>

</template>

<script>

  import {mapGetters} from 'vuex';
  import {currency, parseTime} from '@/utils';


  export default {
    components: {},
    props: {
      primary: {
        type: [Object],
        default: null
      }
    },
    computed: {
      ...mapGetters([
        'device', 'rolePower'
      ])
    },
    filters: {
      currency: currency
    },

    data() {
      return {
        detailItem: {},
        allQty: 0,
        loading: false,
        initComplete: false,
        confirmLoading: false,
        url: "/inventoryTasks", // 资源URL
        filters: [
          {
            field: "relevanceId",
            op: 'eq',
            data: this.primary ? this.primary.id : -1
          }
        ],   //搜索对象
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
        let url = this.url + `/taskId/${this.primary.id}`;
        let params = '';
        if (!url) {
          console.warn('url 为空, 不发送请求');
          return
        }
        // 处理查询
        if (this.filters && this.filters.length > 0) {
          params += "?filters=" + JSON.stringify({"groupOp": "AND", "rules": this.filters});
        }
        // 请求开始
        this.loading = true;

        //获取数据
        this.global.axios
          .get(url + params)
          .then(resp => {
            let res = resp.data;
            let data = res || [];
            this.allQty = 0;
            data.forEach(res => {
              this.allQty += res.checkedStock
            })

            this.loading = false;
            this.initComplete = true;
            /**
             * 请求返回, 数据更新后触发, 返回(data, resp) data是渲染table的数据, resp是请求返回的完整response
             * @event update
             */
            this.$emit('update', data, res)
          })
          .catch(err => {
            /**
             * 请求数据失败，返回err对象
             * @event error
             */
            this.$emit('error', err);
            this.loading = false
          })
      },

      onBack() {
        this.$emit("step2CBEvent", 1);
      },

      onSave() {
        this.$refs.detailItem.validate(valid => {
          if (!valid) {
            return false
          }

          const loading = this.$loading({
            lock: true,
            text: '处理中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });

          this.global.axios.put(`/inventoryTasks/receivedTask/${this.primary.id}`)
            .then(resp => {
              this.$message.success("盘点完成");
              loading.close();
              this.$emit("step2CBEvent", 3);

            })
            .catch(err => {
              loading.close();
            })
        });
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

