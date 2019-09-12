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
          <el-form-item label="开船日期">
            <span style="font-size: 12px">{{newObject.formatEtdTime}}</span>
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="分类">
            <span style="font-size: 12px">{{newObject.categoryName}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :md="12">
          <el-form-item label="物流类型">
            <span style="font-size: 12px">{{newObject.type}}</span>
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="发货港口">
            <span style="font-size: 12px">{{newObject.portOfLoading}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :md="12">
          <el-form-item label="收货区域">
            <span style="font-size: 12px">{{newObject.toWarehouse ? newObject.toWarehouse.address : ''}}</span>
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
      </el-row>

      <el-row>
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
  import merchantModel from '@/api/merchant'

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
          return (parseInt(Math.abs(vip0SoldOutTime - this.newObject.etdTime) / 1000 / 60 / 60 / 24) / 7).toFixed(2);
        }
        else {
          return false
        }
      },
      vip1SoldOutTimeWeek() {
        if (this.newObject.vip1SoldOutTime && this.newObject.etdTime) {
          let vip1SoldOutTime = new Date(this.newObject.vip1SoldOutTime);
          return (parseInt(Math.abs(vip1SoldOutTime - this.newObject.etdTime) / 1000 / 60 / 60 / 24) / 7).toFixed(2);
        }
        else {
          return false
        }
      },
      vip2SoldOutTimeWeek() {
        if (this.newObject.vip2SoldOutTime && this.newObject.etdTime) {
          let vip2SoldOutTime = new Date(this.newObject.vip2SoldOutTime);
          return (parseInt(Math.abs(vip2SoldOutTime - this.newObject.etdTime) / 1000 / 60 / 60 / 24) / 7).toFixed(2);
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
        this.merchantSelectOptions = merchantModel.getSelectOptions();
        this.initWarehouseData(this.newObject.categoryId);
        this.initGroupData(this.newObject.categoryId);
      },

      // 初始化仓库数据
      initWarehouseData(val = null) {
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

      onSmart() {
        this.$refs.smart.validate(valid => {
          if (!valid) {
            return;
          }
          this.$emit("step1CBEvent", this.newObject);
        })
      },
    }
  }
</script>

<style type="text/less" lang="scss" scoped>


</style>

