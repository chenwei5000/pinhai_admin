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

      <el-row>
        <el-col :md="12">
          <el-form-item :label="newObject.type=='空运'? '航班时间' : '开船时间'" prop="etdTime">
            <el-date-picker
              size="mini"
              v-model="newObject.etdTime"
              type="datetime"
              @input="updateInput"
              @change="loadOtdTime"
              style="width: 200px"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>

        </el-col>

        <el-col :md="12">
          <el-form-item label="预计到港时间" prop="otdTime" ref="otdTime" v-if="newObject.otdTime">
            <span style="font-size: 12px">{{newObject.otdTime.time}},距离开船日{{newObject.otdTime.week}}周</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>

        <el-col :md="12">
          <el-form-item label="分类" prop="categoryId">
            <el-select
              v-model="newObject.categoryId"
              size="mini"
              style="width: 200px"
              @input="updateInput"
              @change="changeCategory"
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

        <el-col :md="12">
          <el-form-item label="运输方式" prop="type">
            <el-select
              v-model="newObject.type"
              size="mini"
              @input="updateInput"
              @change="loadOtdTime"
              style="width: 200px"
              placeholder="请选择">
              <el-option label="海运" value="海运"></el-option>
              <el-option label="空运" value="空运"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :md="12">
          <el-form-item :label="newObject.type=='空运'? '发货机场' : '发货港口'" prop="portOfLoading">
            <el-select
              v-model="newObject.portOfLoading"
              size="mini"
              style="width: 200px"
              @input="updateInput"
              @change="loadOtdTime"
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

        <el-col :md="12">
          <el-form-item label="收货区域" prop="address">
            <el-select
              v-model="newObject.address"
              size="mini"
              style="width: 200px"
              filterable
              @change="loadOtdTime"
              placeholder="请选择">
              <el-option
                key="美东"
                label="美东"
                value="美东"
              ></el-option>
              <el-option
                key="美西"
                label="美西"
                value="美西"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :md="12">
          <el-form-item label="下次发柜时间" prop="nextDeliveryTime" ref="nextDeliveryTime">
            <el-date-picker
              size="mini"
              v-model="newObject.nextDeliveryTime"
              type="datetime"
              style="width: 200px"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :md="12">
          <el-form-item label="销售渠道" prop="merchantId">
            <el-select v-model="newObject.merchantId"
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
      </el-row>

      <el-row>
        <el-col :md="12">
          <el-form-item label="库存来源" prop="warehouseId">
            <el-select v-model="newObject.warehouseId" style="width: 200px"
                       size="mini"
                       filterable multiple
                       placeholder="请选择库存,可多选">
              <el-option
                v-for="(item , idx)  in warehouseSelectOptions"
                v-if="item.value > 0"
                :label="item.label"
                :value="item.value"
                :key="idx"
              ></el-option>
            </el-select>

            <el-tooltip class="item" effect="light" content="以选定的仓库库存情况为当前库存依据。" placement="right">
              <i class="el-icon-question">&nbsp;</i>
            </el-tooltip>

          </el-form-item>
        </el-col>

        <el-col :md="12">
          <el-form-item label="产品款式" prop="groupName">
            <el-select v-model="newObject.groupName" style="width: 200px"
                       size="mini"
                       filterable multiple
                       placeholder="请选择产品款式,可多选">
              <el-option
                v-for="(item , idx)  in groupSelectOptions"
                :label="item.label"
                :value="item.value"
                :key="idx"
              ></el-option>
            </el-select>

            <el-tooltip class="item" effect="light" content="以选定的仓库库存情况为当前库存依据。" placement="right">
              <i class="el-icon-question">&nbsp;</i>
            </el-tooltip>

          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :md="12">
          <el-form-item label="Vip0销售覆盖时间" prop="vip0SoldOutTime">
            <el-date-picker
              v-model="newObject.vip0SoldOutTime"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="date"
              style="width: 200px"
              size="mini"
              placeholder="Vip0销售覆盖时间"></el-date-picker>

            <el-tooltip class="item" effect="light" content="普通产品预期的销售截止日期" placement="right">
              <i class="el-icon-question">&nbsp;</i>
            </el-tooltip>
            <span v-if="vip0SoldOutTimeWeek" style="font-size: 12px;">距离开船日{{vip0SoldOutTimeWeek}}周</span>
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="Vip1销售覆盖时间" prop="vip1SoldOutTime">
            <el-date-picker
              v-model="newObject.vip1SoldOutTime"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="date"
              style="width: 200px"
              size="mini"
              placeholder="Vip1销售覆盖时间"></el-date-picker>

            <el-tooltip class="item" effect="light" content="热卖产品预期的销售截止日期" placement="right">
              <i class="el-icon-question">&nbsp;</i>
            </el-tooltip>
            <span v-if="vip1SoldOutTimeWeek" style="font-size: 12px;">距离开船日{{vip1SoldOutTimeWeek}}周</span>
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="Vip2销售覆盖时间" prop="vip2SoldOutTime">
            <el-date-picker
              v-model="newObject.vip2SoldOutTime"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="date"
              style="width: 200px"
              size="mini"
              placeholder="Vip2销售覆盖时间"></el-date-picker>

            <el-tooltip class="item" effect="light" content="爆款产品预期的销售截止日期" placement="right">
              <i class="el-icon-question">&nbsp;</i>
            </el-tooltip>
            <span v-if="vip2SoldOutTimeWeek" style="font-size: 12px;">距离开船日{{vip2SoldOutTimeWeek}}周</span>
          </el-form-item>
        </el-col>

        <el-col :md="12">
          <el-form-item label="排除国内无库存商品" prop="exclude">
            <el-radio-group
              @input="updateInput"
              v-model.number="newObject.exclude"
              size="mini">
              <el-radio-button label="1" value="1">是</el-radio-button>
              <el-radio-button label="0" value="0">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :md="24">
          <el-row type="flex" justify="center">
            <el-button style="margin-top: 15px"
                       size="mini"
                       :loading="confirmLoading" @click="onDownload">
              下载数据
            </el-button>

            <el-button type="primary" style="margin-top: 15px"
                       size="mini"
                       :loading="confirmLoading" @click="onSmart">
              下一步
            </el-button>
          </el-row>
        </el-col>
      </el-row>

    </el-form>
  </div>
