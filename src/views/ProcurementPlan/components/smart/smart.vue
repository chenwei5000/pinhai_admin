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

      <fieldset class="panel-heading">

        <legend class="panel-title">智能备货
          <el-tooltip class="item" effect="light" placement="right">
            <div slot="content">
              智能备货是通过销量情况、各地库存情况自动推荐备货数量。需要选择以下对应的选项。<BR/>
              公式：((7日销量 x 备货周数) - 亚马逊库存(含在途) - 国内库存 - 未完成采购计划数(根据选项处理)) ➗ 装箱数（自动四舍五入保证整箱）
            </div>
            <i class="el-icon-question">&nbsp;</i>
          </el-tooltip>
        </legend>

        <el-row>
          <el-col :md="10">
            <el-form-item label="销售渠道" prop="merchantId">
              <el-select v-model="newObject.merchantId" style="width: 220px" size="mini"
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
                        style="width: 220px"  size="mini" placeholder="请填写标签" clearable></el-input>

              <el-tooltip class="item" effect="light" content="给计划打上一个标签方便查找" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="10">
            <el-form-item label="分类" prop="categoryId">

              <el-select v-model="newObject.categoryId" style="width: 220px" size="mini"
                         filterable multiple
                         @change="onCateChange"
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
            <el-form-item label="款式" prop="groupName">

              <el-select v-model="newObject.groupName" style="width: 220px" size="mini" filterable multiple
                         :disabled="hasCategory"
                         placeholder="请选择产品款式。可多选">
                <el-option
                  v-for="(item , idx)  in groupSelectOptions"
                  :label="item.label"
                  :value="item.value"
                  :key="idx"
                ></el-option>
              </el-select>

              <el-tooltip class="item" effect="light" content="请选择产品款式,请优先选择分类" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="10">
            <el-form-item label="国内库存" prop="warehouseId">
              <el-select v-model="newObject.warehouseId" style="width: 220px" size="mini"
                         :disabled="hasCategory"
                         filterable multiple placeholder="请选择库存,可多选">
                <el-option
                  v-for="(item , idx)  in warehouseSelectOptions"
                  :label="item.label"
                  :value="item.value"
                  :key="idx"
                ></el-option>
              </el-select>

              <el-tooltip class="item" effect="light" content="以选定的仓库库存情况为当前库存依据。请优先选择分类。" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>

            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="期望交货日期" prop="limitTime">
              <el-date-picker
                v-model="newObject.limitTime"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                type="date"
                size="mini"
                placeholder="期望交货日期"></el-date-picker>

              <el-tooltip class="item" effect="light" content="销售期望的交货日期" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>

            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="10">
            <el-form-item label="非Vip备货周数" prop="safetyStockWeek">
              <el-select v-model="newObject.safetyStockWeek" style="width: 220px" size="mini"
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
              <el-select v-model="newObject.vip1SafetyStockWeek" style="width: 220px" size="mini"
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
              <el-select v-model="newObject.vip2SafetyStockWeek" style="width: 220px" size="mini"
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
              <el-select v-model="newObject.handleMethod" style="width: 220px" size="mini"
                         filterable placeholder="请选择未完成采购计划处理方式">

                <el-option label="不考虑" value="0"></el-option>
                <el-option label="未交货数量" value="5"></el-option>

              </el-select>

              <el-tooltip class="item" effect="light" placement="right">
                <div slot="content">排除未完成采购计划的方式<BR/>
                  计划数量。表示最终需要减去没有完成采购计划中，商品下采购计划数量。<BR/>
                  下单数量。表示最终需要减去没有完成采购计划中，商品已经下采购单的数量。<BR/>
                  发货数量。表示最终需要减去没有完成采购计划中，商品已经发货的数量。<BR/>
                  收货数量。表示最终需要减去没有完成采购计划中，商品已经收货的数量。<BR/>
                  具体各种状态数量可以在采购计划中查看。
                </div>
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>

            </el-form-item>
          </el-col>
        </el-row>

        <el-col :md="24">
          <el-row type="flex" justify="center">
            <el-button type="primary" style="margin-top: 15px" size="mini" :loading="confirmLoading" @click="onSmart">
              智能备货
            </el-button>
            <el-button style="margin-top: 15px" size="mini" :loading="confirmLoading" @click="onDownload">
              下载数据
            </el-button>
            <el-button type="success"  style="margin-top: 15px" size="mini" :loading="confirmLoading" @click="onCreate">
              手工备货
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
  import merchantModel from '@/api/merchant'
  import systemModel from '@/api/system'
  import {intArrToStrArr} from '@/utils'
  import itemTable from './table'
  import excelConfig from './excelConfig'
  import {parseTime} from "../../../../utils";

  export default {
    components: {itemTable},
    props: {},
    computed: {
      hasCategory() {
        if (this.newObject.categoryId == null || this.newObject.categoryId.length == 0) {
          return true;
        }
        else {
          return false;
        }
      }
    },

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
        groupSelectOptions: [],

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
          groupName: null,
          handleMethod: "5",
          safetyStockWeek: null,
          vip1SafetyStockWeek: null,
          vip2SafetyStockWeek: null,
        },
        // 字段验证规则 TODO:
        rules: {
          limitTime: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          executeTime: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          categoryId: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          merchantId: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          warehouseId: [
          ],
          safetyStockWeek: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          vip1SafetyStockWeek: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          vip2SafetyStockWeek: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          handleMethod: [
            {required: true, message: '必填', trigger: 'blur'}
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
        this.initGroupData();
        this.initWarehouseData();

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

        // 获取参数中的id
        this.newObject.merchantId = this.$route.query.merchantId !== null ? this.$route.query.merchantId : '';


        this.loading = false;
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

      onCreate() {
        this.$refs.smart.validate(valid => {
          if (!valid) {
            return;
          }
          this.loading = true;
          this.confirmLoading = true;

          //转义字段
          let _object = JSON.parse(JSON.stringify(this.newObject));
          _object.warehouseId = _object.warehouseId ? _object.warehouseId.join(",") : "";
          _object.groupName = _object.groupName ? _object.groupName.join(",") : "";

          this.global.axios.post("/procurementPlans", _object)
            .then(resp => {
              let _newObject = resp.data;
              this.$message({type: 'success', message: '操作成功'});
              this.loading = false;
              this.confirmLoading = false;
              // 回传消息
              this.dialogVisible = false;
              this.$emit("step1CBEvent", _newObject.id);
            })
            .catch(err => {
              this.loading = false;
              this.confirmLoading = false;
            })

        })
      },

      onDownload(){
        this.$refs.smart.validate(valid => {
          if (!valid) {
            return;
          }

          let downloadUrl = `/amazonStocks/plans/${this.newObject.merchantId}?warehouse=${this.newObject.warehouseId.join(",")}&category=${this.newObject.categoryId.join(",")}&safetyStockWeek=${this.newObject.safetyStockWeek}&vip1SafetyStockWeek=${this.newObject.vip1SafetyStockWeek}&vip2SafetyStockWeek=${this.newObject.vip2SafetyStockWeek}&exclude=${this.newObject.handleMethod}`;
          this.url += '&group=' + encodeURIComponent(this.newObject.groupName.join(","))

          import('@/vendor/Export2ExcelPinHai').then(excel => {
            this.loading = true;
            excel.export_json_url_to_excel_with_formulae({
              url: downloadUrl,
              excelField: excelConfig.excelField,
              filename: `采购计划-${parseTime(new Date(), '{y}-{m}-{d}')}`
            });
            this.loading = false;
          })
        });
      },

      /*
       * 创建成功之后，将子组件发送的数据继续向上传递给父组件
       */
      createCBEvent(newObjectId) {
        this.$emit("step1CBEvent", newObjectId);
      },

      /**
       * 分类发生修改
       */
      onCateChange(val) {
        this.initGroupData(val);
        this.initWarehouseData(val);
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

