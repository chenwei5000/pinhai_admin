<template>

  <div class="ph-form">
    <ph-form :content="form" ref="dialogForm" v-bind="formAttrs">
    </ph-form>
  </div>
</template>

<script>
  import phFormItems from '@/components/phFromItems'
  import validRules from '@/components/validRules'
  import categoryModel from '@/api/category'
  import store from '@/store'

  export default {
    name: 'CartonspecDialog',
    components: {},
    props: {},
    data() {
      return {
        // 弹窗表单默认样式
        formAttrs: {
          "label-width": "100px",
          "label-suffix": ":",
          "status-icon": true,
          "inline-message": true,
          size: "small"
        },
        //添加或修改弹出框
        form: [
          {
            $type: 'select',
            $id: 'categoryId',
            label: '分类',
            $el: {
              filterable: true,
              placeholder: '请选择分类,可筛选',
              size: 'mini',
            },
            $options: categoryModel.getMineSelectProdcutOptions(),
            rules: [
              validRules.required
            ]
          },
          phFormItems.code,
          {
            $type: 'input',
            $id: 'length',
            label: '长(Cm)',
            $el: {
              placeholder: '请输入箱子长度',
              size: 'mini',
            },
            rules: [
              validRules.required,
              validRules.number
            ]
          },
          {
            $type: 'input',
            $id: 'width',
            label: '宽(Cm)',
            $el: {
              placeholder: '请输入箱子宽度',
              size: 'mini',
            },
            rules: [
              validRules.required,
              validRules.number
            ]
          },
          {
            $type: 'input',
            $id: 'height',
            label: '高(Cm)',
            $el: {
              placeholder: '请输入箱子高度',
              size: 'mini',
            },
            rules: [
              validRules.required,
              validRules.number
            ]
          },
          {
            $type: 'input',
            $id: 'grossWeight',
            label: '皮重(Kg)',
            $el: {
              placeholder: '箱子和箱中填充物的重量，不包含产品的重量',
              size: 'mini',
            },
            rules: [
              validRules.required,
              validRules.number
            ]
          },
          phFormItems.yesOrNo('pallet', '是否打托', 0),
          {
            $type: 'input',
            $id: 'numberOfPallets',
            label: '托盘放置数',
            $default: 1,
            $el: {
              placeholder: '一个托盘上可以放置该箱规的最大箱数, 如：24',
              size: 'mini',
            },
            rules: [
              validRules.number
            ]
          },
        ]
      }
    },
    methods: {
      //保存
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
          let url = '/cartonSpecs'

          this.global.axios.post(url, data)
            .then(resp => {
              this.$message({type: 'success', message: '箱规添加成功'});
              this.$refs.dialogForm.resetFields();
              let obj = resp.data;

              // 清除缓存
              store.commit('app/SET_CARTONSPECS', null);

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
