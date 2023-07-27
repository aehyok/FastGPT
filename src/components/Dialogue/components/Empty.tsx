/*
 * @Author: aehyok 455043818@qq.com
 * @Date: 2023-05-16 06:03:41
 * @LastEditors: aehyok 455043818@qq.com
 * @LastEditTime: 2023-05-16 07:36:23
 * @FilePath: /FastGPT/src/pages/chat/components/Empty.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import { Card, Box, Image, Flex } from '@chakra-ui/react';
import { useMarkdown } from '@/hooks/useMarkdown';
import Markdown from '@/components/Markdown';
import { LOGO_ICON } from '@/constants/chat';

const Empty = ({
  model: { name, intro, avatar }
}: {
  model: {
    name: string;
    intro: string;
    avatar: string;
  };
}) => {
  const { data: chatProblem } = useMarkdown({ url: '/chatProblem.md' });
  const { data: versionIntro } = useMarkdown({ url: '/versionIntro.md' });

  return (
    <Box
      minH={'100%'}
      w={'85%'}
      maxW={'600px'}
      m={'auto'}
      py={'5vh'}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Card p={4} mb={10}>
        <Flex mb={2} alignItems={'center'} justifyContent={'center'}>
          <Image
            src={avatar || LOGO_ICON}
            w={'32px'}
            maxH={'40px'}
            objectFit={'contain'}
            alt={''}
          />
          <Box ml={3} fontSize={'3xl'} fontWeight={'bold'}>
            {name} {avatar}
          </Box>
        </Flex>
        <Box whiteSpace={'pre-line'}>{intro}1111</Box>
      </Card>
      {/* version intro */}
      <Card p={4} mb={10} display={'none'}>
        <Markdown source={versionIntro} />
      </Card>
      <Card p={4} display={'none'}>
        <Markdown source={chatProblem} />
      </Card>
    </Box>
  );
};

export default Empty;
