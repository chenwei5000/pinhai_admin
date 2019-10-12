<template>

  <el-dialog :title="title" class="ph-dialog"
             @close='closeDialog'
             :visible.sync="dialogVisible" v-if="dialogVisible" fullscreen>
    <div class="custom-tree-container">

      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText">
      </el-input>

      <div class="block" style="height: 460px;">
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
      <el-button type="primary" size="small" @click="save">保 存</el-button>
      <el-button size="small" @click="closeDialog">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  // loading 组件

  export default {
    props: {},

    data() {
      return {
        title: "",
        roleId: 0,
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
      openDiaLog(id, name) {
        this.roleId = id
        this.title = `${name} 权限管理`
        this.dialogVisible = true;
        this.loading = true;

        let url = `/actions?filters=${JSON.stringify({
          "groupOp": "AND",
          "rules": [{
            field: "status",
            op: 'eq',
            data: 1
          }]
        })}&sort=title&dir=desc`;

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
            this.setDefault(id);
          }
        });
      },

      closeDialog() {
        this.dialogVisible = false;
        this.loading = false;
        this.title = "";
        this.userId = 0;
        this.list = [];
        this.filterText = [];
      },

      save() {
        let data = this.$refs.tree.getCheckedNodes()
        let loading = this.$loading({
          lock: true,
          text: '保存中...',
          spinner: 'el-icon-upload',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let postData = []

        for (let i = 0; i < data.length; i++) {
          const e = data[i]
          let temp = {}
          temp.actionId = e.id
          postData.push(temp)
        }
        let url = `/rolePowers?roleId=${this.roleId}`
        this.global.axios.post(url, postData).then(data => {
          if (data.status == 200) {
            this.$message.info('操作成功！')
          }
          loading.close();
        })
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
            this.$refs.tree.setCheckedNodes(selected);
            this.loading = false;
          }
        });
      },

      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      }
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
