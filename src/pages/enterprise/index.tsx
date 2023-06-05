import React, { useEffect } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import EnterpriseTable from './components/enterpriseTable';
import EnterpriseSearch from './components/enterpriseSearch';
import SearchableTable from '../../hooks/useTable';
import { COLUMNS, data } from '@/constants/enterprise';
import { Heading } from '@chakra-ui/react';
const Enterprise = () => {
  return (
    <Flex h={'100%'} position={'relative'} direction={'column'}>
      {/* 模型列表 */}
      <Box position={'relative'} m={5} display="flex" justifyContent={'flex-start'}>
        {/* <EnterpriseSearch /> */}
        {/* {modelId && <ModelDetail modelId={modelId} isPc={isPc} />} */}
        <Heading>企业管理</Heading>
      </Box>

      <Box flex={1} h={'100%'} position={'relative'} m={5}>
        {/* <EnterpriseTable /> */}
        <SearchableTable data={data} columns={COLUMNS} />
        {/* {modelId && <ModelDetail modelId={modelId} isPc={isPc} />} */}
      </Box>
    </Flex>
  );
};
export default Enterprise;
