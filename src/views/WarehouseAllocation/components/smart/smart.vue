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

        <legend class="panel-title">国内调拨
          <el-tooltip class="item" effect="light" placement="right">
            <div slot="content">
              货物从国内仓转移到国内仓
            </div>
            <i class="el-icon-question">&nbsp;</i>
          </el-tooltip>
        </legend>

      <el-row>
        <el-col :md="10">
            <el-form-item label="发货仓库" prop="fromWarehouseId">
              <el-select v-model="newObject.fromWarehouseId" style="width: 220px"
                        filterable placeholder="请选择发货仓库">
                <el-option
                  v-for="(item , idx)  in warehouseSelectOptions"
                  :label="item.label"
                  :value="item.value"
                  :key="idx"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="收货仓库" prop="toWarehouseId">
              <el-select v-model="newObject.toWarehouseId" style="width: 220px"
                        filterable placeholder="请选择收货仓库">
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
            <el-form-item label="预计发货时间" prop="expectTime">
              <el-date-picker
                v-model="newObject.expectTime"
                format="yyyy-MM-dd"
                type="date"
                placeholder="预计发货时间"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 国内调拨明细列表 -->
        <itemTable
          ref="itemTable"
          @createCBEvent="createCBEvent"
        ></itemTable>

        <el-col :md="24">
          <el-row type="flex" justify="center">
            <el-button type="primary" style="margin-top: 15px" :loading="confirmLoading" @click="onSmart">
              创建
            </el-button>
          </el-row>
        </el-col>

      </fieldset>
    </el-form>

   
  </div>

</template>

<script>
  import warehouseModel from '@/api/warehouse'
  import systemModel from '@/api/system'
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
          expectTime: null,
          fromWarehouseId: null,
          toWarehouseId: null
        },
        // 字段验证规则 TODO:
        rules: {
          fromWarehouseId: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          toWarehouseId: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          expectTime: [
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
        this.loading = false;
      },
     

      /********************* 操作按钮相关方法  ***************************/
      // 调拨 TODO:
      onSmart() {
        this.$refs.smart.validate(valid => {
          if (!valid) {
            return;
          }
        this.$emit("step1CBEvent", 1);
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

