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
        <fieldset class="panel-heading">
          <legend class="panel-title">交货要求
            <el-tooltip class="item" effect="light" placement="right">
              <div slot="content">
                销售对采购计划的要求
              </div>
              <i class="el-icon-question">&nbsp;</i>
            </el-tooltip>
          </legend>

          <el-row v-html="editObject.formatNote" v-if="editObject.note">
          </el-row>
          <el-row v-else>
            无
          </el-row>

        </fieldset>

        <fieldset class="panel-heading" style="margin-top: 15px">
          <legend class="panel-title">采购单信息
            <el-tooltip class="item" effect="light" placement="right">
              <div slot="content">
                采购单相关信息
              </div>
              <i class="el-icon-question">&nbsp;</i>
            </el-tooltip>
          </legend>

          <el-row>
            <el-col :md="8">
              <el-form-item label="供货商" prop="supplierId">
                <el-select v-model="editObject.supplierId" @change="onSupplierChange" size="mini"
                           filterable placeholder="请选择供货商">
                  <el-option
                    v-for="(item , idx) in supplierSelectOptions"
                    :label="item.name"
                    :value="item.id"
                    :key="idx"
                  ></el-option>
                </el-select>

                <el-tooltip class="item" effect="light" content="产品供货商，从哪个厂商采购。" placement="right">
                  <i class="el-icon-question">&nbsp;</i>
                </el-tooltip>
              </el-form-item>
            </el-col>

            <el-col :md="8">
              <el-form-item label="收货仓库" prop="warehouseId">
                <el-select v-model="editObject.warehouseId" size="mini"
                           filterable placeholder="请选择收货仓库">
                  <el-option
                    v-for="(item , idx)  in warehouseSelectOptions"
                    :label="item.name"
                    :value="item.id"
                    :key="idx"
                  ></el-option>
                </el-select>

                <el-tooltip class="item" effect="light" content="采购的商品接收的仓库" placement="right">
                  <i class="el-icon-question">&nbsp;</i>
                </el-tooltip>
              </el-form-item>
            </el-col>

            <el-col :md="8">
              <el-form-item label="名称" prop="name">
                <el-input v-model.trim="editObject.name"
                          maxlength="100"
                          show-word-limit
                          size="mini"
                          style="width: 200px" placeholder="请填写名称" clearable></el-input>

                <el-tooltip class="item" effect="light" content="采购单名称默认使用计划名称" placement="right">
                  <i class="el-icon-question">&nbsp;</i>
                </el-tooltip>
              </el-form-item>
            </el-col>

          </el-row>

          <el-row>
            <el-col :md="8">
              <el-form-item label="结算方式" prop="settlementMethod">
                <el-select v-model="editObject.settlementMethod" @change="onSettlementMethodChange" size="mini"
                           filterable placeholder="请选择结算方式">
                  <el-option
                    v-for="(item , idx)  in settlementMethodSelectOptions"
                    :label="item.label"
                    :value="item.value"
                    :key="idx"
                  ></el-option>
                </el-select>

                <el-tooltip class="item" effect="light" content="采购单的结算方式。货到付款方式不用走预付款流程。" placement="right">
                  <i class="el-icon-question">&nbsp;</i>
                </el-tooltip>
              </el-form-item>
            </el-col>

            <el-col :md="8">
              <el-form-item label="结算货币" prop="currencyId">
                <el-select v-model="editObject.currencyId" @change="onCurrencyChange" size="mini"
                           filterable placeholder="请选择结算货币">
                  <el-option
                    v-for="(item , idx)  in currencySelectOptions"
                    :label="item.name"
                    :value="item.id"
                    :key="idx"
                  ></el-option>
                </el-select>

                <el-tooltip class="item" effect="light" content="使用什么货币跟供货商进行结算。" placement="right">
                  <i class="el-icon-question">&nbsp;</i>
                </el-tooltip>
              </el-form-item>
            </el-col>

            <el-col :md="8">
              <el-form-item label="帐期" prop="accountPeriod">
                <el-input-number v-model="editObject.accountPeriod"
                                 @change="onAccountPeriodChange"
                                 style="width: 155px"
                                 :min="1"
                                 :step="1"
                                 :max="365" size="mini" label="帐期">
                </el-input-number>
                天
                <el-tooltip class="item" effect="light" content="生产商、批发商向零售商供货后，直至零售商付款的这段时间周期" placement="right">
                  <i class="el-icon-question">&nbsp;</i>
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :md="24">
              <el-form-item label="预计交货日期" prop="otdTime">
                <el-date-picker
                  v-model="editObject.otdTime"
                  type="date"
                  size="mini"
                  placeholder="选择日期">
                </el-date-picker>

                <el-tooltip class="item" effect="light" content="采购单预计在该日期前完成" placement="right">
                  <i class="el-icon-question">&nbsp;</i>
                </el-tooltip>
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

        <el-table-column prop="product.imgUrl" label="图片" width="40" >
          <template slot-scope="scope" v-if="scope.row.product.imgUrl">
            <el-image
              :z-index="10000"
              style="width: 30px; height: 30px;margin-top: 5px"
              :src="scope.row.product.imgUrl"
              :preview-src-list="[scope.row.product.imgUrl.replace('_SL75_','_SL500_')]" lazy>
            </el-image>
          </template>
        </el-table-column>

        <el-table-column prop="product.supplier.name" label="供货商" width="100"></el-table-column>

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

        <el-table-column prop="cartonQty" label="计划箱数" width="110"></el-table-column>
        <el-table-column prop="orderCartonQty" label="已下箱数" width="80"></el-table-column>
        <el-table-column prop="noPurchaseOrderCartonQty" label="未下箱数" width="80"></el-table-column>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>

        <el-table-column prop="purchaseOrderCartonQty" label="本次采购箱数" width="100"
                         fixed="right"></el-table-column>

        <el-table-column prop="purchaseOrderQty" label="采购件数" width="80"
                         fixed="right"></el-table-column>

        <el-table-column prop="product.price" label="单价" width="80"
                         fixed="right">
          <template slot-scope="scope">
            {{scope.row.product.price ? scope.row.product.price : 0, selCurrency ? selCurrency.symbolLeft : '' |
            currency}}
          </template>
        </el-table-column>

        <el-table-column prop="purchaseOrderAmount" label="总额" width="100"
                         fixed="right">
          <template slot-scope="scope">
            {{scope.row.purchaseOrderAmount ? scope.row.purchaseOrderAmount : 0, selCurrency ? selCurrency.symbolLeft :
            '' | currency}}
          </template>
        </el-table-column>


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
          <el-button type="primary" style="margin-top: 15px" :loading="confirmLoading" size="mini"  @click="onSave"
                     v-if="hasEdit">
            下单
          </el-button>
        </el-row>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import {currency, intArrToStrArr} from '@/utils'
  import phEnumModel from '@/api/phEnum'
  import currencyModel from '@/api/currency'
  import planDetailDialog from './planDetailDialog'

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
        return true;
      },
      hasDelete() {
        return true;
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
        settlementMethodSelectOptions: [],
        currencySelectOptions: [],
        selCurrency: {},

        // 编辑对象 TODO
        editObject: {
          id: null,
          supplierId: null,
          warehouseId: null,
          settlementMethod: null,
          currencyId: null,
          accountPeriod: null,
          otdTime: null,
        },

        // 字段验证规则 TODO:
        rules: {
          supplierId: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          warehouseId: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          settlementMethod: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          currencyId: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          accountPeriod: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
        },

        //数据
        url: "/procurementPlanItems", // 资源URL
        downloadUrl: "", //下载Url
        filters: [
          {
            field: "procurementPlanId",
            op: 'eq',
            data: this.primary ? this.primary.id : -1
          }
        ],   //搜索对象
        relations: ["cartonSpec", "product", "product.currency", "product.supplier"],  // 关联对象
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
          this.editObject = JSON.parse(JSON.stringify(this.primary));
          //转化时间
          this.editObject.limitTime = this.editObject.formatLimitTime;
          this.editObject.executeTime = this.editObject.formatExecuteTime;
          //转化分类
          this.editObject.categoryId = intArrToStrArr(this.editObject.categoryId);
          this.editObject.warehouseId = null;
          this.editObject.accountPeriod = 60;
          this.editObject.settlementMethod = '3';
          // 付款方式
          this.settlementMethodSelectOptions = phEnumModel.getSelectOptions('SettlementMethod');
          this.initCurrencData();
          this.initSupplierData();
          this.initWarehouseData();
          this.getList();

          this.loading = false;
        }
        else {
          this.$message.error("无效的采购计划!");
          this.loading = false;
        }
      },

      // 初始化供货商数据
      initSupplierData() {
        this.loading = true;
        let url = `/procurementPlans/${this.primary.id}/suppliers`;
        this.global.axios.get(url)
          .then(resp => {
            let res = resp.data || [];
            this.supplierSelectOptions = [];
            res.forEach(r => {
              this.supplierSelectOptions.push(r);
            })

            this.loading = false;
          })
          .catch(err => {
            this.loading = false;
          })
      },

      // 初始化仓库数据
      initWarehouseData() {
        this.loading = true;
        let url = "/warehouses";
        let filters = [
          {"field": "status", "op": "eq", "data": "1"},
          {"field": "type", "op": "in", "data": "普通,原料仓,工厂仓"}
        ];
        url += "?filters=" + JSON.stringify({"groupOp": "AND", "rules": filters});

        this.global.axios.get(url)
          .then(resp => {
            let res = resp.data || [];
            this.warehouseSelectOptions = [];
            res.forEach(r => {
              this.warehouseSelectOptions.push(r);
            });
            this.loading = false;
          })
          .catch(err => {
            this.loading = false;
          });
      },

      // 初始化货币数据
      initCurrencData() {
        this.loading = true;
        currencyModel.getCurrencies()
          .then(resp => {
            let res = resp || [];
            this.currencySelectOptions = [];
            res.forEach(r => {
              this.currencySelectOptions.push(r);
            });
            this.loading = false;
          })
          .catch(err => {
            this.loading = false;
          });
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
              // 默认使用未下单的箱数，作为要采购的箱数
              r.purchaseOrderCartonQty = r.noPurchaseOrderCartonQty;
              // 默认采购件
              r.purchaseOrderQty = r.purchaseOrderCartonQty * r.numberOfCarton;

              // 默认使用未下单的总金额，作为要采购的总金额
              r.purchaseOrderAmount = r.noPurchaseOrderAmount;

              if (r.product && r.product.currency && !this.editObject.currencyId) {
                this.editObject.currencyId = r.product.currency.id;
                this.selCurrency = JSON.parse(JSON.stringify(r.product.currency));
              }
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
        // 产品无价格
        if (!row.product || !row.product.price) {
          return 'danger-row';
        }
        // 产品无装箱数
        if (!row.numberOfCarton) {
          return 'danger-row';
        }
        // 产品无箱规
        if (!row.cartonSpecId || row.cartonSpecId == -1) {
          return 'danger-row';
        }
        // 产品无供货商
        if (!row.supplierId) {
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
            || column.property == 'noPurchaseOrderCartonQty'
            || column.property == 'purchaseOrderCartonQty') {
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

          if (column.property == 'purchaseOrderQty') {
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

          if (column.property == 'purchaseOrderAmount') {
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
              sums[index] = currency(sums[index], this.selCurrency ? this.selCurrency.symbolLeft : null);
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
        if (this.editObject.supplierId != null && this.editObject.supplierId != '') {
          this.tableData = this.tableData.filter(
            item => {
              if (item.supplierId == this.editObject.supplierId) {
                return true;
              }
            });
        }
      },

      /* 修改货币 */
      onCurrencyChange(val) {
        this.currencySelectOptions.forEach(r => {
          if (val == r.id) {
            this.selCurrency = r;
          }
        });
        this.$forceUpdate();
      },

      /* 修改供货商 */
      onSupplierChange(val) {
        this.search();
        this.$forceUpdate();
      },
      /* 修改结算方式 */
      onSettlementMethodChange() {
        this.$forceUpdate();
      },
      /* 帐期修改 */
      onAccountPeriodChange() {
        this.$forceUpdate();
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
          this.tableData.forEach(r => {
            // 产品无价格
            if (!r.product || !r.product.price) {
              msg += `产品${r.product.skuCode}价格必须输入!\n`;
            }
            // 产品无装箱数
            if (!r.numberOfCarton) {
              msg += `产品${r.product.skuCode}装箱数必须输入!\n`;
            }
            // 产品无箱规
            if (!r.cartonSpecId || r.cartonSpecId == -1) {
              msg += `产品${r.product.skuCode}箱规不正确! 如不确定箱规可以箱规可以选择Undefined。\n`;
            }
            // 产品无供货商
            if (!r.supplierId) {
              msg += `产品${r.product.skuCode}必须选择供货商。\n`;
            }
            // 无采购箱数
            // if (!r.purchaseOrderQty) {
            //   msg += `产品${r.product.skuCode}必须选择设置采购箱数。\n`;
            // }
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
        this.$refs.planDetailDialog.openDialog(JSON.parse(JSON.stringify(row)), JSON.parse(JSON.stringify(this.selCurrency)));
      },
      /* 保存明细回调 */
      modifyDetailCBEvent(row) {
        this.data.forEach((item, index, arr) => {
          if (item.id == row.id) {
            arr[index] = row;
          }
        });
        let hasSupplier = false;
        this.supplierSelectOptions.forEach((item, index, arr) => {
          if (item.id == row.supplierId) {
            hasSupplier = true;
          }
        });
        if (hasSupplier == false) {
          this.supplierSelectOptions.push({id: row.supplierId, name: row.supplierName});
        }
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
        let _order = {};
        _order.procurementPlanId = this.editObject.id;
        _order.supplierId = this.editObject.supplierId;
        _order.warehouseId = this.editObject.warehouseId;
        _order.settlementMethod = this.editObject.settlementMethod;
        _order.currencyId = this.editObject.currencyId;
        _order.accountPeriod = this.editObject.accountPeriod;
        _order.name = this.editObject.name;
        _order.otdTime = this.editObject.otdTime;

        let _details = [];
        this.tableData.forEach(r => {
          if (r.purchaseOrderCartonQty > 0) {
            let _detail = {};
            _detail.productId = r.productId;
            _detail.cartonSpecId = r.cartonSpecId;
            _detail.numberOfCarton = r.numberOfCarton;
            _detail.cartonQty = r.purchaseOrderCartonQty;
            _detail.skuCode = r.product.skuCode;
            _detail.price = r.product.price;
            _detail.supplierId=_order.supplierId;
            _detail.otdTime=_order.otdTime;
            _details.push(_detail);
          }
        });
        _order.orderItems = _details;

        const loading = this.$loading({
          lock: true,
          text: '下单中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        this.global.axios.post('/procurementOrders', _order)
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
