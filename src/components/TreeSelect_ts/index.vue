<!-- Vue SFC -->
<template>
  <div id="app">
    <treeselect
      v-model="value"
      :options="options"
      :disable-branch-nodes="true"
      :show-count="true"
      :multiple="true"
      placeholder="选择"
    />
  </div>
</template>

<script>
// 详细文档在这里：
// https://ayiaq1.github.io/el-tree-select/website/#/components/ElTreeSelect
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  // register the component
  components: { Treeselect },
  data() {
    return {
      // define the default value
      value: null,
      // define options
      options: [
        {
          id: "a",
          label: "a",
          children: [
            {
              id: "aa",
              label: "aa"
            },
            {
              id: "ab",
              label: "ab"
            }
          ]
        },
        {
          id: "b",
          label: "b"
        },
        {
          id: "c",
          label: "c"
        }
      ]
    };
  }
};
</script>
