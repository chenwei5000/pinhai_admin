<template>
<el-dialog :title="title" v-if="dialogVisible" :visible.sync="dialogVisible" width="800px">
    <!-- 编辑表单 TODO:-->
    <el-form :rules="rules" :model="editObject" status-icon inline
            ref="editObject" label-position="right"
            v-if="initComplete"
            label-width="120px"
            v-loading="loading"
    >
      <el-row>
        <el-col >
          <el-form-item label="编码" prop="code">
            <el-input v-model="editObject.code"
                      show-word-limit
                      placeholder="请填写编码" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col >
          <el-form-item label="简称" prop="name">
            <el-input v-model="editObject.name"
                      show-word-limit
                      placeholder="请填写简称" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-form-item label="公司名称" prop="companyName">
            <el-input v-model="editObject.companyName"
                      show-word-limit
                      style="width: 420px;" placeholder="请填写公司名称" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
          <el-col >
          <el-form-item label="所在城市" prop="city">
            <el-input v-model="editObject.city"
                      show-word-limit
                      placeholder="请填写所在城市" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col >
          <el-form-item label="地址" prop="address">
            <el-input v-model="editObject.address"
                      show-word-limit
                      style="width: 420px;" placeholder="请填写地址" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col >
          <el-form-item label="管理区域" prop="region">
            <el-input v-model="editObject.region"
                      show-word-limit
                      placeholder="请填写管理区域" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-form-item label="联系人" prop="linkman">
            <el-input v-model="editObject.linkman"
                      show-word-limit
                      placeholder="请填写联系人" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-form-item label="联系电话" prop="tel">
            <el-input v-model="editObject.tel"
                      show-word-limit
                      placeholder="请填写联系电话" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row >
        <el-col>
          <el-row type="flex" justify="center">
            <el-button type="primary" style="margin-top: 15px" size="mini" :loading="confirmLoading" @click="onSave">
              保存基本信息
            </el-button>
          </el-row>
        </el-col>
      </el-row>

    </el-form>
 </el-dialog>
</template>

<script>

  import warehouseModel from '../../../../api/warehouse'
  import {intArrToStrArr} from '@/utils'
  import supplierModel from "../../../../api/supplier"

  export default {
    components: {},
    props: {

    },
    computed: {
      hasEdit() {
        // 控制按钮
        if ([6].indexOf(this.primary.status) > -1) {
          return false;
        }
        else {
          return true;
        }

      },
    },

    data() {
      return {
        title: "编辑",
        disable: false,
        // 表单加载状态
        loading: false,
        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,

        initComplete: false,

        // 编辑对象 TODO
        editObject: {},
        url: '/suppliers',
        primaryId: '',

        // 字段验证规则 TODO:
        rules: {},
        dialogVisible: false, //Dialog 是否开启
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
        this.initComplete = false;
        this.global.axios.get(`${this.url}/${this.primaryId}`).then(resp => {
            this.editObject = JSON.parse(JSON.stringify(resp.data));
            this.loading = false;
            this.initComplete = true;
        }).catch(err => {
            console.log("数据请求失败！")
            this.loading = false;
        })
      },
      /* 保存对象 */
      onSave() {
        this.modifyObject();
      },

      modifyObject() {
        let _object = JSON.parse(JSON.stringify(this.editObject));
        this.loading = true;
        this.confirmLoading = true;

        this.global.axios.put(`/suppliers/${this.editObject.id}`, _object)
          .then(resp => {
            let _newObject = resp.data;
            this.$message({type: 'success', message: '操作成功'});
            this.loading = false;
            this.confirmLoading = false;

            this.editObject = _newObject;
            // 回传消息
            this.dialogVisible = false,
            this.$emit("modifyCBEvent", _newObject);
          })
          .catch(err => {
            this.loading = false;
            this.confirmLoading = false;
          })
      },

       /* 开启弹出编辑框 需要传主键ID */
      openDialog(primaryId) {
        this.primaryId = primaryId;
        this.dialogVisible = true;
        this.initData();
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

  .ph-table .el-form /deep/ .el-form-item {
    margin-bottom: 0 !important;
  }

  .el-row{
    margin: 10px 0 0 0;
  }


</style>

