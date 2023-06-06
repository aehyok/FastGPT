export const operatingButton = [
  {
    type: 'head',
    name: '新增',
    onClickType: 'add'
  },
  {
    type: 'end',
    name: '编辑',
    onClickType: 'edit'
  },
  {
    type: 'end',
    name: '禁用',
    onClickType: 'edit',
    render: (item) => {
      console.log(item, '兼顾哦多');

      return '启用';
    }
  },
  {
    type: 'end',
    name: '移除',
    onClickType: 'edit'
  }
];
