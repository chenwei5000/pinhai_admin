<template>
  <div class="ph-form">

    <!-- 添加功能 form-表单, fieldset-字段租, legend-标题, tooltip-提示框 -->
    <el-form :rules="rules"
             :model="newObject"
             status-icon
             inline
             ref="smart"
             label-position="right"
             label-width="120px"
             v-loading="loading"
             inline-message
    >

      <fieldset class="panel-heading">

        <legend class="panel-title">创建盘点任务
        </legend>

        <el-row>
          <el-col :md="24">
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

          <el-col :md="24">
            <el-form-item label="截止日期" prop="limitTime">
              <el-date-picker
                v-model="newObject.limitTime"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="截止日期"></el-date-picker>
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

    <!-- 智能备货明细列表 -->
    <itemTable
      ref="itemTable"
      @createCBEvent="createCBEvent"
    ></itemTable>
  </div>

</template>

<script>
  import warehouseModel from '@/api/warehouse'
  import {intArrToStrArr} from '@/utils'
  import itemTable from './table'

  export default {
    components: {itemTable},
    props: {},
    computed: {
    },

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
          id: null,
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
        this.warehouseSelectOptions = warehouseModel.getSelectDomesticOptions();
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
        url += "?perId=" + val.join(",");
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
      // 创建盘点任务 TODO:
      onNext() {
        this.$refs.smart.validate(valid => {
          if (!valid) {
            return;
          }
          this.confirmLoading = true;
          // 弹窗
          this.$refs.itemTable.openDialog(this.newObject);

          this.confirmLoading = false;
        })
      },

      /*
       * 创建成功之后，将子组件发送的数据继续向上传递给父组件
       */
      createCBEvent(newObjectId) {
        this.$emit("step1CBEvent", newObjectId);
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

