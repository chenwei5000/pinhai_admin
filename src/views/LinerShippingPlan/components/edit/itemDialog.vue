<template>

  <el-dialog :title="dialogTitle"
             append-to-body
             v-if="dialogVisible"
             width="85%"
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
            <el-form-item label="销售渠道" prop="merchantId">
              <el-select v-model="detailItem.merchantId"
                         style="width: 200px"
                         filterable
                         size="mini"
                         placeholder="请选择销售渠道">
                <el-option
                  v-for="(item , idx)  in merchantSelectOptions"
                  :label="item.label"
                  :value="item.value"
                  :key="idx"
                ></el-option>
              </el-select>

              <el-tooltip class="item" effect="light" content="以选定的销售渠道（销售店铺）的销售情况为发柜依据。" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>


          <el-col :md="14">
            <el-form-item label="销售覆盖时间" prop="soldOutTime">
              <el-date-picker
                v-model="detailItem.soldOutTime"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                type="date"
                style="width: 200px"
                size="mini"
                placeholder="销售覆盖时间"></el-date-picker>

              <el-tooltip class="item" effect="light" content="产品预期的销售截止日期" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
              <span v-if="detailItem.soldOutTime" style="font-size: 12px;">距离开船日{{soldOutTimeWeek}}周</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="10">
            <el-form-item label="SKU" prop="skuCode">
              <el-input v-model.trim="detailItem.skuCode"
                        maxlength="50"
                        show-word-limit
                        style="width: 200px" placeholder="请填写SKU" clearable></el-input>

              <el-tooltip class="item" effect="light" content="输入产品SKU编码" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :md="14">
            <el-form-item label="出口箱数" prop="cartonQty">

              <el-input-number v-model="detailItem.cartonQty"
                               :precision="3"
                               :min="0"
                               :step="1"
                               style="width: 200px"
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
                         style="width: 200px"
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
                        style="width: 200px" placeholder="请填写装箱数" clearable></el-input>

              <el-tooltip class="item" effect="light" content="一箱有多少个产品.不输入使用产品上默认的装箱数" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="10">
            <el-form-item label="7日销量（件)" prop="sevenSalesCount">
              <el-input v-model.trim="detailItem.sevenSalesCount"
                        style="width: 200px" placeholder="请填写7日销量，件数" clearable></el-input>

              <el-tooltip class="item" effect="light" content="7日销售件数, 不能修改。可以去销售设置中调整。" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>

            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="亚马逊库存(件)" prop="inStockQty">

              <el-input v-model.trim="detailItem.inStockQty"
                        style="width: 200px" placeholder="亚马逊库存件数" readonly clearable></el-input>

              <el-tooltip class="item" effect="light" content="亚马逊在仓库的库存件数，不能修改" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>

            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="10">
            <el-form-item label="有效库存(件)" prop="validateStockQty">
              <el-input v-model.trim="detailItem.validateStockQty"
                        style="width: 200px" placeholder="有效库存件数" clearable></el-input>

              <el-tooltip class="item" effect="light" content="预计货柜到亚马逊时，仓库中能销售的库存数量" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>

            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="国内库存(箱)" prop="domesticStockCartonQty">
              <el-input v-model.trim="detailItem.domesticStockCartonQty"
                        style="width: 200px" placeholder="国内库存，箱数" clearable></el-input>

              <el-tooltip class="item" effect="light" content="国内仓库库存箱数，不能修改" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>

            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :md="24" v-if="detailItem.domesticStocksStr">
            <el-form-item label="国内库存明细(箱)">
              <div style="font-size: 12px" v-html="br(detailItem.domesticStocksStr)"></div>
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
  import {currency, parseLineBreak} from '@/utils'
  import cartonspecModel from '@/api/cartonspec'
  import validRules from '@/components/validRules'
  import merchantModel from '@/api/merchant'
  import moment from 'moment';

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
          return "添加出口计划明细";
        }
        else {
          return "修改出口计划明细";
        }
      },

      soldOutTimeWeek() {
        if (this.detailItem.soldOutTime && this.primary.etdTime) {
          let soldOutTime = new Date(this.detailItem.soldOutTime);
          return (parseInt((soldOutTime - this.primary.etdTime) / 1000 / 60 / 60 / 24) / 7).toFixed(2);
        }
        else {
          return false
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
        url: "/linerShippingPlanItems",
        relations: ["product"],  // 关联对象
        //明细对象ID
        detailItemId: null,
        //明细对象
        detailItem: {},

        cartonspecSelectOptions: [],
        merchantSelectOptions: [],

        // 字段验证规则 TODO:
        rules: {
          merchantId: [
            validRules.required
          ],
          skuCode: [
            validRules.required
          ],
          cartonQty: [
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
      br(text) {
        return parseLineBreak(text);
      },
      /********************* 基础方法  *****************************/
      //初始化加载数据 TODO:根据实际情况调整
      initData() {
        //获取数据
        // 箱规
        this.cartonspecSelectOptions = cartonspecModel.getSelectOptions();
        this.merchantSelectOptions = merchantModel.getSelectOptions();

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
              //console.log(this.detailItem.soldOutTime);
              this.detailItem.soldOutTime =
                this.detailItem.soldOutTime ? moment(this.detailItem.soldOutTime).format("YYYY-MM-DD") : null;
              this.loading = false;
            })
        }
        else {
          // 设置添加默认值
          this.detailItem = {
            skuCode: '',
            cartonSpecId: null,
            numberOfCarton: null,
            cartonQty: 0,
            qty: 0,
            soldOutTime: null,
            linerShippingPlanId: this.primary.id
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
        this.detailItem = null;
        this.cartonspecSelectOptions = [];
      },

      onQtyChange(val) {
        if (this.detailItem) {
          let numberOfCarton = this.detailItem.numberOfCarton || 1;
          this.detailItem.qty = (this.detailItem.cartonQty * numberOfCarton).toFixed(0);
        }
      },
      onLoadProduct() {
        this.$refs.detailItem.validate(valid => {
          if (!valid) {
            return false
          }
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
              try {
                url = `/amazonStocks/shippings/${this.detailItem.merchantId}`;
                url += "?warehouse=" + this.primary.domesticStockWarehouses  //出货仓库
                  + "&pids=" + data.id    //产品
                  + "&category=" + data.categoryId //分类
                  + "&etdTime=" + this.primary.formatEtdTime      //发柜时间
                  + "&shipmentType=" + this.primary.type    //物流类型
                  + "&portOfLoading=" + this.primary.portOfLoading  //出货港口
                  + "&toWarehouse=" + this.primary.toWarehouse.address;      //收货区域

                if (this.primary.groupName) {
                  url += "&group=" + this.primary.groupName.join(",");  //销售覆盖时间
                }
                if (this.detailItem.soldOutTime) {
                  url += "&vip0SoldOutTime=" + this.detailItem.soldOutTime;  //销售覆盖时间
                  url += "&vip1SoldOutTime=" + this.detailItem.soldOutTime;  //销售覆盖时间
                  url += "&vip2SoldOutTime=" + this.detailItem.soldOutTime;  //销售覆盖时间
                }
              } catch (e) {
                console.log(e);
              }

              this.global.axios
                .get(url)
                .then(resp => {
                  let res = resp.data;
                  let data = res || [];
                  data.forEach(row => {
                    if (row.skuCode == this.detailItem.skuCode) {
                      this.detailItem.cartonQty = row.replenishmentCartonQty;
                      this.detailItem.safetyWeek = row.safetyWeek;
                      this.detailItem.logisticsWeek = row.logisticsWeek;
                      this.detailItem.sevenSalesCount = row.sevenAmendQty;
                      this.detailItem.inStockQty = row.inStockQty;
                      this.detailItem.validateStockQty = row.validateStockQty;
                      this.detailItem.domesticStockQty = row.domesticStockQty;
                      this.detailItem.domesticStockCartonQty = row.domesticStockCartonQty;
                      this.detailItem.unfinishedPlanCartonQty = row.unfinishedPlanCartonQty;
                      this.detailItem.domesticStocks = JSON.stringify(row.warehouseStocks);
                      this.detailItem.domesticStocksStr = row.domesticStocks;
                      this.detailItem.qty = (this.detailItem.cartonQty * this.detailItem.numberOfCarton).toFixed(0);
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
        })
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
          if (this.detailItemId != null && this.detailItemId > 0) {
            method = 'put';
            url = `${this.url}/${this.detailItemId}`;
          }
          //转义字段
          let _object = JSON.parse(JSON.stringify(this.detailItem));
          _object.linerShippingPlanId = this.primary.id;
          _object.domesticStockQty = null;

          this.global.axios[method](url, _object)
            .then(resp => {
              this.$message.info("修改成功");
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

