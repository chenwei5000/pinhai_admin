<template>
  <div>

    <!-- 添加功能 form-表单, fieldset-字段租, legend-标题, tooltip-提示框 -->
    <el-form :rules="rules"
             :model="newObject"
             status-icon
             inline
             ref="smart"
             label-position="right"
             label-width="120px"
             v-loading="loading"
    >

      <fieldset class="panel-heading">

        <legend class="panel-title">智能备货
          <el-tooltip class="item" effect="light" placement="right">
            <div slot="content">
              智能备货是通过销量情况、各地库存情况自动推荐备货数量。需要选择以下对应的选项。<BR/>
              公式：((7日销量 x ️备货周数) - 亚马逊库存(含在途) - 国内库存 - 未完成采购计划数(根据选项处理)) ➗ 装箱数（自动四舍五入保证整箱）
            </div>
            <i class="el-icon-question">&nbsp;</i>
          </el-tooltip>
        </legend>

        <el-row>
          <el-col :md="10">
            <el-form-item label="销售渠道" prop="merchantId">
              <el-select v-model="newObject.merchantId" style="width: 220px"
                         filterable placeholder="请选择销售渠道">
                <el-option
                  v-for="(item , idx)  in merchantSelectOptions"
                  :label="item.label"
                  :value="item.value"
                  :key="idx"
                ></el-option>
              </el-select>

              <el-tooltip class="item" effect="light" content="以选定的销售渠道（销售店铺）的销售情况为备货依据。" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="标签" prop="tags">
              <el-input v-model="newObject.tags"
                        maxlength="20"
                        show-word-limit
                        style="width: 220px" placeholder="请填写标签" clearable></el-input>

              <el-tooltip class="item" effect="light" content="给计划打上一个标签方便查找" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="10">
            <el-form-item label="分类" prop="categoryId">

              <el-select v-model="newObject.categoryId" style="width: 220px" filterable multiple
                         placeholder="请选择分类,可多选">
                <el-option
                  v-for="(item , idx)  in categorySelectOptions"
                  :label="item.label"
                  :value="item.value"
                  :key="idx"
                ></el-option>
              </el-select>

              <el-tooltip class="item" effect="light" content="选择需要备货的分类" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="国内库存" prop="warehouseId">
              <el-select v-model="newObject.warehouseId" style="width: 220px"
                         filterable multiple placeholder="请选择库存,可多选">
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
        </el-row>

        <el-row>
          <el-col :md="10">
            <el-form-item label="下单截止日" prop="limitTime">
              <el-date-picker
                v-model="newObject.limitTime"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="下单截止日"></el-date-picker>

              <el-tooltip class="item" effect="light" content="本次采购必须在这个日期之前完成交货" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>

            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="交货截止日" prop="executeTime">
              <el-date-picker
                v-model="newObject.executeTime"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="交货截止日"></el-date-picker>

              <el-tooltip class="item" effect="light" content="本次采购必须在这个日期之前向厂家签好采购合同" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="10">
            <el-form-item label="非Vip备货周数" prop="safetyStockWeek">
              <el-select v-model="newObject.safetyStockWeek" style="width: 220px"
                         filterable placeholder="请选择非Vip备货周数">
                <el-option
                  v-for="week in 52"
                  :label="week"
                  :value="week"
                  :key="week"
                ></el-option>
              </el-select>

              <el-tooltip class="item" effect="light" content="普通类型的产品，希望支持销售的周数。可在产品管理中查看产品类型。" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>

            </el-form-item>
          </el-col>


          <el-col :md="14">
            <el-form-item label="Vip1备货周数" prop="vip1SafetyStockWeek">
              <el-select v-model="newObject.vip1SafetyStockWeek" style="width: 220px"
                         filterable placeholder="请选择Vip1备货周数">
                <el-option
                  v-for="week in 52"
                  :label="week"
                  :value="week"
                  :key="week"
                ></el-option>
              </el-select>

              <el-tooltip class="item" effect="light" content="热卖类型的产品，希望支持销售的周数。可在产品管理中查看产品类型。" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>

            </el-form-item>
          </el-col>
        </el-row>


        <el-row>
          <el-col :md="10">
            <el-form-item label="Vip2备货周数" prop="vip2SafetyStockWeek">
              <el-select v-model="newObject.vip2SafetyStockWeek" style="width: 220px"
                         filterable placeholder="请选择Vip2备货周数">
                <el-option
                  v-for="week in 52"
                  :label="week"
                  :value="week"
                  :key="week"
                ></el-option>
              </el-select>

              <el-tooltip class="item" effect="light" content="爆款类型的产品，希望支持销售的周数。可在产品管理中查看产品类型。" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>

            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="未完成采购计划处理方式" prop="handleMethod">
              <el-select v-model="newObject.handleMethod" style="width: 220px"
                         filterable placeholder="请选择未完成采购计划处理方式">

                <el-option label="不考虑" value="0"></el-option>
                <el-option label="采购计划数量" value="1"></el-option>
                <el-option label="已下采购单数量" value="2"></el-option>
                <el-option label="已发货数量" value="3"></el-option>
                <el-option label="已收货数量" value="4"></el-option>

              </el-select>

              <el-tooltip class="item" effect="light" placement="right">
                <div slot="content">对当前没有结束的其它采购计划的处理方式。<BR/>
                  例如：选择已发货数量。表示最终需要减去没有完成采购计划中，已经发货的数量。<BR/>
                  具体各种状态数量可以在采购计划中查看。
                </div>
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>

            </el-form-item>
          </el-col>
        </el-row>

        <el-col :md="24">
          <el-row type="flex" justify="center">
            <el-button type="primary" style="margin-top: 15px" :loading="confirmLoading" @click="onSmart">
              智能备货
            </el-button>
          </el-row>
        </el-col>

      </fieldset>
    </el-form>

    <!-- 智能备货明细列表 -->
    <itemTable
      ref="itemTable"
      @createCBEvent="createCBEvent"
    ></itemTable>
  </div>

