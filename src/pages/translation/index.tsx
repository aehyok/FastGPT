import React, { useEffect, useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Dialogue from '@/components/Dialogue';
// import { COLUMNS, data } from '@/constants/company';
import dynamic from 'next/dynamic';
import Loading from '@/components/Loading';
import { Heading } from '@chakra-ui/react';

const RadioCard = dynamic(() => import('./components/RadioCard'), {
  loading: () => <Loading fixed={false} />,
  ssr: false
});
const Translation = ({ isPcDevice }: { isPcDevice: boolean }) => {
  return (
    <Flex h={'100%'} position={'relative'} direction={'column'}>
      <Box position={'relative'} m={5} display="flex" justifyContent={'flex-start'}>
        <Heading>翻译</Heading>
      </Box>
      {/* 模型列表 */}
      <Box flex={1} h={'100%'} position={'relative'}>
        <Dialogue type={'translate'} isPcDevice={isPcDevice} RadioCard={RadioCard} />
      </Box>
    </Flex>
  );
};

Translation.getInitialProps = ({ query, req }: any) => {
  return {
    isPcDevice: !/Mobile/.test(req ? req.headers['user-agent'] : navigator.userAgent)
  };
};
export default Translation;
