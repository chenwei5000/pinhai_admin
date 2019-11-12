import Vue from 'vue'

let common = {};
if (window)
  window.common = common;
/**
 *
 * 该common对象放置所有的共用方法
 * common.dialog()是调用弹框的方法
 */
common.dialog = function (option) {
  var m = document.createElement('div');

  if (option.parentel != null) {
    option.parentel.appendChild(m);
  } else {
    document.getElementsByTagName('body')[0].appendChild(m);
  }

  var _footer = '';

  var _d = common.clone(option.data == null ? {} : option.data);
  var v = '';
  var component = option.component;
  let template = '';
  if (typeof component == 'string') {
    template = `<el-dialog :title="title" class="ph-dialog" v-if="show" :visible.sync="show" :top="top" :width="width" @close="close"><el-scrollbar class="menu-wrapper" noresize><el-row><el-col :span="22"><${component} v-on:callback="callback" :init_data="data"> </${component}> </el-col></el-row></el-scrollbar></el-dialog>`;
  } else if (option.htmlText != null) {
    template = `<el-dialog :title="title" class="ph-dialog" v-if="show" :visible.sync="show" :top="top" :width="width" @close="close"><el-scrollbar class="menu-wrapper" noresize><el-row><el-col :span="22">${option.htmlText}</el-col></el-row></el-scrollbar></el-dialog>`;
  } else {
    template = '<el-dialog :style="style" class="ph-dialog" :title="title" :top="top" :visible.sync="show" :width="width" :before-close="handleClose" @close="close"><el-scrollbar class="menu-wrapper" noresize><el-row><el-col :span="22"><child ref="mychild" v-on:callback="callback" :init_data="data"></child></el-col></el-row></el-scrollbar><div slot="footer"><el-button @click="close" size="mini">取 消</el-button><el-button type="primary" @click="confirm" :loading="confirmLoading" size="mini">确 定</el-button></div></el-dialog>';
  }
  if (option.type && option.type == 'iframe') {
    v = new Vue({
      el: m,
      data: function () {
        return {
          title: option.title,
          url: option.url,
          width: option._width_ == null ? '50%' : option._width_,
          top: option._top_ == null ? '15vh' : option._top_,
          show: true,
          confirmLoading: false,
          data: _d,
        };
      },
      template: '<el-dialog :title="title" class="ph-dialog" v-if="show" :visible.sync="show" :top="top" :width="width"><iframe :src="url" style="width:100%;height:100%;"></iframe></child></el-dialog></div>',
    });
  } else {
    v = new Vue({
      el: m,
      data: function () {
        return {
          title: option.title,
          style: option.style,
          width: option._width_ == null ? 'small' : option._width_,
          top: option._top_ == null ? '15vh' : option._top_,
          show: true,
          confirmLoading: false,
          data: _d,
        };
      },
      template: template,
      mounted: function () {
      },
      methods: {
        handleClose(done) {
          if (option.close) {
            option.close();
          }
          done();
        },
        close() {
          if (option.close) {
            option.close();
          }
          this.show = false;
        },
        confirm() {
          //调用子对象提交方法
          this.confirmLoading = true;
          this.$refs.mychild.confirm();
        },

        callback(result) {
          this.confirmLoading = false;
          if(result == null){
            return;
          }
          if (option._source != null) {
            option.callback.call(option._source, result);
            this.show = false;
            return;
          }
          //如果不传type或者type等于close或cancel直接关闭弹框
          if (!result.type || result.type == 'close' || result.type == 'cancel') {
            this.show = false;
          } else if (result.type == 'sure') {
            //如果type等于sure则调用parent传递过来的回调函
            this.show = false;
            if (option.callback) {
              option.callback(result.data);
            }
          }
        },
      },
      components: {
        child: option.component,
      },
    });
  }
  return v;
};

common.clone = function clone(obj) {
  // Handle the 3 simple types, and null or undefined
  if (null == obj || 'object' != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
    var copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    var copy = [];
    for (var i = 0, len = obj.length; i < len; ++i) {
      copy[i] = clone(obj[i]);
    }

    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    var copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }

    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
};


export default common;