</template>

<script>
  import categoryModel from '@/api/category'
  import warehouseModel from '@/api/warehouse'
  import merchantModel from '@/api/merchant'
  import systemModel from '@/api/system'
  import {intArrToStrArr} from '@/utils'
  import itemTable from './table'

  export default {
    components: {itemTable},
    props: {},
    computed: {},

    data() {
      return {
        // 表单加载状态
        loading: false,
        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,

        // 选择框 TODO:
        categorySelectOptions: [],
        warehouseSelectOptions: [],
        merchantSelectOptions: [],

        // 新对象  TODO:
        newObject: {
          id: null,
          categoryId: null,
          limitTime: null,
          executeTime: null,
          tags: null,
          note: null,
          merchantId: null,
          warehouseId: null,
          handleMethod: "3",
          safetyStockWeek: null,
          vip1SafetyStockWeek: null,
          vip2SafetyStockWeek: null,
        },
        // 字段验证规则 TODO:
        rules: {
          limitTime: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          executeTime: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          categoryId: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          merchantId: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          warehouseId: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          safetyStockWeek: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          vip1SafetyStockWeek: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          vip2SafetyStockWeek: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          handleMethod: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ]
        },
      }
    },

    mounted() {
      // 渲染完毕，控件加载完毕后执行
      this.$nextTick(() => {
        this.initData();
      })
    },
    methods: {
      /********************* 基础方法  *****************************/
      //初始化数据 TODO:根据实际情况调整
      initData() {
        this.loading = true;
        // 加载选择框数据
        this.categorySelectOptions = categoryModel.getMineSelectOptions();

        this.merchantSelectOptions = merchantModel.getSelectOptions();
        this.warehouseSelectOptions = warehouseModel.getSelectDomesticOptions();

        // 设置默认安全库存
        systemModel.getConfigInfos().then(data => {
          if (this.newObject.safetyStockWeek == null) {
            this.newObject.safetyStockWeek = data.safetyStockWeek;
          }
          if (this.newObject.vip1SafetyStockWeek == null) {
            this.newObject.vip1SafetyStockWeek = data.vip1SafetyStockWeek;
          }
          if (this.newObject.vip2SafetyStockWeek == null) {
            this.newObject.vip2SafetyStockWeek = data.vip2SafetyStockWeek;
          }
        });

        // 仓库追加供货商库存选项
        let flg = true;
        this.warehouseSelectOptions.forEach(obj => {
          if (obj.value == "-99") {
            flg = false;
          }
        });

        if (flg) {
          this.warehouseSelectOptions.unshift({label: '供货商库存', value: "-99"})
        }

        this.loading = false;
      },

      /********************* 操作按钮相关方法  ***************************/
      // 智能备货 TODO:
      onSmart() {
        this.$refs.smart.validate(valid => {
          if (!valid) {
            return;
          }
          this.confirmLoading = true
          // 弹窗
          this.$refs.itemTable.openDialog(this.newObject);

          this.confirmLoading = false
        })
      },

      /*
       * 创建成功之后，将子组件发送的数据继续向上传递给父组件
       */
      createCBEvent(newObjectId) {
        this.$emit("smartCBEvent", newObjectId);
      }
    }
  }
</script>

<style type="text/less" lang="scss" scoped>

  .panel-heading {
    color: #444;
    border: 1px #cfd9db solid;
    margin-top: 10px;
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

