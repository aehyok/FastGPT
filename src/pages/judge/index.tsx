import React, { useEffect } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Dialogue from '@/components/Dialogue';
import { Heading } from '@chakra-ui/react';

const Summary = ({ isPcDevice }: { isPcDevice: boolean }) => {
  useEffect(() => {}, []);
  return (
    <Flex h={'100%'} position={'relative'} direction={'column'}>
      <Box position={'relative'} m={5} display="flex" justifyContent={'flex-start'}>
        <Heading>退换货</Heading>
      </Box>
      {/* 模型列表 */}
      <Box flex={1} h={'100%'} position={'relative'}>
        <Dialogue type={'judge'} isPcDevice={isPcDevice} />
      </Box>
    </Flex>
  );
};

Summary.getInitialProps = ({ query, req }: any) => {
  return {
    isPcDevice: !/Mobile/.test(req ? req.headers['user-agent'] : navigator.userAgent)
  };
};
export default Summary;
