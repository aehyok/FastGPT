import React, { useMemo } from 'react';
import { Box, Flex, Image, Tooltip } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import MyIcon from '../Icon';
import { useUserStore } from '@/store/user';
import { useChatStore } from '@/store/chat';

export enum NavbarTypeEnum {
  normal = 'normal',
  small = 'small'
}

const Navbar = () => {
  const router = useRouter();
  // console.log(router, "router");

  const { userInfo, lastModelId } = useUserStore();
  const { lastChatModelId, lastChatId } = useChatStore();
  const navbarList = useMemo(
    () => [
      {
        label: '邮件列表',
        icon: 'chat',
        link: `/chat?modelId=${lastChatModelId}&chatId=${lastChatId}`,
        activeLink: ['/chat']
      },

      {
        label: '客服资料库',
        icon: 'model',
        link: `/model?modelId=${lastModelId}`,
        activeLink: ['/model']
      },
      {
        label: '翻译',
        icon: 'translate',
        link: `/translation`,
        activeLink: ['/translation']
      },
      {
        label: '总结',
        icon: 'summary',
        link: `/summary`,
        activeLink: ['/summary']
      },
      {
        label: '退换货',
        icon: 'judge',
        link: `/judge`,
        activeLink: ['/judge']
      },
      {
        label: '关键词',
        icon: 'keyword',
        link: `/keyword`,
        activeLink: ['/keyword']
      },
      {
        label: '解析需求和目的(中文)',
        icon: 'need',
        link: `/parse-semantics-cmn`,
        activeLink: ['/parse-semantics-cmn']
      },
      {
        label: '解析需求和目的(英文)',
        icon: 'need',
        link: `/parse-semantics-eng`,
        activeLink: ['/parse-semantics-eng']
      },
      {
        label: '解析是否手机故障',
        icon: 'malfunction',
        link: `/malfunction`,
        activeLink: ['/malfunction']
      }
      // {
      //   label: '共享',
      //   icon: 'shareMarket',
      //   link: '/model/share',
      //   activeLink: ['/model/share']
      // },
      // {
      //   label: '邀请',
      //   icon: 'promotion',
      //   link: '/promotion',
      //   activeLink: ['/promotion']
      // },
      // {
      //   label: '开发',
      //   icon: 'develop',
      //   link: '/openapi',
      //   activeLink: ['/openapi']
      // },
      // {
      //   label: '账号',
      //   icon: 'user',
      //   link: '/number',
      //   activeLink: ['/number']
      // }
    ],
    [lastChatId, lastChatModelId, lastModelId]
  );

  return (
    <Flex
      flexDirection={'column'}
      alignItems={'center'}
      pt={6}
      backgroundColor={'#465069'}
      h={'100%'}
      w={'100%'}
      boxShadow={'4px 0px 4px 0px rgba(43, 45, 55, 0.01)'}
      userSelect={'none'}
    >
      {/* logo */}
      <Box
        mb={5}
        border={'1px solid #fff'}
        borderRadius={'36px'}
        overflow={'hidden'}
        cursor={'pointer'}
        // onClick={() => router.push('/number')}
      >
        <Image src={'/icon/logo.png'} objectFit={'contain'} w={'36px'} h={'36px'} alt="" />
      </Box>
      {/* 导航列表 */}
      <Box flex={1}>
        {navbarList.map((item) => (
          <Tooltip
            label={item.label}
            key={item.label}
            placement={'right'}
            openDelay={100}
            gutter={-10}
          >
            <Flex
              mb={3}
              flexDirection={'column'}
              alignItems={'center'}
              justifyContent={'center'}
              onClick={() => {
                console.log(item.link === router.asPath, item.link);

                if (item.link === router.asPath) return;
                router.push(item.link);
              }}
              cursor={'pointer'}
              w={'60px'}
              h={'45px'}
              _hover={{
                color: '#ffffff'
              }}
              {...(item.activeLink.includes(router.pathname)
                ? {
                    color: '#ffffff ',
                    backgroundImage: 'linear-gradient(270deg,#4e83fd,#3370ff)'
                  }
                : {
                    color: '#9096a5',
                    backgroundColor: 'transparent'
                  })}
            >
              <MyIcon name={item.icon as any} width={'22px'} height={'22px'} />
            </Flex>
          </Tooltip>
        ))}
      </Box>
    </Flex>
  );
};

export default Navbar;
