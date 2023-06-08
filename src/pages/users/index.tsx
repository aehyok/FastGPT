import React, { useEffect, useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import SearchableTable from '../../hooks/useTable';
import CompanyList from './components/CompanyList';

import { COLUMNS, data, userData, USERCOLUMNS } from '@/constants/company';
import { Heading } from '@chakra-ui/react';
import { operatingButton } from './config';
const Users = () => {
  const [tableData, setTableData] = useState([]);
  const [companyId, setCompanyId] = useState(1);
  const onConfirm = async (val, type) => {
    console.log(val, type, '家啊大家啊设计的');
    if (type === 'add') {
      const newVal = val;
      newVal.id = tableData[tableData.length - 1].id + 1;
      await setTableData([...tableData, newVal]);
      await localStorage.setItem('companyTable', JSON.stringify([...tableData, newVal]));
    } else if (type === 'edit') {
      const realceData = tableData.findIndex((res) => res.id === val.id);
      tableData.splice(realceData, 1, val);
      await localStorage.setItem('companyTable', JSON.stringify(tableData));
    } else if (type === 'enable') {
      tableData.forEach((res) => {
        if (res.id === val.id) {
          console.log('asd');
          res.status = res.status === 0 ? 1 : 0;
        }
      });
      await localStorage.setItem('companyTable', JSON.stringify(tableData));
    } else if (type === 'remove') {
      const newData = tableData.filter((res) => res.id !== val.id);
      console.log(newData, 'newData');
      await setTableData(newData);
      await localStorage.setItem('companyTable', JSON.stringify(newData));
    }
  };
  useEffect(() => {
    // if (localStorage.getItem('companyTable')) {
    //   setTableData(JSON.parse(localStorage.getItem('companyTable')));
    // } else {
    //   localStorage.setItem('companyTable', JSON.stringify(data));
    //   setTableData(data);
    // }
    const newData = userData.filter((res) => res.id === companyId);
    console.log(newData, 'newData');
    setTableData(newData);
  }, []);
  const changeCompany = (id) => {
    console.log('二百年后', id);

    setCompanyId(id);
    const newData = userData.filter((res) => res.id === id);
    console.log(newData, 'newData');
    setTableData(newData);
  };
  return (
    <Flex h={'100%'} position={'relative'}>
      <Box w={['100%', '250px']}>
        <CompanyList companyId={companyId} changeCompany={changeCompany} />
      </Box>
      <Flex h={'100%'} flex={1} position={'relative'} direction={'column'}>
        {/* 模型列表 */}
        <Box position={'relative'} m={5} display="flex" justifyContent={'flex-start'}>
          {/* <CompanySearch /> */}
          {/* {modelId && <ModelDetail modelId={modelId} isPc={isPc} />} */}
          {/* <Heading>企业管理</Heading> */}
        </Box>

        <Box flex={1} h={'100%'} position={'relative'} m={5}>
          {/* <CompanyTable /> */}
          <SearchableTable
            data={tableData}
            columns={USERCOLUMNS}
            operatingButton={operatingButton}
            onConfirm={onConfirm}
          />
          {/* {modelId && <ModelDetail modelId={modelId} isPc={isPc} />} */}
        </Box>
      </Flex>
    </Flex>
  );
};
export default Users;
