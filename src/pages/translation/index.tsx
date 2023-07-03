import React, { useEffect, useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Dialogue from '@/components/Dialogue';
// import { COLUMNS, data } from '@/constants/company';
import dynamic from 'next/dynamic';
import Loading from '@/components/Loading';

const RadioCard = dynamic(() => import('./components/RadioCard'), {
  loading: () => <Loading fixed={false} />,
  ssr: false
});
const Translation = ({ type, isPcDevice }: { type: string; isPcDevice: boolean }) => {
  useEffect(() => {}, []);
  return (
    <Flex h={'100%'} position={'relative'} direction={'column'}>
      {/* 模型列表 */}
      <Box flex={1} h={'100%'} position={'relative'}>
        <Dialogue type={type} isPcDevice={isPcDevice} RadioCard={RadioCard} />
      </Box>
    </Flex>
  );
};

Translation.getInitialProps = ({ query, req }: any) => {
  return {
    type: query?.type || '',
    isPcDevice: !/Mobile/.test(req ? req.headers['user-agent'] : navigator.userAgent)
  };
};
export default Translation;
