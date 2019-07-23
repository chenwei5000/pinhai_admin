<template>
  <el-dialog title="权限选择" :visible.sync="dialogVisible" width="65%" style="height: 500px; overflow:auto;">
      <el-scrollbar>
      <div class="custom-tree-container">
        <div class="block">
          <el-tree
            ref="tree"
            :data="list"
            show-checkbox
            node-key="id"
            :default-expand-all="true"
            :expand-on-click-node="false"
            :check-on-click-node="true"
            v-loading="loading"
          ></el-tree>
        </div>

      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">保 存</el-button>
      </div>
    </el-scrollbar>
  </el-dialog>
</template>

<script>
// loading 组件

export default {
  props: {},

  data() {
    return {
      list: [],
      dialogVisible: false,
      loading: false
    };
  },
  methods: {
    save() {},
    setDefault(id) {
      let url = `/rolePowers?roleId=${id}`;
      this.global.axios.get(url).then(data => {
        let selected = [];
        if (data.status == 200) {
          let list = data.data;
          for (let i = 0; i < list.length; i++) {
            const e = list[i];
            let selectedId = e.actionId;

            let temp = {
              id: selectedId
            };
            selected.push(temp);
          }
          console.log('selected ', selected)
          this.$refs.tree.setCheckedNodes(selected);
          this.loading = false;
        }
      });
    }
  },
  mounted() {
    this.$on("openDiaLog", id => {
      this.dialogVisible = true;
      this.loading = true;
      // showLoading('.custom-tree-container')
      // if(!this.list.length) {
      //   this.setDefault(id)
      //   return
      // }
      let url = `/actions`;
      this.global.axios.get(url).then(data => {
        let goal = [
          {
            // id: "0-root",
            label: "权限",
            children: []
          }
        ];
        if (data.status == 200) {
          let list = data.data;
          for (let i = 0; i < list.length; i++) {
            const e = list[i];
            let parent = e["resource"];

            let idx = goal[0].children.findIndex(element => {
              return element.label == parent;
            });
            if (idx == -1) {
              // 没有找到
              let temp = {
                // 'id': `${i}-parent`,
                label: parent,
                children: [
                  {
                    id: `${e.id}`,
                    label: e["title"]
                  }
                ]
              };
              goal[0].children.push(temp);
            } else {
              let temp = {
                id: `${e.id}`,
                label: e["title"]
              };
              goal[0].children[idx].children.push(temp);
            }
          }
          this.list = goal;
          console.log("goal ", this.list);
          this.setDefault(id);
        }
      });
    });
  }
};
</script>


<style>
</style>
