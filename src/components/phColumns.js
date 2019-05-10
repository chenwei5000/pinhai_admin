import {parseTime} from '@/utils'

const phColumns = {

  id: {prop: 'id', label: 'ID', sortable: 'true', hidden: true, width: 100},

  creator: {prop: 'creator.name', label: '创建人', width: 100},

  status: {
    prop: 'status',
    label: '状态',
    width: 80,
    formatter: row => (row.status === 1 ? '启用' : '禁用')
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
