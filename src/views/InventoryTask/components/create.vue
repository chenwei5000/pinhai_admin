<template>
  <div class="ph-form">

    <!-- 添加功能 form-表单, fieldSet-字段租, legend-标题, tooltip-提示框 -->
    <el-form :rules="rules"
             :model="newObject"
             status-icon
             inline
             ref="step1"
             label-position="right"
             label-width="120px"
             v-loading="loading"
             inline-message
    >

      <fieldset class="panel-heading">

        <el-row>
          <el-col :md="10">
            <el-form-item label="仓库" prop="warehouseId">
              <el-select v-model="newObject.warehouseId" style="width: 220px">
                <el-option
                  v-for="(item , idx)  in warehouseSelectOptions"
                  :label="item.label"
                  :value="item.value"
                  :key="idx"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="14">
            <el-form-item label="截至日期" prop="limitTime">
              <el-date-picker
                v-model="newObject.limitTime"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="截至日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-col :md="24">
          <el-row type="flex" justify="center">
            <el-button type="primary" style="margin-top: 15px" :loading="confirmLoading" @click="onNext">
              下一步
            </el-button>
          </el-row>
        </el-col>

      </fieldset>
    </el-form>

  </div>

</template>

<script>
  import warehouseModel from '@/api/warehouse'
  import {intArrToStrArr} from '@/utils'

  export default {
    components: {},
    props: {},
    computed: {},

    data() {
      return {
        // 表单加载状态
        loading: false,
        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,

        // 选择框 TODO:
        warehouseSelectOptions: [],

        // 新对象  TODO:
        newObject: {
          limitTime: null,
          warehouseId: null,
        },
        // 字段验证规则 TODO:
        rules: {
          limitTime: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          warehouseId: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
        },
      }
    },

    mounted() {
      // 渲染完毕，控件加载完毕后执行
      this.$nextTick(() => {
        this.initData();
      })
    },
    methods: {
      /********************* 基础方法  *****************************/
      //初始化数据 TODO:根据实际情况调整
      initData() {
        this.loading = true;
        // 加载选择框数据
        this.warehouseSelectOptions = warehouseModel.getSelectOptions();
        this.initWarehouseData();

        this.loading = false;
      },

      // 初始化仓库数据
      initWarehouseData(val = null) {
        if (!val) {
          return;
        }
        this.loading = true;
        let url = "/warehouses/permissions";
        url += +val.join(",");
        this.global.axios.get(url)
          .then(resp => {
            let res = resp.data || [];
            this.warehouseSelectOptions = [];
            res.forEach(r => {
              this.warehouseSelectOptions.push({
                label: r.name,
                value: r.id + ''
              });
            });
            this.loading = false;
          })
          .catch(err => {
            this.loading = false;
          });
      },

      /********************* 操作按钮相关方法  ***************************/
      // 创建盘点明细  TODO:

      onNext() {
        this.$refs.step1.validate(valid => {

          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });

          if (!valid) {
            return;
          }
          this.global.axios
            .post("/inventoryTasks", this.newObject)
            .then(resp => {
              this.$message.info("盘点任务创建成功");
              loading.close();
              this.loading = false
            })
            .catch(err => {
              loading.close();
            });

        });
      },
      createCBEvent(newObjectId) {
        this.$emit("step2CBEvent", newObjectId);
      },
    }
  }
</script>

<style type="text/less" lang="scss" scoped>

  .panel-heading {
    color: #444;
    border: 1px #cfd9db solid;
    margin-top: 10px;
  }

  .panel-title {
    display: table-cell;
    vertical-align: middle;
    padding: 0 10px;
  }

  .el-form-item {
    //margin-bottom: 7px;
  }


</style>
