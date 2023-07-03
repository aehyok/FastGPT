import React, { useEffect } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Dialogue from '@/components/Dialogue';

const Summary = ({ type, isPcDevice }: { type: string; isPcDevice: boolean }) => {
  useEffect(() => {}, []);
  return (
    <Flex h={'100%'} position={'relative'} direction={'column'}>
      {/* 模型列表 */}
      <Box flex={1} h={'100%'} position={'relative'}>
        <Dialogue type={type} isPcDevice={isPcDevice} />
      </Box>
    </Flex>
  );
};

Summary.getInitialProps = ({ query, req }: any) => {
  return {
    type: query?.type || '',
    isPcDevice: !/Mobile/.test(req ? req.headers['user-agent'] : navigator.userAgent)
  };
};
export default Summary;
