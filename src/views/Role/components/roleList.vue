<template>

  <el-dialog title="权限选择" :visible.sync="dialogVisible" width="65%" top="5vh">
    <div class="custom-tree-container">
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText">
      </el-input>
      <div class="block" style="height: 400px;">
        <el-scrollbar style="height: 100%">
          <el-tree
            ref="tree"
            :data="list"
            show-checkbox
            node-key="id"
            :default-expand-all="true"
            :expand-on-click-node="false"
            :check-on-click-node="true"
            v-loading="loading"
            :filter-node-method="filterNode"
          ></el-tree>
        </el-scrollbar>
      </div>

    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="formVisible = false">取 消</el-button>
      <el-button type="primary" @click="save">保 存</el-button>
    </div>
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
        loading: false,
        filterText: '',
      };
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    methods: {
      save() {
      },
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
      },

      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
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

<style type="text/less" lang="scss" scoped>
  .el-scrollbar {
    /deep/ .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
</style>
