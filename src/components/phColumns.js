import {parseTime} from '@/utils'
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
  }

}

export default phColumns;
