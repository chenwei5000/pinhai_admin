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
            label: "权限",
            children: []
          }
        ];

        let base = {
          label: "基础",
          children: [
            {id: "-1#ADMIN", label: "管理员"},
            {id: "-1#PRICE", label: "采购价"},
            {id: "-1#SUPPLIERINFO", label: "供货商信息"}
          ]
        }
        goal[0].children.push(base);

        // 获取分类信息
        let url = `/categories/permissions?filters=${JSON.stringify({
          "groupOp": "AND",
          "rules": [{
            field: "status",
            op: 'eq',
            data: 1
          }]
        })}&sort=name&dir=asc`;

        let category = {
          label: "分类",
          children: [{id: `-1#CATEGORY`, label: "全部"}]
        }
        this.global.axios.get(url).then(data => {
          data.data.forEach(res => {
            category.children.push({id: `${res.id}#CATEGORY`, label: res.name});
          })
          goal[0].children.push(category);

          // 获取原料分类信息
          url = `/categories/permissionMaterials?filters=${JSON.stringify({
            "groupOp": "AND",
            "rules": [{
              field: "status",
              op: 'eq',
              data: 1
            }]
          })}&sort=name&dir=asc`;

          let mCategory = {
            label: "原料分类",
            children: []
          }
          this.global.axios.get(url).then(data => {
            data.data.forEach(res => {
              mCategory.children.push({id: `${res.id}#CATEGORY`, label: res.name});
            })
            goal[0].children.push(mCategory);
            // 获取仓库信息
            url = `/warehouses?filters=${JSON.stringify({
              "groupOp": "AND",
              "rules": [{
                field: "status",
                op: 'eq',
                data: 1
              }]
            })}&sort=name&dir=asc`;

            let warehouse = {
              label: "仓库",
              children: [{id: `-1#WAREHOUSE`, label: "全部"}]
            }
            this.global.axios.get(url).then(data => {
              data.data.forEach(res => {
                warehouse.children.push({id: `${res.id}#WAREHOUSE`, label: res.name});
              })
              goal[0].children.push(warehouse);
              // 获取供货商信息
              url = `/suppliers?filters=${JSON.stringify({
                "groupOp": "AND",
                "rules": [{
                  field: "status",
                  op: 'eq',
                  data: 1
                }]
              })}&sort=name&dir=asc`;

              let supplier = {
                label: "供货商",
                children: [{id: `-1#SUPPLIER`, label: "全部"}]
              }

              this.global.axios.get(url).then(data => {
                data.data.forEach(res => {
                  supplier.children.push({id: `${res.id}#SUPPLIER`, label: res.name});
                })
                goal[0].children.push(supplier);
                this.setDefault();
                this.list = goal;
              });
            });
          });
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
            let val = e.id.split("#");
            let temp = {}
            temp.targetId = val[0];
            temp.targetType = val[1];
            postData.push(temp);
          }
        }

        let url = `/dataAuthorities/importData/${this.userId}`
        this.global.axios.post(url, postData).then(data => {
          if (data.status == 200) {
            this.$message.info('操作成功！')
          }
          loading.close();
        })
      },

      setDefault() {
        let url = `/dataAuthorities?filters=${JSON.stringify({
          "groupOp": "AND",
          "rules": [
            {
              field: "userId",
              op: 'in',
              data: this.userId
            },
            {
              field: "targetType",
              op: 'in',
              data: "ADMIN,CATEGORY,WAREHOUSE,SUPPLIER,PRICE,SUPPLIERINFO"
            }
          ]
        })}`;

        this.global.axios.get(url).then(data => {
          let selected = [];
          if (data.status == 200) {
            let list = data.data;
            for (let i = 0; i < list.length; i++) {
              const e = list[i];
              let selectedId = e.targetId + "#" + e.targetType;

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
