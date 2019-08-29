<template>
  <el-dialog :title="dialogTitle"
             append-to-body
             v-if="dialogVisible"
             width="80%"
             top="20px"
             :visible.sync="dialogVisible">

    <!-- 编辑表单 TODO:-->
    <el-form :rules="rules" :model="detailItem" status-icon inline
             ref="detailItem" label-position="right"
             label-width="120px"
             v-loading="loading"
    >
      <el-row>
        <el-col :md="10">
          <el-form-item label="SKU" prop="skuCode">
            <el-input v-model.trim="detailItem.skuCode"
                      style="width: 220px" placeholder="请填写SKU" clearable :disabled="true"></el-input>

            <el-tooltip class="item" effect="light" content="输入产品SKU编码" placement="right">
              <i class="el-icon-question">&nbsp;</i>
            </el-tooltip>
          </el-form-item>
        </el-col>

        <el-col :md="14">
          <el-form-item label="产品名" prop="cartonQty">
            <el-input v-model="detailItem.productName"
                             :max="100000" label="产品名" :disabled="true">
             
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :md="10">
          <el-form-item label="箱规" prop="cartonSpecId">

            <el-select filterable v-model="detailItem.cartonSpecCode" placeholder="外箱包装材料规格,可筛选"
                       style="width: 220px">
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
                      style="width: 200px" placeholder="请填写装箱数" clearable></el-input>

            <el-tooltip class="item" effect="light" content="一箱有多少个产品.不输入使用产品上默认的装箱数" placement="right">
              <i class="el-icon-question">&nbsp;</i>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :md="10">
          <el-form-item label="采购数量(箱)" prop="procurementBoxQty">
            <el-input v-model="detailItem.procurementBoxQty"
                             :max="100000" label="采购数量(箱)">
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :md="14">
          <el-form-item label="应发箱数" prop="shippedCartonQty">
            <el-input v-model="detailItem.shippedCartonQty"
                             :max="100000" label="应发箱数">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :md="10">
          <el-form-item label="出货件数" prop="sevenSalesCount">

            <el-input v-model.trim="detailItem.shippedQty"
                      style="width: 220px" placeholder="出货件数" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :md="24">
          <el-form-item label="备注" prop="priorityNote">
            <el-col :span="22">
              <el-input type="textarea" v-model="detailItem.shippedNote"
                        maxlength="500"
                        show-word-limit
                        rows="3"
                        cols="80"
                        ></el-input>
            </el-col>

            <el-col :span="2">

              <el-tooltip class="item" effect="light" placement="right">
                <div slot="content">按时间维度定义优先要求。格式如下：
                  <HR/>
                  2018-08-16 : 5箱<BR/>
                  2018-08-26 : 45件<BR/>
                  2018-09-16 : 2箱<BR/>
                </div>
                </div>
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>

            </el-col>

          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :md="24">
          <el-row type="flex" justify="center">
            <el-button type="primary" style="margin-top: 15px" :loading="confirmLoading" @click="onSave">
              保存
            </el-button>
          </el-row>
        </el-col>
      </el-row>

    </el-form>
  </el-dialog>

</template>

<script>
  import cartonspecModel from '@/api/cartonspec'
  import phEnumModel from '@/api/phEnum'
  import validRules from '@/components/validRules'

  export default {
    components: {},
    props: {
      primaryId: {
        type: Number,
        default: null
      }
    },
    computed: {
      dialogTitle() {
        if (this.detailItemId == null) {
          return "添加发货计划明细";
        }
        else {
          return "修改发货计划明细";
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
        url: "/procurementShippedOrderItems",
        relations: ["product", "cartonSpec", "procurementOrderItem"],  // 关联对象
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
              this.detailItem.productName = data.product.name;
              this.detailItem.cartonSpecId = data.cartonSpecId + '';
              this.detailItem.priority = data.priority + '';
              console.log("dflkjsdklfjdslk", this.detailItem)
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
            cartonQty: 1,
            procurementPlanId: this.primaryId
          }

        }
      },

      /* 开启弹出编辑框 需要传明细ID */
      openDialog(detailItemId) {
        this.detailItemId = detailItemId;
        this.dialogVisible = true;
        this.initData();
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
          if (!this.detailItemId && this.detailItemId > 0) {
            method = 'put';
            url = `${this.url}/${this.detailItemId}`;
          }

          //转义字段
          let _object = JSON.parse(JSON.stringify(this.detailItem));

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

