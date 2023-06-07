const AddEditform = [
  {
    type: 'text',
    name: 'name',
    label: 'name：'
  },
  {
    type: 'text',
    name: 'shortName',
    label: 'shortName'
  },
  // {
  //   type: 'text',
  //   name: 'logo',
  //   label: 'logo'
  // }
  {
    type: 'text',
    name: 'intro',
    label: 'intro'
  },
  {
    type: 'text',
    name: 'address',
    label: 'address'
  },
  {
    type: 'text',
    name: 'email',
    label: 'email'
  },
  {
    type: 'text',
    name: 'phone',
    label: 'phone'
  }
];
export const operatingButton = [
  {
    type: 'head',
    name: '新增',
    onClickType: 'add',
    fields: AddEditform,
    dialogTitle: '添加企业'
  },
  {
    type: 'end',
    name: '编辑',
    onClickType: 'edit',
    fields: AddEditform,
    dialogTitle: '编辑企业'
  },
  {
    type: 'end',
    name: '禁用',
    onClickType: 'edit',
    render: (item) => {
      // console.log(item, '兼顾哦多');
      return '启用';
    }
  },
  {
    type: 'end',
    name: '移除',
    onClickType: 'edit'
  }
];
