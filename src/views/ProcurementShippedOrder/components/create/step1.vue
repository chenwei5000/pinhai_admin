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
              <el-form-item label="名称" prop="name" size="mini">
                <el-input v-model.trim="editObject.name"
                          maxlength="100"
                          @input="updateInput"
                          show-word-limit
                          style="width: 300px" placeholder="请填写名称" clearable></el-input>
              </el-form-item>
            </el-col>

            <el-col :md="14">
              <el-form-item label="预计发货时间" prop="expectTime" size="mini">
                <el-date-picker
                  v-model="editObject.expectTime"
                  @input="updateInput"
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="预计发货时间"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :md="10">
              <el-form-item label="发货厂商" prop="supplierId" size="mini" v-if="editObject.supplier">
                <span style="font-size: 12px">{{editObject.supplier.name}}</span>
              </el-form-item>

              <el-form-item label="发货厂商" prop="supplierId" size="mini" v-else>
                <el-select v-model="editObject.supplierId"
                           @input="updateInput"
                           style="width: 220px"
                           filterable placeholder="请选择发货厂商">
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
              <el-form-item label="收货仓库" prop="warehouseId" size="mini">
                <el-select v-model="editObject.warehouseId"
                           @input="updateInput"
                           style="width: 220px"
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
                            @input="updateInput"
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

      <tableToolBar
        ref="tableToolBar"
        :hasExportTpl="true"
        :hasImport="true"
        @onToolBarImportData="onToolBarImportData"
        @onToolBarDownloadTpl="onToolBarDownloadTpl"
      >
      </tableToolBar>

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
        @cell-dblclick="handleDblclick"
        @selection-change="handleSelectionChange"
        :default-sort="{prop: 'product.skuCode', order: 'ascending'}"
        id="table"
      >
        <el-table-column prop="product.skuCode" label="SKU" sortable width="150" fixed="left" align="center">
        </el-table-column>

        <el-table-column prop="product.imgUrl" label="图片" width="40" align="center">
          <template slot-scope="scope" v-if="scope.row.product.imgUrl">
            <el-image
              :z-index="10000"
              style="width: 30px; height: 30px;margin-top: 5px"
              :src="scope.row.product.imgUrl"
              :preview-src-list="[scope.row.product.imgUrl.replace('_SL75_','_SL500_')]" lazy>
            </el-image>
          </template>
        </el-table-column>

        <el-table-column prop="product.name" label="名称" width="200" align="center">
        </el-table-column>

        <el-table-column prop="numberOfCarton" label="装箱数" width="80" align="center"></el-table-column>
        <el-table-column prop="cartonSpec.code" label="箱规" width="120" align="center"></el-table-column>
        <el-table-column prop="procurementOrder.code" label="采购单号" width="120" align="center"></el-table-column>

        <el-table-column prop="unCartonPlanQty" label="未发货箱数" width="90" align="center"></el-table-column>
        <el-table-column prop="unPlanQty" label="未发货件数" width="90" align="center"></el-table-column>
        <el-table-column prop="remark" label="备注" width="130" align="center">
          <template slot-scope="scope">
            <el-popover placement="top-start" title="备注" width="250" trigger="hover"
                        v-if="scope.row.remark && scope.row.remark.length > 10">
              <div v-html="scope.row.remark"></div>
              <span slot="reference">{{ scope.row.remark ? scope.row.remark.substr(0,8)+'..' : '' }}</span>
            </el-popover>
            <span v-else>
            {{ scope.row.remark }}
          </span>
          </template>
        </el-table-column>

        <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>

        <el-table-column prop="shippedCartonQty" label="本次发货箱数" width="90"
                         fixed="right" align="center"></el-table-column>

        <el-table-column prop="shippedQty" label="本次发货件数" width="90"
                         fixed="right" align="center"></el-table-column>

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
          <el-button type="primary" style="margin-top: 15px" :loading="confirmLoading" size="mini" @click="onSave"
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
  import tableToolBar from '@/components/PhTableToolBar'
  import {getObjectValueByArr, parseTime} from "../../../../utils";

  export default {
    components: {
      planDetailDialog,
      tableToolBar
    },
    props: {
      primary: {
        type: [Object, Array],
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
          warehouseId: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
        },
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

      updateInput(val) {
        this.$forceUpdate();
      },

      /**
       * 初始化数据
       */
      initData() {
        this.loading = true;
        if (this.primary) {
          //获取计划数据
          this.editObject = {}

          this.data = [];

          // 采购单信息转化成发货单信息
          if (this.primary.length > 0) {
            this.editObject.name = this.primary[0].formatDeliveryTime + this.primary[0].supplier.name + '交货';
            this.editObject.warehouseId = this.primary[0].procurementOrder.warehouseId + '';
            this.editObject.supplierId = this.primary[0].supplierId + '';
            this.editObject.supplier = this.primary[0].supplier;
            this.editObject.expectTime = this.primary[0].formatDeliveryTime;
          }
          this.primary.forEach(r => {
            r.shippedCartonQty = r.unCartonPlanQty;
            r.shippedQty = r.unPlanQty;
            this.data.push(r);
          })

          this.warehouseSelectOptions = warehouseModel.getSelectDomesticAndMaterialOptions();
          this.supplierSelectOptions = supplierModel.getSelectOptions();

          this.getList();
          this.loading = false;
        }
        else {
          this.getList();
          this.editObject = {}
          this.loading = false;
        }
      },

      /********************* 表格相关方法  ***************************/
      /*获取列表*/
      getList(flg) {
        this.search();
        this.total = this.data.length || 0
        this.loading = false
      },

      handleDblclick(row, column, cell, event) {
        let val = getObjectValueByArr(row, column.property);
        if (val) {
          this.$copyText(val)
            .then(res => {
                this.$message.success("单元格内容已成功复制，可直接去粘贴");
              },
              err => {
                this.$message.error("复制失败");
              })
        }
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
            || column.property == 'shippedCartonQty'
            || column.property == 'unCartonPlanQty') {
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

          if (column.property == 'qty' || column.property == 'unPlanQty' || column.property == 'shippedQty') {
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
            this.$message.error("发货内容不能为空!");
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
                  if (item.id === row.id) {
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

      onToolBarDownloadTpl() {
        import('@/vendor/Export2ExcelPinHai').then(excel => {
          this.loading = true;
          excel.export_json_url_to_excel_with_formulae({
            url: '',
            excelField: [{'attrName': 'skuCode', 'type': 's', 'name': '#SKU编码#'},
              {'attrName': 'numberOfCarton', 'type': 's', 'name': '#装箱数#'},
              {'attrName': 'cartonQty', 'type': 's', 'name': '#本次发货箱数#'},
              {'attrName': 'remark', 'type': 's', 'name': '#备注#'},
            ],
            filename: `发货计划-${parseTime(new Date(), '{y}-{m}-{d}')}`,
            tpl: true,
          });
          this.loading = false;
        })
      },

      onToolBarImportData(excelData) {

        if (this.editObject.supplierId == null) {
          this.$message.error("请选择供货商!");
          return false;
        }

        if (!excelData) {
          this.$message.error("导入失败!");
          return false;
        }
        let loading = this.$loading({
          lock: true,
          text: '导入数据中',
          spinner: 'el-icon-upload',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        // 导入数据
        let resData = [];

        // 创建提交列表
        excelData.results.forEach(obj => {
          let _res = {};
          _res.skuCode = obj["SKU编码"];
          _res.cartonQty = obj["本次发货箱数"];
          _res.numberOfCarton = obj["装箱数"];
          _res.remark = obj["备注"];
          resData.push(_res);
        });

        let url = `/procurementDeliveryPlans/smartShipped/${this.editObject.supplierId}?relations=${JSON.stringify(["product", "cartonSpec", "creator", "procurementOrder", "supplier"])}`;

        this.global.axios.put(url, resData)
          .then(resp => {
            this.data = resp.data || [];
            loading.close();
            this.getList();
          })
          .catch(err => {
            loading.close();
          })
      },

      // 下单
      saveObject() {
        let _order = JSON.parse(JSON.stringify(this.editObject));
        _order.supplier = null;
        let _details = [];
        this.tableData.forEach(r => {
          if (r.shippedCartonQty > 0) {
            let _detail = {};
            _detail.productId = r.productId;
            _detail.cartonSpecId = r.cartonSpecId;
            _detail.numberOfCarton = r.numberOfCarton;
            _detail.shippedCartonQty = r.shippedCartonQty;
            _detail.skuCode = r.product.skuCode;
            _detail.shippedNote = r.remark;
            _detail.procurementOrderId = r.procurementOrderId;
            _detail.procurementOrderCode = r.procurementOrderCode;
            _detail.procurementDeliveryPlanId = r.id;

            _details.push(_detail);
          }
        });
        if (_details.length === 0) {
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
