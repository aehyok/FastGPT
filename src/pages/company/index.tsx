import React, { useEffect, useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import SearchableTable from '../../hooks/useTable';
// import { COLUMNS, data } from '@/constants/company';
import { Heading } from '@chakra-ui/react';
import { useCompanyConfig } from './config';
const Company = () => {
  // const [tableData, setTableData] = useState([]);
  const { tableData, operatingButton, getCompanyListFun, onConfirm, COLUMNS } = useCompanyConfig();
  // const onConfirm = async (val, type) => {
  //   console.log(val, type, '家啊大家啊设计的');
  //   if (type === 'add') {
  //     const newVal = val;
  //     newVal.id = tableData[tableData.length - 1].id + 1;
  //     await setTableData([...tableData, newVal]);
  //     await localStorage.setItem('companyTable', JSON.stringify([...tableData, newVal]));
  //   } else if (type === 'edit') {
  //     const realceData = tableData.findIndex((res) => res.id === val.id);
  //     tableData.splice(realceData, 1, val);
  //     await localStorage.setItem('companyTable', JSON.stringify(tableData));
  //   } else if (type === 'enable') {
  //     tableData.forEach((res) => {
  //       if (res.id === val.id) {
  //         console.log('asd');
  //         res.status = res.status === 0 ? 1 : 0;
  //       }
  //     });
  //     await localStorage.setItem('companyTable', JSON.stringify(tableData));
  //   } else if (type === 'remove') {
  //     const newData = tableData.filter((res) => res.id !== val.id);
  //     console.log(newData, 'newData');
  //     await setTableData(newData);
  //     await localStorage.setItem('companyTable', JSON.stringify(newData));
  //   }
  // };
  useEffect(() => {
    // if (localStorage.getItem('companyTable')) {
    //   setTableData(JSON.parse(localStorage.getItem('companyTable')));
    // } else {
    //   localStorage.setItem('companyTable', JSON.stringify(data));
    //   setTableData(data);
    // }
    // getCompanyListFun()
  }, []);
  return (
    <Flex h={'100%'} position={'relative'} direction={'column'}>
      {/* 模型列表 */}
      <Box position={'relative'} m={5} display="flex" justifyContent={'flex-start'}>
        {/* <CompanySearch /> */}
        {/* {modelId && <ModelDetail modelId={modelId} isPc={isPc} />} */}
        <Heading>企业管理</Heading>
      </Box>

      <Box flex={1} h={'100%'} position={'relative'} m={5}>
        {/* <CompanyTable /> */}
        <SearchableTable
          columns={COLUMNS}
          operatingButton={operatingButton}
          onConfirm={onConfirm}
        />
        {/* {modelId && <ModelDetail modelId={modelId} isPc={isPc} />} */}
      </Box>
    </Flex>
  );
};
export default Company;
