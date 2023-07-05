import React, { useEffect, useState } from 'react';
import { getCompanyList, saveCompanyData } from '@/api/company';
import type { RequestType } from '@/types/request';
import { useToast } from '@/hooks/useToast';
export function useCompanyConfig() {
  const COLUMNS = ['name', 'shortName', 'logo', 'intro', 'address', 'email', 'phone'];
  const [tableData, setTableData] = useState([]);
  const { toast } = useToast();
  const Hint = new Map([
    ['add', '添加成功'],
    ['edit', '编辑成功'],
    ['remove', '移除成功']
  ]);

  const AddEditform = [
    {
      type: 'text',
      name: 'name',
      label: 'name',
      required: true
    },
    {
      type: 'text',
      name: 'shortName',
      label: 'shortName',
      required: true
    },
    {
      type: 'text',
      name: 'logo',
      label: 'logo',
      required: true
    },
    {
      type: 'text',
      name: 'intro',
      label: 'intro',
      required: true
    },
    {
      type: 'text',
      name: 'address',
      label: 'address',
      required: true
    },
    {
      type: 'text',
      name: 'email',
      label: 'email',
      required: true
    },
    {
      type: 'text',
      name: 'phone',
      label: 'phone',
      required: true
    }
  ];
  const operatingButton = [
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
      onClickType: 'enable',
      dialogTitle: (item) => {
        switch (item.status) {
          case 1:
            return `是否禁用${item.shortName}`;
          case 0:
            return `是否启用${item.shortName}`;
          default:
            return '';
        }
      },
      render: (item) => {
        switch (item.status) {
          case 1:
            return `禁用`;
          case 0:
            return `启用`;
          default:
            return '';
        }
      },
      dialogDescription: (item) => {
        switch (item.status) {
          case 1:
            return `提示：禁用后该企业账号不能使用`;
          case 0:
            return `提示：启用该企业账号`;
          default:
            return '';
        }
      }
    },
    {
      type: 'end',
      name: '移除',
      onClickType: 'remove',
      dialogTitle: '移除',
      dialogDescription: '是否移除该企业用户'
    }
  ];

  const getCompanyListFun = async () => {
    const {
      code,
      data: { docs }
    } = (await getCompanyList({ page: 1, limit: 1 })) as RequestType;
    if (code === 200) {
      setTableData(docs);
    }
  };

  const onConfirm = async (
    val: { [key: string]: any },
    type: 'add' | 'edit' | 'enable' | 'remove'
  ) => {
    if (['add', 'edit'].includes(type)) {
      console.log();
      const { code } = (await saveCompanyData({ ...val })) as RequestType;
      if (code === 200) {
        toast({
          title: Hint.get(type),
          status: 'success'
        });
        return true;
      }

      // const newVal = val;
      // newVal.id = tableData[tableData.length - 1].id + 1;
      // await setTableData([...tableData, newVal]);
      // await localStorage.setItem('companyTable', JSON.stringify([...tableData, newVal]));
    }

    // else if (type === 'edit') {
    //   saveCompanyData({
    //     ...val
    //   })
    // } else if (type === 'enable') {
    //   tableData.forEach((res) => {
    //     if (res.id === val.id) {
    //       console.log('asd');
    //       res.status = res.status === 0 ? 1 : 0;
    //     }
    //   });
    //   await localStorage.setItem('companyTable', JSON.stringify(tableData));
    // } else if (type === 'remove') {
    //   const newData = tableData.filter((res) => res.id !== val.id);
    //   console.log(newData, 'newData');
    //   await setTableData(newData);
    //   await localStorage.setItem('companyTable', JSON.stringify(newData));
    // }
  };

  return {
    tableData,
    operatingButton,
    getCompanyListFun,
    onConfirm,
    COLUMNS
  };
}
