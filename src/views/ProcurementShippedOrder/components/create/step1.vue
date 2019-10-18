<template>

  <div>
    <div class="ph-form" style="margin-top: 15px">
      <!-- 编辑表单 TODO:-->
      <el-form :rules="rules" :model="editObject" status-icon inline
               ref="editObject"
               label-position="right"
               label-width="120px"
               v-loading="loading"
               inline-message
      >
        <fieldset class="panel-heading" style="margin-top: 15px">
          <legend class="panel-title">发货计划信息
            <el-tooltip class="item" effect="light" placement="right">
              <div slot="content">
                发货单相关信息
              </div>
              <i class="el-icon-question">&nbsp;</i>
            </el-tooltip>
          </legend>

          <el-row>
            <el-col :md="10">
              <el-form-item label="名称" prop="name">
                <el-input v-model.trim="editObject.name"
                          maxlength="100"
                          show-word-limit
                          style="width: 220px" placeholder="请填写名称" clearable></el-input>
              </el-form-item>
            </el-col>

            <el-col :md="14">
              <el-form-item label="预计发货时间" prop="expectTime">
                <el-date-picker
                  v-model="editObject.expectTime"
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="预计发货时间"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :md="10">
              <el-form-item label="发货厂商" prop="supplierId">
                <el-select v-model="editObject.supplierId"
                           style="width: 220px"
                           filterable placeholder="请选择">
                  <el-option
                    v-for="(item , idx)  in supplierSelectOptions"
                    :label="item.label"
                    :value="item.value"
                    :key="idx"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :md="14">
              <el-form-item label="收货仓库" prop="warehouseId">
                <el-select v-model="editObject.warehouseId" style="width: 220px"
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
            <el-col :md="24">
              <el-form-item label="备注" prop="note">
                <el-col :span="22">
                  <el-input type="textarea" v-model="editObject.remark"
                            maxlength="200"
                            show-word-limit
                            rows="3"
                            cols="80"
                            show-word-limit></el-input>
                </el-col>

                <el-col :span="2" v-if="hasEdit">
                  <el-tooltip class="item" effect="light" content="备注信息。支持换行！" placement="right">
                    <i class="el-icon-question">&nbsp;</i>
                  </el-tooltip>
                </el-col>

              </el-form-item>
            </el-col>
          </el-row>
        </fieldset>
      </el-form>
    </div>

    <h4>产品详情</h4>
    <div class="ph-table" style="margin-top: 15px;">
      <el-table
        ref="table"
        style="width: 100%"
        stripe
        border
        highlight-current-row
        :max-height="tableMaxHeight"
        :row-class-name="dangerClassName"
        cell-class-name="ph-cell"
        header-cell-class-name="ph-cell-header"
        :data="tableData"
        v-loading="loading"
        show-summary
        :summary-method="getSummaries"
        @selection-change="handleSelectionChange"
        :default-sort="{prop: 'product.skuCode', order: 'ascending'}"
        id="table"
      >
        <el-table-column prop="product.skuCode" label="SKU" sortable width="150" fixed="left">
          <template slot-scope="scope">
            <el-popover placement="top-start" width="200" trigger="hover"
                        v-if="scope.row.product.skuCode && scope.row.product.skuCode.length > 22">
              <div v-html="scope.row.product.skuCode"></div>
              <span slot="reference">{{
              scope.row.product.skuCode ? scope.row.product.skuCode.length > 22 ? scope.row.product.skuCode.substr(0,20)+'..' : scope.row.product.skuCode : ''
              }}</span>
            </el-popover>
            <span v-else>
            {{ scope.row.skuCode }}
          </span>
          </template>
        </el-table-column>

        <el-table-column prop="productName" label="名称" width="200">
          <template slot-scope="scope">
            <el-popover placement="top-start" width="200" trigger="hover"
                        v-if="scope.row.product.name && scope.row.product.name.length > 17">
              <div v-html="scope.row.product.name"></div>
              <span slot="reference">{{
              scope.row.product.name ? scope.row.product.name.length > 17 ? scope.row.product.name.substr(0,15)+'..' : scope.row.product.name : ''
              }}</span>
            </el-popover>
            <span v-else>
            {{ scope.row.product.name }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="numberOfCarton" label="装箱数" width="80"></el-table-column>
        <el-table-column prop="cartonSpecCode" label="箱规" width="120"></el-table-column>

        <el-table-column prop="cartonQty" label="采购箱数" width="110"></el-table-column>
        <el-table-column prop="orderCartonQty" label="已下单箱数" width="100"></el-table-column>
        <el-table-column prop="noOrderCartonQty" label="未下单箱数" width="100"></el-table-column>
        <el-table-column prop="remark" label="备注" width="130">
          <template slot-scope="scope">
            <el-popover placement="top-start" title="备注" width="250" trigger="hover"
                        v-if="scope.row.shippedNote && scope.row.shippedNote.length > 10">
              <div v-html="scope.row.shippedNote"></div>
              <span slot="reference">{{ scope.row.shippedNote ? scope.row.shippedNote.substr(0,8)+'..' : '' }}</span>
            </el-popover>
            <span v-else>
            {{ scope.row.shippedNote }}
          </span>
          </template>
        </el-table-column>

        <el-table-column prop="id" label="ID" width="80"></el-table-column>

        <el-table-column prop="planCartonQty" label="本次发货箱数" width="120"
                         fixed="right"></el-table-column>

        <el-table-column prop="planQty" label="本次发货件数" width="120"
                         fixed="right"></el-table-column>

        <!--默认操作列-->
        <el-table-column label="操作"
                         no-export="true"
                         width="120" fixed="right">

          <template slot-scope="scope">

            <el-button v-if="hasEdit" size="mini" icon="el-icon-edit" circle
                       @click="onDefaultEdit(scope.row)" type="primary" id="ph-table-edit">
            </el-button>

            <el-button v-if="hasDelete" type="danger" size="mini"
                       id="ph-table-del" icon="el-icon-delete" circle
                       @click="onDefaultDelete(scope.row)">

            </el-button>
          </template>

        </el-table-column>
      </el-table>

      <!-- 编辑明细对话框 -->
      <planDetailDialog @modifyDetailCBEvent="modifyDetailCBEvent" ref="planDetailDialog">
      </planDetailDialog>
    </div>

    <el-row>
      <el-col :md="24">
        <el-row type="flex" justify="center">
          <el-button type="primary" style="margin-top: 15px" :loading="confirmLoading" @click="onSave"
                     v-if="hasEdit">
            创建发货计划
          </el-button>
        </el-row>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import {currency, intArrToStrArr} from '@/utils'
  import warehouseModel from '@/api/warehouse'
  import supplierModel from '@/api/supplier'
  import planDetailDialog from './planDetailDialog'
  import {checkPermission} from "../../../../utils/permission";

  export default {
    components: {
      planDetailDialog
    },
    props: {
      primary: {
        type: [Object],
        default: {}
      }
    },
    filters: {
      currency: currency
    },
    computed: {
      hasEdit() {
        return checkPermission('ProcurementShippedOrderItemResource_create');
      },
      hasDelete() {
        return checkPermission('ProcurementShippedOrderItemResource_remove');
      }
    },
    watch: {},

    data() {
      return {
        // 表格最大高度
        tableMaxHeight: this.device !== 'mobile' ? 500 : 40000000,

        // 多选记录对象
        selected: [],

        // 表单加载状态
        loading: false,
        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,

        // 选择框 TODO:
        supplierSelectOptions: [],
        warehouseSelectOptions: [],

        // 编辑对象 TODO
        editObject: {},

        // 字段验证规则 TODO:
        rules: {
          supplierId: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          warehouseId: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
        },

        //数据
        url: "/procurementOrderItems", // 资源URL
        downloadUrl: "", //下载Url
        filters: [
          {
            field: "procurementOrderId",
            op: 'eq',
            data: this.primary ? this.primary.id : -1
          }
        ],   //搜索对象
        relations: ["cartonSpec", "product"],  // 关联对象
        data: [], // 从后台加载的数据
        tableData: [],  // 前端表格显示的数据，本地搜索用
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
          this.editObject = {};

          // 采购单信息转化成发货单信息
          this.editObject.name = this.primary.name;
          this.editObject.warehouseId = this.primary.warehouseId + '';
          this.editObject.supplierId = this.primary.supplierId + '';
          this.editObject.supplier = this.primary.supplier;
          this.editObject.procurementOrderId = this.primary.id;
          this.editObject.procurementPlanId = this.primary.procurementPlanId;

          this.warehouseSelectOptions = warehouseModel.getSelectDomesticOptions();
          this.supplierSelectOptions = supplierModel.getSelectOptions();
          this.getList();
          this.loading = false;
        }
        else {
          this.$message.error("无效的采购单!");
          this.loading = false;
        }
      },

      /********************* 表格相关方法  ***************************/
      /*获取列表*/
      getList() {
        let url = this.url;
        let params = '';

        if (!url) {
          console.warn('url 为空, 不发送请求')
          return
        }

        // 处理查询
        if (this.filters && this.filters.length > 0) {
          params += "?filters=" + JSON.stringify({"groupOp": "AND", "rules": this.filters});
        }

        // 处理关联加载
        if (this.relations && this.relations.length > 0) {
          params += "&relations=" + JSON.stringify(this.relations);
        }

        // 请求开始
        this.loading = true

        //获取数据
        this.global.axios
          .get(url + params)
          .then(resp => {
            let res = resp.data || [];
            let data = []
            res.forEach(r => {
              // 默认使用未发货的箱数，作为要发货的箱数
              r.planCartonQty = r.noOrderCartonQty;
              // 默认发货件
              r.planQty = r.planCartonQty * r.numberOfCarton;
              data.push(r);
            });

            this.data = data
            this.search();

            this.total = res.length || 0
            this.loading = false
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
            this.$emit('error', err)
            this.loading = false
          })
      },

      //报警样式
      dangerClassName({row, rowIndex}) {
        // 产品无装箱数
        if (!row.numberOfCarton) {
          return 'danger-row';
        }
        // 产品无箱规
        if (!row.cartonSpecId || row.cartonSpecId == -1) {
          return 'danger-row';
        }

        return '';
      },

      /*汇总数据*/
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];

        columns.forEach((column, index) => {

          if (column.property == 'product.skuCode') {
            const values = data.map(item => item[column.property]);
            sums[index] = values.reduce((prev) => {
              return prev + 1;
            }, 0);

            sums[index] = '合计: ' + sums[index] + ' 行';
          }

          if (column.property == 'cartonQty'
            || column.property == 'orderCartonQty'
            || column.property == 'noOrderCartonQty'
            || column.property == 'planCartonQty') {
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
              sums[index] += ' 箱';
            } else {
              sums[index] = 'N/A';
            }
          }

          if (column.property == 'planQty') {
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
              sums[index] += ' 件';
            } else {
              sums[index] = 'N/A';
            }
          }
        });

        return sums;
      },

      /* 多选功能 */
      handleSelectionChange(val) {
        this.selected = val
      },

      /*本地搜索*/
      search() {
        this.tableData = JSON.parse(JSON.stringify(this.data));
      },

      /********************* 操作按钮相关方法  ***************************/
      /* 保存对象 */
      onSave() {
        this.$refs.editObject.validate(valid => {
          if (!valid) {
            return;
          }
          if (!this.data || this.data.length == 0) {
            this.$message.error("采购单内容不能为空!");
            return;
          }

          this.confirmLoading = true;
          let msg = '';
          this.data.forEach(r => {

            // 产品无装箱数
            if (!r.numberOfCarton) {
              msg += `产品${r.product.skuCode}装箱数必须输入!\n`;
            }
            // 产品无箱规
            if (!r.cartonSpecId || r.cartonSpecId == -1) {
              msg += `产品${r.product.skuCode}箱规不正确! 如不确定箱规可以箱规可以选择Undefined。\n`;
            }
          });

          if (msg != '') {
            this.$message.error(msg);
            this.confirmLoading = false;
            return;
          }

          this.saveObject();

          this.confirmLoading = false;
        });
      },

      /* 编辑明细 */
      onDefaultEdit(row) {
        this.$refs.planDetailDialog.openDialog(JSON.parse(JSON.stringify(row)));
      },
      /* 保存明细回调 */
      modifyDetailCBEvent(row) {
        this.data.forEach((item, index, arr) => {
          if (item.id == row.id) {
            arr[index] = row;
          }
        });
        this.search();
      },

      onDefaultDelete(row) {
        this.$confirm('确认删除吗', '提示', {
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              let idx = null;
              this.data.forEach((item, index) => {
                  if (item.skuCode === row.skuCode) {
                    idx = index;
                    return;
                  }
                }
              );
              this.date = this.data.splice(idx, 1);
              this.search();
              done();
            } else done()
          }
        }).catch(er => {
          /*取消*/
        })
      },

      // 下单
      saveObject() {
        let _order = JSON.parse(JSON.stringify(this.editObject));
        let _details = [];
        this.tableData.forEach(r => {
          if (r.planCartonQty > 0) {
            let _detail = {};
            _detail.productId = r.productId;
            _detail.cartonSpecId = r.cartonSpecId;
            _detail.numberOfCarton = r.numberOfCarton;
            _detail.shippedCartonQty = r.planCartonQty;
            _detail.skuCode = r.product.skuCode;
            _detail.shippedNote = r.shippedNote;
            _details.push(_detail);
          }
        });
       if(_details.length === 0){
         this.$message.error('本次发货箱数总数不能为0');
         return;
       }


        _order.shippedOrderItems = _details;

        const loading = this.$loading({
          lock: true,
          text: '下单中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        this.global.axios.post('/procurementShippedOrders', _order)
          .then(resp => {
            let _newObject = resp.data;
            this.$message({type: 'success', message: '操作成功'});
            loading.close();
            this.$emit("step1CBEvent", _newObject);
          })
          .catch(err => {
            loading.close();
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
  }
</style>
