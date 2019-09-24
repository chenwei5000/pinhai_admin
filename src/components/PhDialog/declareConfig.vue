<template>

  <ph-form :content="form" ref="dialogForm" v-bind="formAttrs">
  </ph-form>

</template>

<script>
  import validRules from '@/components/validRules'
  import phFromItems from '../../components/phFromItems'
  import store from '@/store'

  export default {
    name: 'DeclareConfigDialog',
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
          {
            $type: 'input',
            $id: 'id',
            label: '报关码',
            $el: {
              placeholder: '请输入报关码'
            },
            rules: [
              validRules.required
            ]

          },
          {
            $type: 'input',
            $id: 'name',
            label: '申报名(中)',
            $el: {
              placeholder: '请输入中文申报名'
            },
            rules: [
              validRules.required
            ]
          },
          {
            $type: 'input',
            $id: 'ename',
            label: '申报名(英)',
            $el: {
              placeholder: '请输入英文申报名'
            },
            rules: [
              validRules.required
            ]
          },
          {
            $type: 'input',
            $id: 'unit',
            label: '申报单位',
            $el: {
              placeholder: '请输入申报单位'
            },
          },
          {
            $type: 'input',
            $id: 'tax',
            label: '税率(%)',
            $el: {
              placeholder: '请输入税率(%)'
            },
          },
          {
            $type: 'input',
            $id: 'refundTax',
            label: '退税率(%)',
            $el: {
              placeholder: '请输入退税率(%)'
            },
          },
          {
            $type: 'input',
            $id: 'note',
            label: '备注',
            $el: {
              placeholder: '请输入备注'
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
          let url = '/declareConfigs'

          this.global.axios.post(url, data)
            .then(resp => {
              this.$message({type: 'success', message: '报关码添加成功'});
              this.$refs.dialogForm.resetFields();
              let obj = resp.data;

              // 清除缓存
              store.commit('app/SET_DECLARECONFIGS', null);
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