</template>

<script>
  import validRules from '@/components/validRules'
  import excelSaleConfig from './excelSaleConfig'
  import merchantModel from '@/api/merchant'
  import harbourModel from "@/api/harbour";
  import {currency, parseTime} from '@/utils'
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
      vip0SoldOutTimeWeek() {
        if (this.newObject.vip0SoldOutTime && this.newObject.etdTime) {
          let vip0SoldOutTime = new Date(this.newObject.vip0SoldOutTime);
          return (parseInt((vip0SoldOutTime - this.newObject.etdTime) / 1000 / 60 / 60 / 24) / 7).toFixed(2);
        }
        else {
          return false
        }
      },
      vip1SoldOutTimeWeek() {
        if (this.newObject.vip1SoldOutTime && this.newObject.etdTime) {
          let vip1SoldOutTime = new Date(this.newObject.vip1SoldOutTime);
          return (parseInt((vip1SoldOutTime - this.newObject.etdTime) / 1000 / 60 / 60 / 24) / 7).toFixed(2);
        }
        else {
          return false
        }
      },
      vip2SoldOutTimeWeek() {
        if (this.newObject.vip2SoldOutTime && this.newObject.etdTime) {
          let vip2SoldOutTime = new Date(this.newObject.vip2SoldOutTime);
          return (parseInt((vip2SoldOutTime - this.newObject.etdTime) / 1000 / 60 / 60 / 24) / 7).toFixed(2);
        }
        else {
          return false
        }
      },
    },

    data() {
      return {
        // 表单加载状态
        loading: false,
        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,
        newObject: {},
        warehouseSelectOptions: [],
        merchantSelectOptions: [],
        groupSelectOptions: [],
        categorys: [],
        harbours: [],
        fromWarehouses: [],
        toWarehouses: [],

        // 字段验证规则 TODO:
        rules: {
          merchantId: [
            validRules.required
          ],
          warehouseId: [
            validRules.required
          ],
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
      //初始化加载数据 TODO:根据实际情况调整
      initData() {
        //获取数据
        this.newObject = JSON.parse(JSON.stringify(this.primary));
        this.newObject.exclude = 1;
        this.merchantSelectOptions = merchantModel.getSelectOptions();
        this.initWarehouseData(this.newObject.categoryId);
        this.initGroupData(this.newObject.categoryId);
        // 港口信息
        this.harbours = harbourModel.getSelectNameOptions();
        this.initCategoryData();
        this.newObject.address = this.newObject.toWarehouse ? this.newObject.toWarehouse.address : '美西';
        this.loadOtdTime();
      },

      // 初始化分类
      initCategoryData() {
        this.loading = true;
        let url = "/categories/permissions?sort=code&order=asc";
        this.global.axios.get(url)
          .then(resp => {
            let res = resp.data || [];
            this.categorys = [];
            res.forEach(r => {
              this.categorys.push({
                label: r.name,
                value: r.id
              });
            });
            this.loading = false;
          })
          .catch(err => {
            this.loading = false;
          });
      },

      // 初始化仓库数据
      initWarehouseData(val = null) {
        // 仓库信息
        let warehousesUrl = `/warehouses?filters={"groupOp":"AND","rules":[{"field":"status","op":"eq","data":"1"}]}&sort=type asc,name`;
        this.global.axios(warehousesUrl).then(data => {
          if (data.status == 200) {
            this.fromWarehouses = [];
            this.toWarehouses = [];
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

        if (!val) {
          return;
        }
        this.loading = true;
        let url = "/warehouses/category";
        url += "?cateId=" + val.join(",");
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

      // 初始化款式数据
      initGroupData(val = null) {
        if (!val) {
          return;
        }
        this.loading = true;
        let url = "/products/listProductGroups";
        url += "?cateId=" + val.join(",");
        this.global.axios.get(url)
          .then(resp => {
            let res = resp.data || [];
            this.groupSelectOptions = [];
            res.forEach(r => {
              this.groupSelectOptions.push({
                label: r,
                value: r
              });
            });
            this.loading = false;
          })
          .catch(err => {
            this.loading = false;
          })
      },

      updateInput(val) {
        this.$forceUpdate();
      },

      loadOtdTime() {
        let url = `/amazonStocks/shippings/otdTime?etdTime=${moment(this.newObject.etdTime).format("YYYY-MM-DD")}
        &portOfLoading=${this.newObject.portOfLoading}
        &toWarehouse=${this.newObject.address}
        &shipmentType=${this.newObject.type}`;
        this.global.axios.get(url)
          .then(data => {
            //  解决不渲染的问题
            this.$set(this.newObject, "otdTime", data.data || {});
          })
          .catch(err => {
          })
      },

      onSmart() {
        this.$refs.smart.validate(valid => {
          if (!valid) {
            return;
          }
          this.$emit("step1CBEvent", this.newObject);
        })
      },

      onDownload() {
        this.$refs.smart.validate(valid => {
          if (!valid) {
            return;
          }

          //获取数据
          let downloadUrl = `/amazonStocks/shippings/${this.newObject.merchantId}`;

          downloadUrl += "?warehouse=" + (this.newObject.warehouseId ? this.newObject.warehouseId.join(",") : 'all')  //出货仓库
            + "&category=" + this.newObject.categoryId.join(",")     //品类
            + "&etdTime=" + this.newObject.formatEtdTime      //发柜时间
            + "&shipmentType=" + this.newObject.type    //物流类型
            + "&portOfLoading=" + this.newObject.portOfLoading  //出货港口
            + "&toWarehouse=" + this.newObject.toWarehouse.address;      //收货区域

          if (this.newObject.groupName) {
            downloadUrl += "&group=" + this.newObject.groupName.join(",");  //销售覆盖时间
          }
          if (this.newObject.vip0SoldOutTime) {
            downloadUrl += "&vip0SoldOutTime=" + this.newObject.vip0SoldOutTime;  //销售覆盖时间
          }
          if (this.newObject.vip1SoldOutTime) {
            downloadUrl += "&vip1SoldOutTime=" + this.newObject.vip1SoldOutTime;  //销售覆盖时间
          }
          if (this.newObject.vip2SoldOutTime) {
            downloadUrl += "&vip2SoldOutTime=" + this.newObject.vip2SoldOutTime;  //销售覆盖时间
          }
          downloadUrl += "&exclude=0";  //销售覆盖时间

          let saleExcelField = JSON.parse(JSON.stringify(excelSaleConfig.excelField));
          this.warehouseSelectOptions.forEach(row => {
            if (this.newObject.warehouseId != null && this.newObject.warehouseId.length > 0) {
              this.newObject.warehouseId.forEach(w => {
                if (w == row.value) {
                  saleExcelField.push(
                    {'attrName': `warehouseStocks.${row.value}`, 'type': 's', 'name': `#${row.label}库存#`}
                  );
                }
              })
            }
          });

          import('@/vendor/Export2ExcelPinHai').then(excel => {
            this.loading = true;
            excel.export_json_url_to_excel_with_formulae({
              url: downloadUrl,
              excelField: saleExcelField,
              filename: `${this.newObject.type}-${this.newObject.portOfLoading}-${this.newObject.address}-出口-${moment(this.newObject.etdTime).format("YYYY-MM-DD-HH-mm")}`
            });
            this.loading = false;
          })
        })
      },

      changeCategory() {
        this.initWarehouseData(this.newObject.categoryId);
      },

      updateInput(val) {
        this.$forceUpdate();
      }
    }
  }
</script>

<style type="text/less" lang="scss" scoped>


</style>

