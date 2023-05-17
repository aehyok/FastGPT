/*
 * @Author: aehyok 455043818@qq.com
 * @Date: 2023-05-16 06:03:41
 * @LastEditors: aehyok 455043818@qq.com
 * @LastEditTime: 2023-05-18 06:37:29
 * @FilePath: /FastGPT/src/pages/model/share/components/list.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import { Box, Flex, Image, Button } from '@chakra-ui/react';
import type { ShareModelItem } from '@/types/model';
import { useRouter } from 'next/router';
import MyIcon from '@/components/Icon';
import styles from '../index.module.scss';

const ShareModelList = ({
  models = [],
  onclickCollection
}: {
  models: ShareModelItem[];
  onclickCollection: (modelId: string) => void;
}) => {
  const router = useRouter();

  return (
    <>
      {models.map((model) => (
        <Flex
          flexDirection={'column'}
          key={model._id}
          p={4}
          border={'1px solid'}
          borderColor={'gray.200'}
          borderRadius={'md'}
        >
          <Flex alignItems={'center'}>
            <Image
              src={model.avatar}
              alt={'avatar'}
              w={['28px', '36px']}
              h={['28px', '36px']}
              objectFit={'cover'}
            />
            <Box fontWeight={'bold'} fontSize={'lg'} ml={5}>
              {model.name}
            </Box>
          </Flex>
          <Box flex={1} className={styles.intro} my={4} fontSize={'sm'} color={'blackAlpha.600'}>
            {model.share.intro || ''}
          </Box>
          <Flex justifyContent={'space-between'}>
            <Flex
              alignItems={'center'}
              cursor={'pointer'}
              color={model.isCollection ? 'myBlue.700' : 'blackAlpha.700'}
              onClick={() => onclickCollection(model._id)}
            >
              <MyIcon
                mr={1}
                name={model.isCollection ? 'collectionSolid' : 'collectionLight'}
                w={'16px'}
              />
              {model.share.collection}
            </Flex>
            <Box>
              <Button
                size={'sm'}
                variant={'outline'}
                w={['60px', '80px']}
                onClick={() => router.push(`/chat?modelId=${model._id}`)}
              >
                体验
              </Button>
              {model.share.isShareDetail && (
                <Button
                  ml={4}
                  size={'sm'}
                  w={['60px', '80px']}
                  onClick={() => router.push(`/model?modelId=${model._id}`)}
                >
                  详情
                </Button>
              )}
            </Box>
          </Flex>
        </Flex>
      ))}
    </>
  );
};

export default ShareModelList;
