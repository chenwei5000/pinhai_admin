<template>
  <div class="app-container">
    <div class="ph-card">
      <ph-card-header :title="title" type="table"></ph-card-header>
      <div class="ph-card-body">
        <procurementTable 
          ref="procurementTable" 
          @openEditDialog="openEditDialog"
          @openDetailDialog="openDetailDialog"
          ></procurementTable>
      </div>
    </div>

    <editDialog ref="editDialog" @refresh="refreshList"></editDialog>

    <detailDialog ref="detailDialog"></detailDialog>
  </div>
</template>

<script>
import procurementTable from "./components/table";
import editDialog from "./components/editDialog";
import detailDialog from "./components/detailDialog";

export default {
  name: "procurement",
  components: {
    procurementTable,
    editDialog,
    detailDialog
  },

  data() {
    return {
      title: "采购单列表"
    };
  },
  computed: {},
  methods: {
    openEditDialog(row) {
      console.log("openEditDialog");
      this.$refs.editDialog.$emit("openDialog", row);
    },
    openDetailDialog(row) {
      console.log("openDetailDialog");
      this.$refs.detailDialog.$emit("openDialog", row);
    },
    refreshList() {
      // 更新列表
      this.$ref.procurementTable.getList();
    }
  },
  watch: {}
};
</script>

<style scoped>
.ph-table {
  padding: 10px 15px;
}
</style>
