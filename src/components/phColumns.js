import {currency,parseTime} from '@/utils'
import phEnumModel from '../api/phEnum'

const phColumns = {

  id: {prop: 'id', label: 'ID', sortable: 'custom', hidden: false, width: 80},

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
