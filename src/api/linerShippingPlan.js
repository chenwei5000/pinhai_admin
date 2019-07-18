import global from './global.js'
import store from '@/store'


const LinerShippingPlanModel = {

  generateEventTitle: (plan) => {
    if (!plan) {
      return null;
    }

    var class_name = "label-grey";
    var title = '&nbsp;&nbsp;<i class="el-icon-bell"></i>&nbsp;&nbsp;';

    if (plan.type == '空运') {
      title = '&nbsp;&nbsp;<i class="el-icon-s-promotion"></i>&nbsp;&nbsp;';
    }

    if (plan.code) {
      title += '(' + plan.code + ') ';
    }

    if (plan.portOfLoading) {
      title += '[' + plan.portOfLoading + '] ';
    }

    if (plan.categoryName) {
      title += plan.categoryName;
    }

    if (plan.status > 5 && plan.status < 11) {
      switch (plan.status) {
        case 6:
          title += " (SHIPPED)";
          break;
        case 7:
          title += " (IN_TRANSIT)";
          break;
        case 8:
          title += " (DELIVERED)";
          break;
        case 9:
          title += " (CHECKED_IN)";
          break;
        case 10:
          title += " (RECEIVING)";
          break;
      }
    }

    if (plan.status == 11) {
      class_name = "label-inverse";
    }
    else if (plan.status == 12) {
      class_name = "label-pink";
    }
    else if (plan.status >= 6) {
      class_name = "label-info";
    }
    else {
      if (plan.overdue) {
        class_name = "label-danger";
      }
      else if (plan.status == 1) {
        class_name = "label-grey";
      }
      else if (plan.status == 2) {
        class_name = "label-yellow";
      }
      else if (plan.status == 3) {
        class_name = "label-success";
      }
      else {
        class_name = "label-pink";
      }
    }

    return {
      className: class_name,
      title: title,
    }
  }

}

export default LinerShippingPlanModel;
