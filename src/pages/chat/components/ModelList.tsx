/*
 * @Author: aehyok 455043818@qq.com
 * @Date: 2023-05-16 06:03:41
 * @LastEditors: aehyok 455043818@qq.com
 * @LastEditTime: 2023-05-18 06:37:22
 * @FilePath: /FastGPT/src/pages/chat/components/ModelList.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import { Box, Flex, Image } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ModelListItemType } from '@/types/model';

const ModelList = ({ models, modelId }: { models: ModelListItemType[]; modelId: string }) => {
  const router = useRouter();

  return (
    <>
      {models.map((item) => (
        <Box key={item._id}>
          <Flex
            key={item._id}
            position={'relative'}
            alignItems={['flex-start', 'center']}
            p={3}
            cursor={'pointer'}
            transition={'background-color .2s ease-in'}
            borderLeft={['', '5px solid transparent']}
            zIndex={0}
            _hover={{
              backgroundColor: ['', '#dee0e3']
            }}
            {...(modelId === item._id
              ? {
                  backgroundColor: '#eff0f1',
                  borderLeftColor: 'myBlue.600'
                }
              : {})}
            onClick={() => {
              router.replace(`/chat?modelId=${item._id}`);
            }}
          >
            <Image
              src={item.avatar || '/icon/logo.png'}
              alt=""
              w={'34px'}
              maxH={'50px'}
              objectFit={'contain'}
            />
            <Box flex={'1 0 0'} w={0} ml={3}>
              <Box className="textEllipsis" color={'myGray.1000'}>
                {item.name}
              </Box>
              <Box className="textEllipsis" color={'myGray.400'} fontSize={'sm'}>
                {item.systemPrompt || ''}
              </Box>
            </Box>
          </Flex>
        </Box>
      ))}
    </>
  );
};

export default ModelList;
