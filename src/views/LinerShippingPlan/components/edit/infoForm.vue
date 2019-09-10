<template>

  <div class="ph-form">
    <!-- 编辑表单 TODO:-->
    <el-form :rules="rules"
             :model="editObject"
             status-icon
             inline
             ref="editObject"
             label-position="right"
             label-width="120px"
             v-loading="loading"
             inline-message
    >

      <el-row>
        <el-col :md="8">
          <el-form-item :label="editObject.type=='空运'? '航班时间' : '开船时间'" prop="etdTime">
            <el-date-picker
              size="mini"
              v-model="editObject.etdTime"
              type="datetime"
              @input="updateInput"
              style="width: 200px"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :md="8">
          <el-form-item label="运输方式" prop="type">
            <el-select
              v-model="editObject.type"
              size="mini"
              @input="updateInput"
              style="width: 200px"
              placeholder="请选择">
              <el-option label="海运" value="海运"></el-option>
              <el-option label="空运" value="空运"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :md="8">
          <el-form-item :label="editObject.type=='空运'? '发货机场' : '发货港口'" prop="portOfLoading">
            <el-select
              v-model="editObject.portOfLoading"
              size="mini"
              style="width: 200px"
              @input="updateInput"
              placeholder="请选择">
              <el-option
                v-for="(item, idx) in harbours"
                :key="`${idx}-${item.value}`"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :md="8">
          <el-form-item label="分类" prop="categoryId">
            <el-select
              v-model="editObject.categoryId"
              size="mini"
              style="width: 200px"
              @input="updateInput"
              multiple
              filterable
              placeholder="请选择">
              <el-option
                v-for="(item , idx) in categorys"
                :key="`${idx}-${item.value}`"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :md="8">
          <el-form-item label="发货仓库" prop="fromWarehouseId">
            <el-select
              v-model="editObject.fromWarehouseId"
              size="mini"
              style="width: 200px"
              filterable
              @input="updateInput"
              placeholder="请选择发货仓库">
              <el-option
                v-for="(item, idx) in fromWarehouses"
                :key="`${idx}-${item.value}`"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :md="8">
          <el-form-item label="收货仓库" prop="toWarehouseId">
            <el-select
              v-model="editObject.toWarehouseId"
              size="mini"
              style="width: 200px"
              filterable
              placeholder="请选择">
              <el-option
                v-for="(item, idx) in toWarehouses"
                :key="`${idx}-${item.value}`"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>

        <el-col :md="8">
          <el-form-item label="FBA ID" prop="shipmentId">

            <el-input v-model="editObject.shipmentId"
                      maxlength="20"
                      show-word-limit
                      size="mini"
                      style="width: 200px"
                      placeholder="请填写FBA ID"
                      clearable></el-input>

          </el-form-item>
        </el-col>

        <el-col :md="8">
          <el-form-item label="Reference ID" prop="referenceId">

            <el-input v-model="editObject.referenceId"
                      maxlength="20"
                      show-word-limit
                      size="mini"
                      style="width: 200px" placeholder="请填写Reference ID" clearable></el-input>

          </el-form-item>
        </el-col>

        <el-col :md="8">
          <el-form-item label="是否打托" prop="pallet">
            <el-radio-group
              v-model.number="editObject.pallet"
              size="mini">
              <el-radio-button label="1" value="1">开启</el-radio-button>
              <el-radio-button label="0" value="0">关闭</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>

      </el-row>

      <el-row>
        <el-col :md="8">
          <el-form-item label="Oversize" prop="oversize">
            <el-radio-group
              v-model.number="editObject.oversize"
              size="mini">
              <el-radio-button label="1" value="1">是</el-radio-button>
              <el-radio-button label="0" value="0">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :md="24">
          <el-form-item label="备注">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="editObject.detail"
              style="width:500px"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :md="24">
          <el-row type="flex" justify="center">
            <el-button type="primary" style="margin-top: 20px" :loading="confirmLoading" @click="onSave" v-if="hasEdit">
              保存基本信息
            </el-button>
          </el-row>
        </el-col>
      </el-row>

    </el-form>
  </div>

