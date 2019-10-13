<template>
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

    <div style="text-align: center;padding-top: 5px;">
      <el-button type="primary" size="small" @click="save">保 存</el-button>
    </div>
  </div>

</template>

<script>
  // loading 组件

  export default {
    props: {
      userId: {
        type: Number,
        default: 0
      }
    },

    data() {
      return {
        list: [],
        loading: false,
        filterText: '',
      };
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },

    mounted() {
      this.$nextTick(() => {
        this.initData();
      })
    },

    methods: {
      initData() {
        this.loading = true;
        let goal = [
          {
            // id: "0-root",
            label: "角色",
            children: []
          }
        ];

        // 获取角色信息
        let url = `/roles?filters=${JSON.stringify({
          "groupOp": "AND",
          "rules": [{
            field: "status",
            op: 'eq',
            data: 1
          }]
        })}&sort=name&dir=asc`;

        this.global.axios.get(url).then(data => {
          data.data.forEach(res => {
            goal[0].children.push({id: res.id, label: res.name});
          });

          this.setDefault();
          this.list = goal;
        });
      },

      save() {
        let data = this.$refs.tree.getCheckedNodes();

        let loading = this.$loading({
          lock: true,
          text: '保存中...',
          spinner: 'el-icon-upload',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        let postData = []

        for (let i = 0; i < data.length; i++) {
          const e = data[i];
          if (e.id) {
            let temp = {}
            temp.roleId = e.id;
            temp.userId = this.userId;
            postData.push(temp);
          }
        }

        let url = `/roleToUsers?userId=${this.userId}`
        this.global.axios.post(url, postData).then(data => {
          if (data.status == 200) {
            this.$message.info('操作成功！')
          }
          loading.close();
        })
      },

      setDefault() {
        let url = `/roleToUsers?userId=${this.userId}`;

        this.global.axios.get(url).then(data => {
          let selected = [];
          if (data.status == 200) {
            let list = data.data;
            for (let i = 0; i < list.length; i++) {
              const e = list[i];
              let selectedId = e.roleId;

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
