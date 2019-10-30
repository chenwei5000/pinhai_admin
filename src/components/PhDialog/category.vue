<template>

  <div class="ph-form">
    <ph-form :content="form" ref="dialogForm" v-bind="formAttrs">
    </ph-form>
  </div>

</template>

<script>
  import validRules from '@/components/validRules'
  import userModel from '@/api/user'
  import store from '@/store'

  export default {
    name: 'CategoryDialog',
    components: {},
    props: {},
    data() {
      return {
        // 弹窗表单默认样式
        formAttrs: {
          "label-width": "100px",
          "label-suffix": ":",
          "status-icon": true,
          size: "small"
        },
        form: [
          {
            $type: 'input',
            $id: 'name',
            label: '分类名称',
            $el: {
              placeholder: '请输入分类名称',
              size: 'mini',
            },
            rules: [
              validRules.required
            ]
          },
          {
            $type: 'select',
            $id: 'userId',
            label: '采购负责人',
            $el: {
              placeholder: '请选择采购负责人,可筛选',
              filterable: true,
              size: 'mini',
            },
            $options: userModel.getSelectOptions(),
            rules: [
              validRules.required
            ]
          }
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
            {},
            this.$refs.dialogForm.getFormValue()
          );

          // 新增逻辑
          let url = '/categories'

          this.global.axios.post(url, data)
            .then(resp => {
              this.$message({type: 'success', message: '分类添加成功'});
              this.$refs.dialogForm.resetFields();
              let obj = resp.data;

              // 清除缓存
              store.commit('app/SET_CATEGORIES', null);

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
