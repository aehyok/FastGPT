import React, { useEffect } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import TableList from './components/TableList';
import SearchList from './components/SearchList';
import SearchableTable from '../../hooks/useTable';
import { COLUMNS, data } from '@/constants/company';
import { Heading } from '@chakra-ui/react';
import { operatingButton } from './config';
const Company = () => {
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
        <SearchableTable data={data} columns={COLUMNS} operatingButton={operatingButton} />
        {/* {modelId && <ModelDetail modelId={modelId} isPc={isPc} />} */}
      </Box>
    </Flex>
  );
};
export default Company;
