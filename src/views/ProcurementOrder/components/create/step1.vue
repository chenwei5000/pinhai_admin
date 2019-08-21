<template>

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

        <legend class="panel-title">通过采购计划下采购单
          <el-tooltip class="item" effect="light" placement="right">
            <div slot="content">
              通过采购计划下采购单
            </div>
            <i class="el-icon-question">&nbsp;</i>
          </el-tooltip>
        </legend>

        <el-row>
          <el-col :md="24">
            <el-form-item label="交货要求" prop="note">
              <div>
                {{ editObject.note }}
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="24">
            <el-row type="flex" justify="center">
              <el-button type="primary" style="margin-top: 15px" :loading="confirmLoading" @click="onSave"
                         v-if="hasEdit">
                保存基本信息
              </el-button>
            </el-row>
          </el-col>
        </el-row>
      </fieldset>
    </el-form>
  </div>

</template>

<script>

  import categoryModel from '@/api/category'
  import merchantModel from '@/api/merchant'
  import systemModel from '@/api/system'
  import {intArrToStrArr} from '@/utils'

  export default {
    components: {},
    props: {
      primary: {
        type: [Object],
        default: {}
      }
    },
    computed: {
      hasEdit() {
        // 控制按钮
        if ([0, 8].indexOf(this.primary.status) > -1) {
          return false;
        }
        else {
          return true;
        }
      },
      hasCategory() {
        if (this.editObject.categoryId == null || this.editObject.categoryId.length == 0) {
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

        // 编辑对象 TODO
        editObject: {
          id: null,
          categoryId: null,
          limitTime: null,
          executeTime: null,
          groupName: null,
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
          this.editObject.limitTime = this.primary.formatLimitTime;
          this.editObject.executeTime = this.primary.formatExecuteTime;
          //转化分类
          this.editObject.categoryId = intArrToStrArr(this.primary.categoryId);

          this.editObject.handleMethod = this.primary.handleMethod + '';

          this.categorySelectOptions = categoryModel.getMineSelectOptions();
          this.merchantSelectOptions = merchantModel.getSelectOptions();
          this.initWarehouseData(this.editObject.categoryId);
          this.initGroupData(this.editObject.categoryId);

          //设置默认安全库存
          systemModel.getConfigInfos().then(data => {
            if (this.editObject.safetyStockWeek == null) {
              this.editObject.safetyStockWeek = data.safetyStockWeek;
            }
            if (this.editObject.vip1SafetyStockWeek == null) {
              this.editObject.vip1SafetyStockWeek = data.vip1SafetyStockWeek;
            }
            if (this.editObject.vip2SafetyStockWeek == null) {
              this.editObject.vip2SafetyStockWeek = data.vip2SafetyStockWeek;
            }
          });

          this.loading = false;
        }
        else {
          this.$message.error("无效的采购计划!");
          this.loading = false;
        }
      },

      // 初始化款式数据
      initGroupData(val = null) {
        //转化仓库
        if (this.primary.groupName && (typeof this.primary.groupName == 'string') && this.primary.groupName.constructor == String) {
          this.editObject.groupName = intArrToStrArr(this.primary.groupName.split(","));
        }
        else if (this.primary.groupName) {
          this.editObject.groupName = intArrToStrArr(this.primary.groupName);
        }

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

        //转化仓库
        if (this.primary.warehouseId && (typeof this.primary.warehouseId == 'string') && this.primary.warehouseId.constructor == String) {
          this.editObject.warehouseId = intArrToStrArr(this.primary.warehouseId.split(","));
        }
        else if (this.primary.warehouseId) {
          this.editObject.warehouseId = intArrToStrArr(this.primary.warehouseId);
        }

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
      /* 保存对象 */
      onSave() {
        this.$confirm('注意保存基本信息只会修改对应的参数，不会重新计算明细数据，您是否继续？', '提示', {
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              done();
              this.modifyObject();
            } else done()
          }
        }).catch(er => {
          /*取消*/
        })
      },

      // 修改计划
      modifyObject() {
        let _object = JSON.parse(JSON.stringify(this.editObject));
        _object.warehouseId = _object.warehouseId ? _object.warehouseId.join(",") : "";
        _object.groupName = _object.groupName ? _object.groupName.join(",") : "";
        this.loading = true;
        this.confirmLoading = true;

        this.global.axios.put(`/procurementPlans/${this.editObject.id}`, _object)
          .then(resp => {
            let _newObject = resp.data;
            this.$message({type: 'success', message: '操作成功'});
            this.loading = false;
            this.confirmLoading = false;
            // 回传消息
            this.formVisible = false;
            this.$emit("modifyCBEvent", _newObject);
          })
          .catch(err => {
            this.loading = false;
            this.confirmLoading = false;
          })
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
