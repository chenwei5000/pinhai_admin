<template>

  <el-dialog :title="dialogTitle"
             append-to-body
             v-if="dialogVisible"
             width="70%"
             top="10vh"
             @close='closeDialog'
             :visible.sync="dialogVisible">

    <div class="ph-form">
      <!-- 编辑表单 TODO:-->
      <el-form :rules="rules" :model="detailItem" status-icon inline
               ref="detailItem" label-position="right"
               label-width="120px"
               inline-message
               v-loading="loading" size="mini"
      >
        <el-row>
          <el-col :md="10">
            <el-form-item label="SKU" prop="skuCode">
              <el-input v-model.trim="detailItem.skuCode"
                        maxlength="50"
                        show-word-limit
                        style="width: 160px" placeholder="请填写SKU" clearable></el-input>

              <el-tooltip class="item" effect="light" content="输入产品SKU编码" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="采购箱数" prop="cartonQty">

              <el-input-number v-model="detailItem.cartonQty"
                               :precision="0"
                               :min="0"
                               :step="1"
                               style="width: 160px"
                               @change="onQtyChange"
                               :max="100000" label="采购箱数">

              </el-input-number>

              <el-tooltip class="item" effect="light" content="按箱采购，请输入箱数！" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="10">
            <el-form-item label="箱规" prop="cartonSpecId">

              <el-select filterable
                         v-model="detailItem.cartonSpecId"
                         style="width: 160px"
                         placeholder="外箱包装材料规格,可筛选">
                <el-option
                  v-for="(item,idx) in cartonspecSelectOptions"
                  :label="item.label" :value="item.value"
                  :key="idx"
                ></el-option>
              </el-select>

              <el-tooltip class="item" effect="light" content="产品外箱包装材料规格。不输入使用产品上默认的箱规" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="装箱数" prop="numberOfCarton">

              <el-input v-model.trim="detailItem.numberOfCarton"
                        @change="onQtyChange"
                        style="width: 160px" placeholder="请填写装箱数" clearable></el-input>

              <el-tooltip class="item" effect="light" content="一箱有多少个产品.不输入使用产品上默认的装箱数" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="10">
            <el-form-item label="备货周数" prop="safetyStockWeek">
              <el-input-number v-model="detailItem.safetyStockWeek"
                               style="width: 160px"
                               :precision="0"
                               :min="1"
                               :step="1"
                               :disabled = true
                               :max="52" label="备货周数">
              </el-input-number>

              <el-tooltip class="item" effect="light" content="产品希望支持销售的周数。" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>

            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="可售周数" prop="saleWeek">
              <span style="font-size:12px">{{detailItem.saleWeek}}周</span>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :md="10">
            <el-form-item label="7日销量(件)" prop="sevenSalesCount">
              <el-input v-model.trim="detailItem.sevenSalesCount"
                        style="width: 160px" placeholder="请填写7日销量，件数" clearable></el-input>

              <el-tooltip class="item" effect="light" content="7日销售件数, 不能修改。可以去销售设置中调整。" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>

            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="亚马逊含在途(件)" prop="amazonTotalStock">

              <el-input v-model.trim="detailItem.amazonTotalStock"
                        style="width: 160px" readonly clearable></el-input>

              <el-tooltip class="item" effect="light" content="亚马逊含在途库存件数，不能修改" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>

            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :md="10">
            <el-form-item label="国内库存(箱)" prop="domesticStockCartonQty">
              <el-input v-model.trim="detailItem.domesticStockCartonQty"
                        style="width: 160px" placeholder="国内库存，箱数" clearable readonly></el-input>

              <el-tooltip class="item" effect="light" content="国内仓库库存箱数，不能修改" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>

            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="国内在途(箱)" prop="unfinishedPlanCartonQty">
              <el-input v-model.trim="detailItem.unfinishedPlanCartonQty"
                        style="width: 160px" placeholder="国内在途，箱数" clearable readonly></el-input>
              <el-tooltip class="item" effect="light" content="未完成采购计划箱数" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>

            </el-form-item>
          </el-col>

        </el-row>

      </el-form>
      <hr/>

      <div style="text-align: right">
        共采购: {{detailItem.cartonQty}}箱，{{detailItem.qty}}件
      </div>

    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="warning" @click="onLoadProduct" size="mini" :loading="confirmLoading">获取产品信息</el-button>
      <el-button type="primary" @click="onSave" :loading="confirmLoading" size="mini">保 存</el-button>
      <el-button @click="closeDialog" size="mini">取 消</el-button>
    </div>


  </el-dialog>