</template>

<script>

  import {intArrToStrArr} from '@/utils'
  import harbourModel from "@/api/harbour";
  import categoryModel from "@/api/category";

  export default {
    components: {},
    props: {
      primary: {
        type: [Object],
        default: {}
      }
    },
    computed: {
      hasEdit() {
        return true;
      }
    },

    data() {
      return {
        // 表单加载状态
        loading: false,
        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,

        // 选择框 TODO:
        fromWarehouses: [],
        toWarehouses: [],
        harbours: [],
        categorys: [],
        users: [],

        // 编辑对象 TODO
        editObject: {},

        // 字段验证规则 TODO:
        rules: {
          etdTime: [
            {required: true, message: "必填", trigger: "blur"}
          ],
          type: [
            {required: true, message: "必填", trigger: "blur"}
          ],
          portOfLoading: [
            {required: true, message: "必填", trigger: "blur"}
          ],
          fromWarehouseId: [
            {required: true, message: "必填", trigger: "blur"}
          ],
          toWarehouseId: [
            {required: true, message: "必填", trigger: "blur"}
          ],
          categoryId: [
            {required: true, message: "必填", trigger: "blur"}
          ],
          merchandiserId: [
            {required: true, message: "必填", trigger: "blur"}
          ],
          oversize: [
            {required: true, message: "必填", trigger: "blur"}
          ],
          pallet: [
            {required: true, message: "必填", trigger: "blur"}
          ]
        },
      }
    },

    created() {
    },

    mounted() {
      this.$nextTick(() => {
        this.initData();
      });
    },
    methods: {
      /********************* 基础方法  *****************************/
      /**
       * 初始化数据
       */
      initData() {
        this.loading = true;
        if (this.primary) {
          //获取计划数据
          this.editObject = JSON.parse(JSON.stringify(this.primary));

          //转化分类
          this.editObject.categoryId = intArrToStrArr(this.editObject.categoryId);

          // 仓库信息
          let warehousesUrl = `/warehouses?filters={"groupOp":"AND","rules":[{"field":"status","op":"eq","data":"1"}]}&sort=type asc,name`;
          this.global.axios(warehousesUrl).then(data => {
            if (data.status == 200) {
              data.data.forEach(warehouse => {
                if (
                  warehouse.type == "工厂仓" ||
                  warehouse.type == "普通" ||
                  warehouse.type == "虚拟仓"
                ) {
                  this.fromWarehouses.push({
                    value: warehouse.id,
                    label: warehouse.name
                  });
                } else if (warehouse.type == "海外仓") {
                  this.toWarehouses.push({
                    value: warehouse.id,
                    label: warehouse.name
                  });
                }
              });
            }
          });

          // 港口信息
          this.harbours = harbourModel.getSelectNameOptions();

          // 分类
          this.categorys = categoryModel.getMineSelectProdcutOptions();

          this.loading = false;
        }
        else {
          this.$message.error("无效的出口计划!");
          this.loading = false;
        }
      },

      updateInput(val) {
        this.$forceUpdate();
      },

      /********************* 操作按钮相关方法  ***************************/
      /* 保存对象 */
      onSave() {
        this.$refs.editObject.validate(valid => {
          if (!valid) {
            return false;
          }
          this.modifyObject();
        });
      },

      // 修改采购单
      modifyObject() {
        let _object = JSON.parse(JSON.stringify(this.editObject));

        const loading = this.$loading({
          lock: true,
          text: '保存中..',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        this.global.axios.put(`/linerShippingPlans/${this.editObject.id}`, _object)
          .then(resp => {
            let _newObject = resp.data;
            this.$message({type: 'success', message: '操作成功'});
            loading.close();
            // 回传消息
            this.$emit("modifiedInfoCBEvent", _newObject);
          })
          .catch(err => {
            loading.close();
          })
      }
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

</style>

