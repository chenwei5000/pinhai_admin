<template>
  <div class="ph-form">

    <!-- 添加功能 form-表单, fieldSet-字段租, legend-标题, tooltip-提示框 -->
    <el-form :rules="rules"
             :model="newObject"
             status-icon
             inline
             inline-message
             ref="newObject"
             label-position="right"
             label-width="120px"
             v-loading="loading"
    >

      <fieldset class="panel-heading">

        <legend class="panel-title">盘亏盘盈单
        </legend>

        <el-row>
          <el-col :md="12">
            <el-form-item label="仓库" prop="warehouseId" size="mini">
              <el-select v-model="newObject.warehouseId" style="width: 180px"
                         filterable placeholder="请选择仓库">
                <el-option
                  v-for="(item , idx)  in warehouseSelectOptions"
                  :label="item.label"
                  :value='item.value'
                  :key="idx"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :md="12">
            <el-form-item label="类型" prop="type" size="mini">
              <el-select v-model="newObject.type" style="width: 180px"
                         filterable placeholder="类型">
                <el-option
                  v-for="(item , idx)  in typeSelection"
                  :label="item.label"
                  :value='item.value'
                  :key="idx"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="24">
            <el-form-item label="备注" prop="comments">
              <el-col :span="22">
                <el-input type="textarea" v-model="newObject.comments"
                          maxlength="500"
                          show-word-limit
                          rows="3"
                          cols="80"
                          show-word-limit></el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 盘亏盘盈明细列表 -->
        <itemTable
          ref="itemTable"
          :primary="newObject"
          @createCBEvent="createCBEvent"
        ></itemTable>

        <el-col :md="24">
          <el-row type="flex" justify="center">
            <el-button type="primary" style="margin-top: 15px" size="mini" :loading="confirmLoading" @click="onCreate">
              生成{{typeName}}
            </el-button>
          </el-row>
        </el-col>

      </fieldset>
    </el-form>
  </div>

</template>

<script>
  import warehouseModel from '@/api/warehouse'
  import phEnumModel from '@/api/phEnum'
  import {intArrToStrArr} from '@/utils'
  import itemTable from './table'

  export default {
    components: {itemTable},
    props: {},
    computed: {
      typeName(){
        if ( this.newObject.type == null ){
          return "盘亏盘盈单";
        }
        if ( this.newObject.type == "iin"){
          return "盘盈单";
        }
        if ( this.newObject.type == "iout"){
          return "盘亏单";
        }
      }
    },

    data() {
      return {
        // 表单加载状态
        loading: false,
        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,

        // 选择框 TODO:
        warehouseSelectOptions: [],
        typeSelection: [],
        // 新对象  TODO:
        newObject: {
          warehouseId: null,
          type: null,
          comments: null,


        },
        // 字段验证规则 TODO:
        rules: {
          warehouseId: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          type: [
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
        this.warehouseSelectOptions = warehouseModel.getSelectDomesticAndMaterialOptions();
        this.typeSelection = phEnumModel.getSelectOptions('InventoryType');
        this.loading = false;
      },
      /********************* 操作按钮相关方法  ***************************/
      // 生成盘亏盘盈单 TODO:

      onCreate() {
        this.$refs.newObject.validate(valid => {
          if (!valid) {
            return;
          }
          let detailItems = this.$refs.itemTable.tableData;
          if (!detailItems || detailItems.length == 0) {
            this.$message.error("盘亏盘盈单内容不能为空!");
            return;
          }
          this.saveObject(detailItems);
        });
      },

      saveObject(detailItems) {
        let _order = JSON.parse(JSON.stringify(this.newObject));
        _order.inventoryItemTOs = detailItems;

        const loading = this.$loading({
          lock: true,
          text: '下单中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        this.global.axios
          .post("/inventories", _order)
          .then(resp => {
            loading.close();
            this.$message.success(this.typeName + "创建成功");
            this.$refs.itemTable.tableData = [];
            this.newObject = {};
          })
          .catch(err => {
            loading.close();
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

