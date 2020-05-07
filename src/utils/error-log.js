import Vue from 'vue'
import store from '@/store'
import { isString, isArray } from '@/utils/validate'
import settings from "../store/modules/settings";
import {Message} from 'element-ui';

// you can set in settings.js
// errorLog:'production' | ['production', 'development']
const { errorLog: needErrorLog } = settings

function checkNeed() {
  return true;
  const env = process.env.NODE_ENV
  if (isString(needErrorLog)) {
    return env === needErrorLog
  }
  if (isArray(needErrorLog)) {
    return needErrorLog.includes(env)
  }
  return false
}

if (checkNeed()) {
  Vue.config.errorHandler = function(err, vm, info, a) {

    //Message.error({message: err})

  // Don't ask me why I use Vue.nextTick, it just a hack.
  // detail see https://forum.vuejs.org/t/dispatch-in-vue-config-errorhandler-has-some-problem/23500
    Vue.nextTick(() => {
      store.dispatch('errorLog/addErrorLog', {
        message: err,
        //url: window.location.href,
        title: window.location.href,
        time: new Date()
      })
      console.error(err, info)
    })
  }
}
