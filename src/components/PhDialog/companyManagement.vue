<template>

  <ph-form :content="form" ref="dialogForm" v-bind="formAttrs">
  </ph-form>

</template>

<script>
  import validRules from '@/components/validRules'
  import phFromItems from '../../components/phFromItems'
  import datadicModel from '@/api/datadic'
  import store from '@/store'

  export default {
    name: 'CompanyManagementDialog',
    components: {},
    props: {},
    data() {
      return {
        // 弹窗表单默认样式
        formAttrs: {
          "label-width": "120px",
          "label-suffix": ":",
          "status-icon": true,
          size: "small"
        },
        form: [
          phFromItems.datadicName("type", '公司类型','采购公司', 'type'),
          {
            $type: 'input',
            $id: 'abbreviation',
            label: '简称',
            $el: {
              placeholder: '请输入公司简称'
            },
            rules: [
              validRules.required
            ]

          },
          {
            $type: 'input',
            $id: 'fullName',
            label: '全称',
            $el: {
              placeholder: '请输入公司全称'
            },
            rules: [
              validRules.required
            ]
          },
          {
            $type: 'input',
            $id: 'address',
            label: '地址',
            $el: {
              placeholder: '请输入公司地址'
            },
            rules: [
              validRules.required
            ]
          },
          phFromItems.datadic("region", '管理区域', '', 'region'),
          {
            $type: 'input',
            $id: 'taxNumber',
            label: '纳税人识别号',
            $el: {
              placeholder: '请输入纳税人识别号'
            },
          },
          {
            $type: 'input',
            $id: 'contact',
            label: '联系人',
            $el: {
              placeholder: '请输入联系人'
            },
          },
          {
            $type: 'input',
            $id: 'phone',
            label: '联系人电话',
            $el: {
              placeholder: '请输入联系人电话'
            },
          },
          phFromItems.status()
        ]
      }
    },
    methods: {
      ///////////////分类///////////////////////
      //保存分类
      confirm() {
        this.$refs.dialogForm.validate(valid => {
          if (!valid) {
            this.$emit("callback", null);
            return false;
          }
          let data = Object.assign(
            {status: 1},
            this.$refs.dialogForm.getFormValue()
          );

          // 新增逻辑
          let url = '/companyManagements'

          this.global.axios.post(url, data)
            .then(resp => {
              this.$message({type: 'success', message: '供应商添加成功'});
              this.$refs.dialogForm.resetFields();
              let obj = resp.data;

              // 清除缓存
              store.commit('app/SET_COMPANYMANAGEMENTS', null);
              // 回传消息
              this.$emit("callback", {type: 'sure', data: obj});
            })
            .catch(err => {
              this.$emit("callback", null);
            })
        });
      },
    }
  }

</script>

<style type="text/less" lang="scss" scoped>
</style>
