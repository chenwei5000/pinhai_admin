import {currency,parseTime} from '@/utils'
import phEnumModel from '../api/phEnum'
import {checkPermission} from "../utils/permission";

const phColumns = {

  id: {prop: 'id', label: 'ID', sortable: 'custom', hidden: false, width: 80, align: "center"},

  creator: {prop: 'creator.name', label: '创建人', width: 80},

  status: {
    prop: 'status',
    label: '状态',
    width: 80,
    formatter: row => {
      let _status = phEnumModel.getSelectOptions("Status");
      let _label = '';
      _status.forEach(s => {
        if (s.value === row.status + '') {
          _label = s.label;
          return;
        }
      });
      return _label;
    }
  },
  jobStatus: {
    prop: 'jobStatus',
    label: '结算状态',
    width: 80,
    formatter: row => {
      let _status = phEnumModel.getSelectOptions("WarehouseOrderJobStatus");
      let _label = '';
      _status.forEach(s => {
        if (s.value === row.jobStatus + '') {
          _label = s.label;
          return;
        }
      });
      return _label;
    }
  },

  price: {
    prop: 'price',
    label: '采购价',
    width: 100,
    hidden: !checkPermission('PurchasePriceVisible'),
    formatter: row => {
      try {
        return  currency(row.price,row.currency.symbolLeft,2) ;
      }
      catch (e) {
        return row.price;
      }
    }
  },

  amount: {
    prop: 'amount',
    label: '总金额',
    hidden: !checkPermission('PurchasePriceVisible'),
    width: 100,
    formatter: row => {
      try {
        return  currency(row.amount,row.currency.symbolLeft,2) ;
      }
      catch (e) {
        return row.price;
      }
    }
  },
  lastModified: {
    prop: 'lastModified',
    label: '修改时间',
    width: 140,
    formatter: row => {
      try {
        return parseTime(row.lastModified, '{y}-{m}-{d} {h}:{i}');
      }
      catch (e) {
        return row.lastModified;
      }
    }
  },

  createTime: {
    prop: 'createTime',
    sortable:'custom',
    label: '创建时间',
    width: 140,
    formatter: row => {
      try {
        return parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}:{s}');
      }
      catch (e) {
        return row.createTime;
      }
    }
  }


}

export default phColumns;
