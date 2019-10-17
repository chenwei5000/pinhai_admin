<template>
  <div class="app-container">
    <el-form ref="configInfo" :model="configInfo" label-width="180px" :rules="rules" v-loading="loading">
      <el-form-item label="增值税税率1(%)" prop="valueAddedTax1">
        <el-input v-model="configInfo.valueAddedTax1"></el-input>
      </el-form-item>
      <el-form-item label="增值税税率2(%)" prop="valueAddedTax2">
        <el-input v-model="configInfo.valueAddedTax2"></el-input>
      </el-form-item>
      <el-form-item label="托盘重量(Kg)" prop="trayWeight">
        <el-input v-model="configInfo.trayWeight" ></el-input>
      </el-form-item>
      <el-form-item label="托盘体积(m³)" prop="trayVolume">
        <el-input v-model="configInfo.trayVolume" ></el-input>
      </el-form-item>
      <el-form-item label="预期利润报关使用(%)" prop="anticipatedProfit">
        <el-input v-model="configInfo.anticipatedProfit" ></el-input>
      </el-form-item>
      <el-form-item label="安全库存(周)" prop="safetyStockWeek">
        <el-input v-model="configInfo.safetyStockWeek" ></el-input>
      </el-form-item>
      <el-form-item label="Vip1安全库存(周)" prop="vip1SafetyStockWeek">
        <el-input v-model="configInfo.vip1SafetyStockWeek"  ></el-input>
      </el-form-item>
      <el-form-item label="Vip2安全库存(周)" prop="vip2SafetyStockWeek">
        <el-input v-model="configInfo.vip2SafetyStockWeek" ></el-input>
      </el-form-item>
       <el-form-item label="排除Amazon货柜" prop="desc">
        <el-input type="textarea" v-model="configInfo.invalidShipment" rows="3"></el-input>
       </el-form-item>
      <el-form-item>
        <el-button  v-if="hasEdit" type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
</el-form>
  </div>
</template>

<script>
  import validRules from '../../components/validRules'
  import phColumns from '../../components/phColumns'
  import phSearchItems from '../../components/phSearchItems'
  import phFromItems from '../../components/phFromItems'
   import global from '../../api/global.js'
  import {checkPermission} from "../../utils/permission";

  export default {
    data() {
      return {
        title: '基础配置',
        loading: false,
        configInfo: {
          valueAddedTax1: '',
          valueAddedTax2: '',
          trayWeight: '',
          trayVolume: '',
          anticipatedProfit: '',
          safetyStockWeek: '',
          vip1SafetyStockWeek: '',
          vip2SafetyStockWeek: '',
          invalidShipment: ''
        },
        rules: {
          valueAddedTax1: [
            {required: true, message: "不能为空"}
          ],
          valueAddedTax2: [
            {required: true, message: "不能为空"}
          ],
          trayWeight: [
            {required: true, message: "不能为空"}
          ],
          trayVolume: [
            {required: true, message: "不能为空"}
          ],
          safetyStockWeek: [
            {required: true, message: "不能为空"}
          ],
          vip1SafetyStockWeek: [
            {required: true, message: "不能为空"}
          ],
          vip2SafetyStockWeek: [
            {required: true, message: "不能为空"}
          ],
          invalidShipment: [
            {required: true, message: "不能为空"}
          ]
        }
      }
    },
    created() {
      global.axios.get("/configInfos").then(res => {
         this.configInfo = res.data;
      })
    },
    computed: {
        hasEdit(){
          if(!checkPermission('ConfigInfoResource_update')){
            return false;
          }
          return true;
      },
    },
    methods: {
        onSubmit: function(){
          this.loading=true
          this.$refs.configInfo.validate((valid) => {
            if(valid){
              global.axios.put('/configInfos', this.configInfo).then(resp => {
              setTimeout(() => {
                this.loading=false
              }, 500);
              this.$message({
                message: '修改成功！',
                type: 'success'
                });
              })
              .catch(err => {
              })
            }
          })

        }
    },
    watch: {
      //
    }
  }
</script>

<style scoped>
.app-container{
  background: white;
  width: 650px;
  text-align: center;
  margin: auto
}

</style>
