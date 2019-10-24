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
                               :min="1"
                               :step="1"
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
                               :max="52" label="备货周数">
              </el-input-number>

              <el-tooltip class="item" effect="light" content="产品希望支持销售的周数。" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>

            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="可售周数" prop="saleWeek">
              <el-input v-model.trim="detailItem.saleWeek"
                        style="width: 160px" placeholder="可售周数，自动计算" clearable></el-input>
              <el-tooltip class="item" effect="light" content="采购的产品可以销售的周数" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
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
            <el-form-item label="亚马逊含在途(箱)" prop="amazonTotalStock">

              <el-input v-model.trim="detailItem.amazonTotalStock"
                        style="width: 160px" readonly clearable></el-input>

              <el-tooltip class="item" effect="light" content="亚马逊含在途库存箱数，不能修改" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>

            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :md="10">
            <el-form-item label="国内库存(箱)" prop="domesticStockQty">
              <el-input v-model.trim="detailItem.domesticStockQty"
                        style="width: 160px" placeholder="国内库存，箱数" clearable></el-input>

              <el-tooltip class="item" effect="light" content="国内仓库库存箱数，不能修改" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>

            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="国内在途(箱)" prop="unfinishedPlanQty">
              <el-input v-model.trim="detailItem.unfinishedPlanQty"
                        style="width: 160px" placeholder="国内在途，箱数" clearable></el-input>
              <el-tooltip class="item" effect="light" content="未完成采购计划箱数" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>

            </el-form-item>
          </el-col>

        </el-row>

        <el-row v-if="false">
          <el-col :md="14" v-if="false">
            <el-form-item label="优先级" prop="priority">

              <el-select v-model="detailItem.priority"
                         filterable
                         style="width: 160px"
                         placeholder="请选择优先级,可筛选">

                <el-option
                  v-for="(item,idx) in prioritySelectOptions"
                  :label="item.label" :value="item.value"
                  :key="idx"
                ></el-option>
              </el-select>

              <el-tooltip class="item" effect="light" content="本产品在该采购计划中的优先等级" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>

            </el-form-item>
          </el-col>
          <el-col :md="24" v-if="false">
            <el-form-item label="优先要求" prop="priorityNote">
              <el-col :span="22">
                <el-input type="textarea" v-model="detailItem.priorityNote"
                          maxlength="500"
                          show-word-limit
                          rows="3"
                          cols="80"
                          placeholder="示例:
2018-08-16 : 5箱
2018-08-26 : 45件
2018-09-16 : 2箱"
                          show-word-limit></el-input>
              </el-col>

              <el-col :span="2">

                <el-tooltip class="item" effect="light" placement="right">
                  <div slot="content">按时间维度定义优先要求。格式如下：
                    <HR/>
                    2018-08-16 : 5箱<BR/>
                    2018-08-26 : 45件<BR/>
                    2018-09-16 : 2箱<BR/>
                  </div>
                  <i class="el-icon-question">&nbsp;</i>
                </el-tooltip>

              </el-col>

            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div slot="footer" class="dialog-footer">
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
          domesticStockQty: [
            validRules.number
          ],
          unfinishedPlanQty: [
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
            cartonQty: 1,
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
        this.detailItem = null;
        this.cartonspecSelectOptions = [];
        this.prioritySelectOptions = [];
      },

      onQtyChange(val) {
        if (this.detailItem) {
          //可售周数 = （亚马逊总库存 + 国内库存 + 未完成采购计划数 + 应备货件数） /（7日销量修正）
          let amazonTotalStock = this.detailItem.amazonTotalStock || 0;
          let domesticStockCartonQty = this.detailItem.domesticStockCartonQty || 0;
          let unfinishedPlanQty = this.detailItem.unfinishedPlanQty || 0;
          let numberOfCarton = this.detailItem.numberOfCarton || 1;
          let total = amazonTotalStock + domesticStockCartonQty + unfinishedPlanQty + (val * numberOfCarton);

          if (this.detailItem.sevenSalesCount) {
            this.detailItem.saleWeek = (total / this.detailItem.sevenSalesCount).toFixed(1);
          }
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

