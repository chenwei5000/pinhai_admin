<template>

  <!-- 编辑表单 TODO:-->
  <el-form :rules="rules" :model="editObject" status-icon inline
           ref="editObject" label-position="right"
           label-width="120px"
           v-if="initComplete"
           v-loading="loading"
  >
    <el-row>
      <el-col :md="10">
        <el-form-item label="编码" prop="code">
          <span style="font-size: 12px">{{editObject.code}}</span>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
    <el-col :md="10">
        <el-form-item label="发货仓库" prop="fromWarehouseId">
          <span v-if="!hasEdit" style="font-size: 12px">{{editObject.fromWarehouse.name}}</span>
          <el-select v-else v-model="editObject.fromWarehouseId" style="width: 220px"  size="mini"
                     filterable placeholder="请选择发货仓库">
            <el-option
              v-for="(item , idx)  in fromWarehouseSelectOptions"
              :label="item.label"
              :value="item.value"
              :key="idx"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :md="14">
        <el-form-item label="收货仓库" prop="toWarehouseId">
          <span v-if="!hasEdit" style="font-size: 12px">{{editObject.toWarehouse.name}}</span>
          <el-select v-else v-model="editObject.toWarehouseId" style="width: 220px"  size="mini"
                     filterable placeholder="请选择收货仓库">
            <el-option
              v-for="(item , idx)  in toWarehouseSelectOptions"
              :label="item.label"
              :value="item.value"
              :key="idx"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :md="10">
        <el-form-item label="物流单号" prop="trackNumber">
          <span v-if="!hasEdit" style="font-size: 12px">{{editObject.trackNumber}}</span>
          <el-input v-else v-model="editObject.trackNumber"
                    show-word-limit
                    style="width: 220px" placeholder="请填写单号"  size="mini" clearable></el-input>
        </el-form-item>
      </el-col>

      <el-col :md="14">
        <el-form-item label="物流公司" prop="channel">
          <span v-if="!hasEdit" style="font-size: 12px">{{editObject.channel}}</span>
          <el-input v-else v-model="editObject.channel"
                    style="width: 220px" placeholder="请填写公司"   size="mini" clearable></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :md="10">
        <el-form-item label="车牌" prop="plateNumber">
          <span v-if="!hasEdit" style="font-size: 12px">{{editObject.plateNumber}}</span>

          <el-input v-else v-model="editObject.plateNumber"
                    show-word-limit
                    style="width: 220px" placeholder="请填写车牌"  size="mini"  clearable></el-input>
        </el-form-item>
      </el-col>

      <el-col :md="14">
        <el-form-item label="联系人" prop="linkman">

          <span v-if="!hasEdit" style="font-size: 12px">{{editObject.linkman}}</span>

          <el-input v-else v-model="editObject.linkman"
                    style="width: 220px" placeholder="请填写联系人"  size="mini" clearable></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>

      <el-col :md="10">
        <el-form-item label="电话" prop="tel">
          <span v-if="!hasEdit" style="font-size: 12px">{{editObject.tel}}</span>

          <el-input v-else v-model="editObject.tel"
                    style="width: 220px" placeholder="请填写电话" size="mini" clearable></el-input>
        </el-form-item>
      </el-col>


      <el-col :md="14">
        <el-form-item label="预计发货时间" prop="expectTime">
          <span v-if="!hasEdit" style="font-size: 12px">{{editObject.expectTime}}</span>
          <el-date-picker
            v-else
            size="mini"
            v-model="editObject.expectTime"
            format="yyyy-MM-dd"
            type="date"
            placeholder="预计发货时间"></el-date-picker>
        </el-form-item>
      </el-col>

    </el-row>

    <el-row>
      <el-col :md="24">
        <el-form-item label="备注" prop="note">

          <div v-if="!hasEdit" style="font-size: 12px">{{editObject.formatRemark}}</div>

          <el-col v-else :span="22">
            <el-input type="textarea" v-model="editObject.remark"
                      maxlength="500"
                      show-word-limit
                      rows="3"
                      cols="80"
                      show-word-limit></el-input>
          </el-col>

          <el-col :span="2" v-if="hasEdit">
            <el-tooltip class="item" effect="light" content="备注信息。支持换行！" placement="right">
              <i class="el-icon-question">&nbsp;</i>
            </el-tooltip>
          </el-col>

        </el-form-item>
      </el-col>
    </el-row>

    <el-row v-if="hasEdit">
      <el-col :md="24">
        <el-row type="flex" justify="center">
          <el-button v-if="hasEdit" type="primary" size="mini"  style="margin-top: 15px" :loading="confirmLoading" @click="onSave">
            保存基本信息
          </el-button>
        </el-row>
      </el-col>
    </el-row>

  </el-form>

</template>

<script>

  import warehouseModel from '@/api/warehouse'
  import {intArrToStrArr} from '@/utils'
  import {checkPermission} from "../../../../utils/permission";

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
        if ([1, 3].indexOf(this.primary.status) === -1) {
          return false;
        }
        if(!checkPermission('WarehouseAllocationResource_update')){
          return false;
        }
        else {
          return true;
        }
      }
    },

    data() {
      return {
        // 表单加载状态
        loading: false,
        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,
        initComplete: false,

        // 选择框 TODO:
        fromWarehouseSelectOptions: [],
        toWarehouseSelectOptions: [],

        // 编辑对象 TODO
        editObject: {},

        // 字段验证规则 TODO:
        rules: {
          code: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          fromWarehouseId: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          toWarehouseId: [
            {required: true, message: '必须输入', trigger: 'blur'}
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
      /**
       * 初始化数据
       */
      initData() {
        this.loading = true;
        if (this.primary) {
          //获取计划数据
          this.editObject = this.primary;
          //转化时间
          this.editObject.expectTime = this.editObject.formatExpectTime;

          //转化仓库
          this.toWarehouseSelectOptions = warehouseModel.getSelectDomesticAndMaterialOptions();
          this.fromWarehouseSelectOptions = warehouseModel.getSelectDomesticAndMaterialOptions(true);
          this.editObject.fromWarehouseId = this.editObject.fromWarehouseId + '';
          this.editObject.toWarehouseId = this.editObject.toWarehouseId + '';

          this.loading = false;
          this.initComplete = true;
        }
        else {
          this.$message.error("无效的国内调拨!");
          this.loading = false;
        }
      },

      /********************* 操作按钮相关方法  ***************************/
      /* 保存对象 */
      onSave() {
        this.modifyObject();
      },

      // 创建或修改发货计划
      modifyObject() {
        let _object = JSON.parse(JSON.stringify(this.editObject));
        this.loading = true;
        this.confirmLoading = true;

        this.global.axios.put(`/warehouseAllocations/${this.editObject.id}`, _object)
          .then(resp => {
            let _newObject = resp.data;
            this.$message({type: 'success', message: '操作成功'});
            this.loading = false;
            this.confirmLoading = false;

            //转化时间
            this.editObject = _newObject;
            this.editObject.expectTime = this.editObject.formatExpectTime;
            //转化仓库
            this.editObject.fromWarehouseId = this.editObject.fromWarehouseId + '';
            this.editObject.toWarehouseId = this.editObject.toWarehouseId + '';
            // 回传消息
            this.$emit("modifyCBEvent", _newObject);
          })
          .catch(err => {
            this.loading = false;
            this.confirmLoading = false;
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
</style>