</template>

<script>
  import cartonspecModel from '@/api/cartonspec'
  import phEnumModel from '@/api/phEnum'
  import validRules from '@/components/validRules'

  export default {
    components: {},
    props: {
      primary: {
        type: [Object],
        default: null
      }
    },
    computed: {
      dialogTitle() {
        if (this.detailItemId == null) {
          return "添加采购计划明细";
        }
        else {
          return "修改采购计划明细";
        }
      },
      hasEdit() {
        // 控制按钮
        if ([0, 8].indexOf(this.primary.status) > -1) {
          return false;
        }
        else {
          return true;
        }
      }
    },

    data() {
      return {
        //Dialog 是否开启
        dialogVisible: false,
        // 表单加载状态
        loading: false,
        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,

        // 资源URL
        url: "/procurementPlanItems",
        relations: ["product"],  // 关联对象
        //明细对象ID
        detailItemId: null,
        //明细对象
        detailItem: {},

        cartonspecSelectOptions: [],
        prioritySelectOptions: [],

        // 字段验证规则 TODO:
        rules: {
          skuCode: [
            validRules.required
          ],
          cartonQty: [
            validRules.required
          ],
          priority: [
            validRules.required
          ],
          numberOfCarton: [
            validRules.integer
          ],
          sevenSalesCount: [
            validRules.number
          ],
          amazonTotalStock: [
            validRules.number
          ],
          domesticStockCartonQty: [
            validRules.number
          ],
          unfinishedPlanCartonQty: [
            validRules.number
          ]
        },
      }
    },

    created() {
    },

    mounted() {
      this.$nextTick(() => {
      });
    },

    methods: {
      /********************* 基础方法  *****************************/
      //初始化加载数据 TODO:根据实际情况调整
      initData() {
        //获取数据
        // 箱规
        this.cartonspecSelectOptions = cartonspecModel.getSelectOptions();

        // 优先级
        this.prioritySelectOptions = phEnumModel.getSelectOptions('Priority');

        // 明细数据
        if (this.detailItemId) {
          this.loading = true
          let url = `${this.url}/${this.detailItemId}`;
          if (this.relations && this.relations.length > 0) {
            url += "?relations=" + JSON.stringify(this.relations);
          }
          this.global.axios
            .get(url)
            .then(resp => {
              let res = resp.data
              let data = res || {}
              this.detailItem = data
              // 转字段
              this.detailItem.cartonSpecId = data.cartonSpecId + '';
              this.detailItem.priority = data.priority + '';

              this.loading = false
            })
        }
        else {
          // 设置添加默认值
          this.detailItem = {
            skuCode: '',
            priorityNote: '',
            cartonSpecId: null,
            priority: '2',
            safetyStockWeek: 10,
            numberOfCarton: null,
            cartonQty: 0,
            qty: 0,
            procurementPlanId: this.primary.id
          }

        }
      },

      /* 开启弹出编辑框 需要传明细ID */
      openDialog(detailItemId) {
        this.detailItemId = detailItemId;
        this.dialogVisible = true;
        this.initData();
      },
      closeDialog() {
        this.dialogVisible = false;
        this.loading = false;
        this.confirmLoading = false;
        this.detailItemId = null;
        this.detailItem = {
          skuCode: '',
          priorityNote: '',
          cartonSpecId: null,
          priority: '2',
          safetyStockWeek: 10,
          numberOfCarton: null,
          cartonQty: 0,
          qty: 0,
          procurementPlanId: this.primary.id
        };
        this.cartonspecSelectOptions = [];
        this.prioritySelectOptions = [];
      },

      onQtyChange(val) {
        if (this.detailItem) {
          //可售周数 = （亚马逊总库存 + 国内库存 + 未完成采购计划数 + 应备货件数） /（7日销量修正）
          let amazonTotalStock = this.detailItem.amazonTotalStock || 0;
          let domesticStockCartonQty = this.detailItem.domesticStockCartonQty || 0;
          let unfinishedPlanCartonQty = this.detailItem.unfinishedPlanCartonQty || 0;
          let numberOfCarton = this.detailItem.numberOfCarton || 1;
          let total = amazonTotalStock + (domesticStockCartonQty * numberOfCarton)
            + (unfinishedPlanCartonQty * numberOfCarton) + (val * numberOfCarton);

          if (this.detailItem.sevenSalesCount) {
            this.detailItem.saleWeek = (total / this.detailItem.sevenSalesCount).toFixed(1);
          }

          this.detailItem.qty = this.detailItem.cartonQty * numberOfCarton;
        }
      },
      onLoadProduct() {
        if (!this.detailItem.skuCode) {
          this.$message.error("请输入产品SKU");
        }
        else {
          this.loading = true;
          this.confirmLoading = true;
          let url = `/products/sku/${this.detailItem.skuCode}`;
          this.global.axios
            .get(url)
            .then(resp => {
              let res = resp.data;
              let data = res || {};

              // 转字段
              this.detailItem.product = data;
              this.detailItem.cartonSpecId = data.cartonSpecId + '';
              this.detailItem.numberOfCarton = data.numberOfCarton;

              url = `/amazonStocks/plans/${this.primary.merchantId}?warehouse=${this.primary.warehouseId}&pids=${data.id}&safetyStockWeek=${this.primary.safetyStockWeek}&vip1SafetyStockWeek=${this.primary.vip1SafetyStockWeek}&vip2SafetyStockWeek=${this.primary.vip2SafetyStockWeek}&exclude=${this.primary.handleMethod}`;
              this.global.axios
                .get(url)
                .then(resp => {
                  let res = resp.data;
                  let data = res || [];
                  data.forEach(row => {
                    if (row.skuCode == this.detailItem.skuCode) {
                      //this.detailItem.cartonQty = row.replenishmentCartonPlanQty;
                      this.detailItem.safetyStockWeek = row.safetyWeek;
                      this.detailItem.saleWeek = row.saleWeek;
                      this.detailItem.sevenSalesCount = row.sevenAmendQty;
                      this.detailItem.amazonTotalStock = row.totalQty;
                      this.detailItem.domesticStockCartonQty = row.domesticStockCartonQty;
                      this.detailItem.unfinishedPlanCartonQty = row.unfinishedPlanCartonQty;
                    }
                  });
                  this.loading = false;
                  this.confirmLoading = false;
                })
                .catch(err => {
                  this.loading = false;
                  this.confirmLoading = false;
                });
            })
            .catch(err => {
            });

        }
      },

      // 保存
      onSave() {
        this.$refs.detailItem.validate(valid => {
          if (!valid) {
            return false
          }
          this.loading = true;
          this.confirmLoading = true;
          let method = 'post'
          let url = this.url + '';
          if (this.detailItemId && this.detailItemId > 0) {
            method = 'put';
            url = `${this.url}/${this.detailItemId}`;
          }

          //转义字段
          let _object = JSON.parse(JSON.stringify(this.detailItem));
          _object.unfinishedPlanQty = null;
          _object.domesticStockQty = null;

          this.global.axios[method](url, _object)
            .then(resp => {
              this.$message.success("修改成功");
              this.loading = false;
              this.confirmLoading = false;
              this.dialogVisible = false;
              this.$emit("modifyCBEvent", resp.data);
            })
            .catch(err => {
              this.loading = false;
              this.confirmLoading = false;
            })
        })
      }
    }
  }
</script>

<style type="text/less" lang="scss" scoped>


</style>

