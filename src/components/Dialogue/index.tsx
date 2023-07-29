import React, {
  useCallback,
  useState,
  useRef,
  useMemo,
  useEffect,
  MouseEvent,
  ComponentType
} from 'react';
import { useRouter } from 'next/router';
import { HistoryItemType, ChatType } from '@/types/chatOne';

import type { ChatSiteItemType, ExportChatType } from '@/types/chat';
import {
  Textarea,
  Box,
  Flex,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Image,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  Card,
  Tooltip,
  useOutsideClick,
  useTheme,
  HStack
} from '@chakra-ui/react';
import { useToast } from '@/hooks/useToast';
import { useScreen } from '@/hooks/useScreen';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useCopyData, voiceBroadcast } from '@/utils/tools';
import { streamFetch } from '@/api/fetch';
import MyIcon from '@/components/Icon';
import { throttle } from 'lodash';
import { Types } from 'mongoose';
import Markdown from '@/components/Markdown';
import { LOGO_ICON } from '@/constants/chat';
import { useChatStore } from '@/store/chatOne';
import { useLoading } from '@/hooks/useLoading';

import { useUserStore } from '@/store/user';
import Loading from '@/components/Loading';
import { useTranslationSummaryConfig } from './config';
const PhoneSliderBar = dynamic(() => import('./components/PhoneSliderBar'), {
  loading: () => <Loading fixed={false} />,
  ssr: false
});

const Empty = dynamic(() => import('./components/Empty'), {
  loading: () => <Loading fixed={false} />,
  ssr: false
});

import styles from './index.module.scss';

const textareaMinH = '22px';
// ComponentType<{ changeLanguage: (val: string) => Promise<void> }>
const Dialogue = ({
  type,
  isPcDevice,
  RadioCard
}: {
  type: string;
  isPcDevice: boolean;
  RadioCard?: any;
}) => {
  const { getTranslationSummaryList, judgmentLanguageFun } = useTranslationSummaryConfig();
  const hasVoiceApi = !!window.speechSynthesis;
  const router = useRouter();
  const theme = useTheme();
  const ChatBox = useRef<HTMLDivElement>(null);
  const TextareaDom = useRef<HTMLTextAreaElement>(null);
  const ContextMenuRef = useRef(null);
  const PhoneContextShow = useRef(false);

  // 中断请求
  const controller = useRef(new AbortController());
  const isLeavePage = useRef(false);

  const [inputVal, setInputVal] = useState(''); // user input prompt
  const [showSystemPrompt, setShowSystemPrompt] = useState('');
  const [messageContextMenuData, setMessageContextMenuData] = useState<{
    // message messageContextMenuData
    left: number;
    top: number;
    message: ChatSiteItemType;
  }>();
  // 翻译的参数，要保存
  const [languag, setLanguag] = useState('');
  const [foldSliderBar, setFoldSlideBar] = useState(false);

  const {
    // lastChatModelId,
    // setLastChatModelId,
    // lastChatId,
    // setLastChatId,
    loadHistory,
    chatData,
    setChatData,
    forbidLoadChatData,
    setForbidLoadChatData
  } = useChatStore();
  // console.log(chatData, 'chatData');

  const isChatting = useMemo(
    () => chatData.history[chatData.history.length - 1]?.status === 'loading',
    [chatData.history]
  );

  const { toast } = useToast();
  const { copyData } = useCopyData();
  const { isPc } = useScreen({ defaultIsPc: isPcDevice });
  const { Loading, setIsLoading } = useLoading();
  const { userInfo } = useUserStore();
  const { isOpen: isOpenSlider, onClose: onCloseSlider, onOpen: onOpenSlider } = useDisclosure();

  // close contextMenu
  useOutsideClick({
    ref: ContextMenuRef,
    handler: () => {
      // 移动端长按后会将其设置为true，松手时候也会触发一次，松手的时候需要忽略一次。
      if (PhoneContextShow.current) {
        PhoneContextShow.current = false;
      } else {
        messageContextMenuData &&
          setTimeout(() => {
            setMessageContextMenuData(undefined);
            window.getSelection?.()?.empty?.();
            window.getSelection?.()?.removeAllRanges?.();
            document?.getSelection()?.empty();
          });
      }
    }
  });

  // 滚动到底部
  const scrollToBottom = useCallback((behavior: 'smooth' | 'auto' = 'smooth') => {
    if (!ChatBox.current) return;
    ChatBox.current.scrollTo({
      top: ChatBox.current.scrollHeight,
      behavior
    });
  }, []);

  // 聊天信息生成中……获取当前滚动条位置，判断是否需要滚动到底部
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const generatingMessage = useCallback(
    throttle(() => {
      if (!ChatBox.current) return;
      const isBottom =
        ChatBox.current.scrollTop + ChatBox.current.clientHeight + 150 >=
        ChatBox.current.scrollHeight;

      isBottom && scrollToBottom('auto');
    }, 100),
    []
  );

  // 重置输入内容
  const resetInputVal = useCallback((val: string) => {
    setInputVal(val);
    setTimeout(() => {
      /* 回到最小高度 */
      if (TextareaDom.current) {
        TextareaDom.current.style.height =
          val === '' ? textareaMinH : `${TextareaDom.current.scrollHeight}px`;
      }
    }, 100);
  }, []);

  // gpt 对话
  const gptChatPrompt = useCallback(
    async (prompts: ChatSiteItemType[]) => {
      // create abort obj
      const abortSignal = new AbortController();
      controller.current = abortSignal;
      isLeavePage.current = false;
      console.log(languag, 'languag');
      const message = localStorage.getItem('lationSummaryMessage');
      const remark = localStorage.getItem('remark');
      const derivedLanguage = judgmentLanguageFun(prompts[0].value);
      let prompt;
      // if (type === 'summary') {
      //   prompt = {
      //     obj: prompts[0].obj,
      //     // value: `请用${derivedLanguage}简短的总结提炼以下这段话：` + prompts[0].value + '.'
      //     // value: `请用${derivedLanguage}简短的总结提炼以下这段话，重点提炼意图和关联与手机相关的专业术语：` + prompts[0].value + '.'
      //     // value: `请用${derivedLanguage}简短的总结提炼以下有关于手机的句子，如果句子过短，则原文输出即可，请使用${derivedLanguage}并多使用手机术语回答（无需输出解释性文字，重点提炼意图，例如手机发热就是电池有问题）：` + prompts[0].value + '.'
      //     // value: `请用${derivedLanguage}简短的总结提炼以下这段话，（注意：仅保留这段话中和手机商品相关的内容/强调这段话实际意图）：` + prompts[0].value + '.'
      //     value: `请用${derivedLanguage}简短的识别以下这段话手机哪个部件有问题：` + prompts[0].value + '.'
      //   };
      // }
      if (type === 'parse-requirements-and-objectives') {
        prompt = {
          obj: prompts[0].obj,
          // 原来
          // value: message + prompts[0].value + '\n' + '你应该像下面的格式回复我:客户需求: 客户希望得到一台更换手机' + '\n' + '手机问题:手机进水后无法开机。'

          // 还可以（目前最好）
          // value: message + `Refurbished IPhone XR (red) was just told by Amazon to contact you for a replacement on an item l receivedrecently. The item in question was dropped in a shallow puddle & immediatelygrabbed within under 1min. However after following all measures I know of it simplwill not come on.l shut it off, dried it, placed it in a sealed bag of rice for 2 days. I'mstumped due to knowing it should have been fine.` + '.' + remark + '你的第二段信息是:'  + prompts[0].value

          // value: `现在你是一名人工客服，你为一家主营手机业务的亚马逊线上商店服务，我从现在开始会给你发信息，你要告诉我这段信息客户的实际需求，实际目的是什么，并告诉我它的手机有什么问题，请将这些用最简短的语言总结出来，你的第一段信息是: 现在你是一名人工客服，你为一家主营手机业务的亚马逊线上商店服务，我从现在开始会给你发信息，你要告诉我这段信息客户的实际需求，请将他需求用最简短的语言总结出来，总结内容不需要包括手机型号，具体日期等，并且以最简洁的方式回复我，并且按照客户需求+手机问题的模版回复我，如下是我给你的示范:
          // 问：Refurbished IPhone XR (red) was just told by Amazon to contact you for a replacement on an item l receivedrecently. The item in question was dropped in a shallow puddle & immediatelygrabbed within under 1min. However after following all measures I know of it simplwill not come on.l shut it off, dried it, placed it in a sealed bag of rice for 2 days. I'mstumped due to knowing it should have been fine.
          // 答：客户需求: 客户希望得到一台更换手机。手机问题:手机进水后无法开机。

          // 现在请解析并按照上面格式回复我：${prompts[0].value}

          // value: `现在你是一名人工客服，你为一家主营手机业务的亚马逊线上商店服务，我从现在开始会给你发信息，你要告诉我这段信息客户的实际需求，实际目的是什么，并告诉我它的手机有什么问题，请将这些用最简短的语言总结出来，你的第一段信息是: 现在你是一名人工客服，你为一家主营手机业务的亚马逊线上商店服务，我从现在开始会给你发信息，你要告诉我这段信息客户的实际需求，请将他需求用最简短的语言总结出来，总结内容不需要包括手机型号，具体日期等，并且以最简洁的方式回复我，并且按照客户需求+手机问题的模版回复我，如下是我给你的示范:
          // 问：Refurbished IPhone XR (red) was just told by Amazon to contact you for a replacement on an item l receivedrecently. The item in question was dropped in a shallow puddle & immediatelygrabbed within under 1min. However after following all measures I know of it simplwill not come on.l shut it off, dried it, placed it in a sealed bag of rice for 2 days. I'mstumped due to knowing it should have been fine.

          // 现在请解析以下内容并以客户需求和手机问题答复：${prompts[0].value}

          // `
          value: `现在你是一名人工客服，你为一家主营手机业务的亚马逊线上商店服务，我从现在开始会给你发信息，你要告诉我这段信息客户的实际需求，实际目的是什么，并告诉我它的手机有什么问题，请将这些用最简短的语言总结出来，你的第一段信息是: 现在你是一名人工客服，你为一家主营手机业务的亚马逊线上商店服务，我从现在开始会给你发信息，你要告诉我这段信息客户的实际需求，请将他需求用最简短的语言总结出来，总结内容不需要包括手机型号，具体日期、情感等，并且以最简洁的方式回复我，并且按照客户需求+手机问题的模版回复我，
       
      
          现在请解析以下内容并以客户需求和手机问题两个方面进行输出（无需多余内容）：${prompts[0].value} `
        };
      } else {
        prompt = {
          obj: prompts[0].obj,
          value: `${message}${languag}` + prompts[0].value + '.'
        };
      }
      console.log(prompt, 'prompt');
      // 流请求，获取数据
      let { systemPrompt } = await streamFetch({
        url: '/api/chat/chatOne',
        data: {
          prompt
        },
        onMessage: (text: string) => {
          // console.log(text, 'taxt');

          setChatData((state: any) => ({
            ...state,
            history: state.history.map((item: Record<string, any>, index: number) => {
              if (index !== state.history.length - 1) return item;
              return {
                ...item,
                value: item.value + text
              };
            })
          }));
          generatingMessage();
        },
        abortSignal
      });

      // 重置了页面，说明退出了当前聊天, 不缓存任何内容
      if (isLeavePage.current) {
        return;
      }

      // 设置聊天内容为完成状态
      setChatData(
        (state: ChatType) => ({
          ...state,
          history: state.history.map((item: any, index: number) => {
            if (index !== state.history.length - 1) return item;
            return {
              ...item,
              status: 'finish',
              systemPrompt
            };
          })
        }),
        type
      );

      // console.log(chatData, 'chatData');

      // refresh history
      // loadHistory({ pageNum: 1, init: true });
      setTimeout(() => {
        generatingMessage();
      }, 100);
    },
    [generatingMessage, languag, setChatData, type]
  );

  /**
   * 发送一个内容
   */
  const sendPrompt = useCallback(async () => {
    if (!languag && type === 'translate') {
      toast({
        title: '请选择想要翻译的语种',
        status: 'warning'
      });
      return;
    }
    if (inputVal.length < 10 && type === 'summary') {
      toast({
        title: '请输入一个完整的句子',
        status: 'warning'
      });
      return;
    }
    if (isChatting) {
      toast({
        title: '正在聊天中...请等待结束',
        status: 'warning'
      });
      return;
    }
    const storeInput = inputVal;
    // 去除空行
    const val = inputVal.trim().replace(/\n\s*/g, '\n');

    if (!val) {
      toast({
        title: '内容为空',
        status: 'warning'
      });
      return;
    }

    const newChatList: ChatSiteItemType[] = [
      ...chatData.history,
      {
        _id: String(new Types.ObjectId()),
        obj: 'Human',
        value: val,
        status: 'finish'
      },
      {
        _id: String(new Types.ObjectId()),
        obj: 'AI',
        value: '',
        status: 'loading'
      }
    ];

    // 插入内容
    setChatData((state: ChatType) => ({
      ...state,
      history: newChatList
    }));

    // 清空输入内容
    resetInputVal('');
    setTimeout(() => {
      scrollToBottom();
    }, 100);

    try {
      await gptChatPrompt(newChatList.slice(-2));
    } catch (err: any) {
      toast({
        title: typeof err === 'string' ? err : err?.message || '聊天出错了~',
        status: 'warning',
        duration: 5000,
        isClosable: true
      });

      resetInputVal(storeInput);

      setChatData((state: ChatType) => ({
        ...state,
        history: newChatList.slice(0, newChatList.length - 2)
      }));
    }
  }, [
    languag,
    type,
    isChatting,
    inputVal,
    chatData.history,
    setChatData,
    resetInputVal,
    toast,
    scrollToBottom,
    gptChatPrompt
  ]);

  // 删除一句话
  const delChatRecord = useCallback(
    async (index: number, historyId: string) => {
      if (!messageContextMenuData) return;
      setIsLoading(true);
      console.log(index, historyId, 'historyId');

      try {
        // 删除数据库最后一句( 后期有数据库的话 )
        // await delChatRecordByIndex(chatId, historyId);

        setChatData((state: ChatType) => ({
          ...state,
          history: state.history.filter((_: any, i: number) => i !== index)
        }));
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    },
    [messageContextMenuData, setChatData, setIsLoading]
  );

  // 复制内容
  const onclickCopy = useCallback(
    (value: string) => {
      const val = value.replace(/\n+/g, '\n');
      copyData(val);
    },
    [copyData]
  );

  // onclick chat message context
  const onclickContextMenu = useCallback(
    (e: MouseEvent<HTMLDivElement>, message: ChatSiteItemType) => {
      e.preventDefault(); // 阻止默认右键菜单

      // select all text
      const range = document.createRange();
      range.selectNodeContents(e.currentTarget as HTMLDivElement);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);

      navigator.vibrate?.(50); // 震动 50 毫秒

      if (!isPcDevice) {
        PhoneContextShow.current = true;
      }

      setMessageContextMenuData({
        left: e.clientX - 20,
        top: e.clientY,
        message
      });

      return false;
    },
    [isPcDevice]
  );

  // 获取对话信息(init) 从缓存或者store拿
  const loadChatInfo = useCallback(
    async ({ isLoading = false }: { isLoading?: boolean }) => {
      isLoading && setIsLoading(true);
      try {
        const res: any = await getTranslationSummaryList(type);
        // console.log(res, 'asdasdas');

        setChatData({
          ...res,
          history: res.history.map((item: Record<string, any>) => ({
            ...item,
            status: 'finish'
          }))
        });
        if (res.history.length > 0) {
          setTimeout(() => {
            scrollToBottom('auto');
          }, 300);
        }
      } catch (e: any) {
        setChatData();
        loadHistory({ pageNum: 1, init: true });
      }
      setIsLoading(false);
      return null;
    },
    [setIsLoading, getTranslationSummaryList, type, setChatData, scrollToBottom, loadHistory]
  );
  const changeLanguage = useCallback(
    async (val: string) => {
      console.log(val, 'any');

      await setLanguag(val);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [languag]
  );
  // 初始化聊天框
  const { isLoading } = useQuery(['init'], () => {
    if (forbidLoadChatData) {
      setForbidLoadChatData(false);
      return null;
    }

    return loadChatInfo({});
  });

  // context menu component
  const RenderContextMenu = useCallback(
    ({
      history,
      index,
      AiDetail = false
    }: {
      history: ChatSiteItemType;
      index: number;
      AiDetail?: boolean;
    }) => (
      <MenuList fontSize={'sm'} minW={'100px !important'}>
        {AiDetail && chatData.model.canUse && history.obj === 'AI' && (
          <MenuItem
            borderBottom={theme.borders.base}
            onClick={() => {
              console.log('asdasdsa');

              // router.push(`/model?modelId=${chatData.modelId}`);
            }}
          >
            AI助手详情
          </MenuItem>
        )}
        <MenuItem onClick={() => onclickCopy(history.value)}>复制</MenuItem>
        {hasVoiceApi && (
          <MenuItem
            borderBottom={theme.borders.base}
            onClick={() => voiceBroadcast({ text: history.value })}
          >
            语音播报
          </MenuItem>
        )}

        <MenuItem onClick={() => delChatRecord(index, history._id)}>删除</MenuItem>
      </MenuList>
    ),
    [chatData.model.canUse, delChatRecord, hasVoiceApi, onclickCopy, theme.borders.base]
  );
  return (
    <Flex
      h={'100%'}
      flexDirection={['column', 'row']}
      backgroundColor={useColorModeValue('#fdfdfd', '')}
    >
      {/* 聊天内容 */}

      <Flex
        position={'relative'}
        h={[0, '100%']}
        w={['100%', 0]}
        flex={'1 0 0'}
        flexDirection={'column'}
      >
        {/* chat header */}
        <Flex
          alignItems={'center'}
          justifyContent={'space-between'}
          py={[3, 5]}
          px={5}
          borderBottom={'1px solid '}
          borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
          color={useColorModeValue('myGray.900', 'white')}
        ></Flex>
        {/* chat content box */}
        <Box ref={ChatBox} pb={[4, 0]} flex={'1 0 0'} h={0} w={'100%'} overflow={'overlay'}>
          <Box id={'history'}>
            {chatData.history.map((item, index) => (
              <Flex key={item._id} alignItems={'flex-start'} py={2} px={[2, 6, 8]}>
                {item.obj === 'Human' && <Box flex={1} />}
                {/* avatar */}
                <Menu autoSelect={false} isLazy>
                  <MenuButton
                    as={Box}
                    {...(item.obj === 'AI'
                      ? {
                          order: 1,
                          mr: ['6px', 2],
                          cursor: 'pointer',
                          onClick: () => {
                            console.log('什么防御');

                            // isPc && router.push(`/model?modelId=${chatData.modelId}`);
                          }
                        }
                      : {
                          order: 3,
                          ml: ['6px', 2]
                        })}
                  >
                    <Tooltip label={item.obj === 'AI' ? 'AI助手详情' : ''}>
                      <Image
                        className="avatar"
                        src={
                          item.obj === 'Human'
                            ? userInfo?.avatar
                            : chatData.model.avatar || LOGO_ICON
                        }
                        alt="avatar"
                        w={['20px', '34px']}
                        h={['20px', '34px']}
                        borderRadius={'50%'}
                        objectFit={'contain'}
                      />
                    </Tooltip>
                  </MenuButton>
                  {!isPc && <RenderContextMenu history={item} index={index} AiDetail />}
                </Menu>
                {/* message */}
                <Flex order={2} pt={2} maxW={['calc(100% - 50px)', '80%']}>
                  {item.obj === 'AI' ? (
                    <Box w={'100%'}>
                      <Card
                        bg={'white'}
                        px={4}
                        py={3}
                        borderRadius={'0 8px 8px 8px'}
                        onContextMenu={(e) => onclickContextMenu(e, item)}
                      >
                        <Markdown
                          source={item.value}
                          isChatting={isChatting && index === chatData.history.length - 1}
                        />
                        {item.systemPrompt && (
                          <Button
                            display={'none'}
                            size={'xs'}
                            mt={2}
                            fontWeight={'normal'}
                            colorScheme={'gray'}
                            variant={'outline'}
                            w={'90px'}
                            onClick={() => setShowSystemPrompt(item.systemPrompt || '')}
                          >
                            查看提示词
                          </Button>
                        )}
                      </Card>
                    </Box>
                  ) : (
                    <Box>
                      <Card
                        className="markdown"
                        whiteSpace={'pre-wrap'}
                        px={4}
                        py={3}
                        borderRadius={'8px 0 8px 8px'}
                        bg={'myBlue.300'}
                        onContextMenu={(e) => onclickContextMenu(e, item)}
                      >
                        <Box as={'p'}>{item.value}</Box>
                      </Card>
                    </Box>
                  )}
                </Flex>
              </Flex>
            ))}
            {chatData.history.length === 0 && <Empty model={chatData.model} />}
          </Box>
        </Box>
        {/* 发送区 */}

        <Box m={['0 auto', '20px auto']} w={'100%'} maxW={['auto', 'min(750px, 100%)']}>
          <Box
            py={'18px'}
            position={'relative'}
            boxShadow={`0 0 10px rgba(0,0,0,0.1)`}
            borderTop={['1px solid', 0]}
            borderTopColor={useColorModeValue('gray.200', 'gray.700')}
            borderRadius={['none', 'md']}
            backgroundColor={useColorModeValue('white', 'gray.700')}
          >
            {/*选择翻译为*/}

            {RadioCard ? (
              <HStack>
                <RadioCard changeLanguage={changeLanguage}></RadioCard>
              </HStack>
            ) : (
              ''
            )}

            {/* 输入框 */}
            <Textarea
              ref={TextareaDom}
              py={0}
              pr={['45px', '55px']}
              border={'none'}
              _focusVisible={{
                border: 'none'
              }}
              placeholder="请输入"
              resize={'none'}
              value={inputVal}
              rows={1}
              height={'22px'}
              lineHeight={'22px'}
              maxHeight={'150px'}
              maxLength={-1}
              overflowY={'auto'}
              whiteSpace={'pre-wrap'}
              wordBreak={'break-all'}
              boxShadow={'none !important'}
              color={useColorModeValue('blackAlpha.700', 'white')}
              onChange={(e) => {
                const textarea = e.target;
                setInputVal(textarea.value);
                textarea.style.height = textareaMinH;
                textarea.style.height = `${textarea.scrollHeight}px`;
              }}
              onKeyDown={(e) => {
                // 触发快捷发送
                if (isPcDevice && e.keyCode === 13 && !e.shiftKey) {
                  sendPrompt();
                  e.preventDefault();
                }
                // 全选内容
                // @ts-ignore
                e.key === 'a' && e.ctrlKey && e.target?.select();
              }}
            />
            {/* 发送和等待按键 */}
            <Flex
              alignItems={'center'}
              justifyContent={'center'}
              h={'25px'}
              w={'25px'}
              position={'absolute'}
              right={['12px', '20px']}
              bottom={'15px'}
            >
              {isChatting ? (
                <MyIcon
                  className={styles.stopIcon}
                  width={['22px', '25px']}
                  height={['22px', '25px']}
                  cursor={'pointer'}
                  name={'stop'}
                  color={useColorModeValue('gray.500', 'white')}
                  onClick={() => {
                    controller.current?.abort();
                  }}
                />
              ) : (
                <MyIcon
                  name={'chatSend'}
                  width={['18px', '20px']}
                  height={['18px', '20px']}
                  cursor={'pointer'}
                  color={useColorModeValue('gray.500', 'white')}
                  onClick={sendPrompt}
                />
              )}
            </Flex>
          </Box>
        </Box>
        {/* ) : (
          <Box m={['0 auto', '20px auto']} w={'100%'} textAlign={'center'} color={'myGray.500'}>
            作者已关闭分享
          </Box>
        )} */}

        <Loading loading={isLoading} fixed={false} />
      </Flex>

      {/* phone slider */}
      {!isPc && (
        <Drawer isOpen={isOpenSlider} placement="left" size={'xs'} onClose={onCloseSlider}>
          <DrawerOverlay backgroundColor={'rgba(255,255,255,0.5)'} />
          <DrawerContent maxWidth={'250px'}>
            <PhoneSliderBar
              chatId={'6476f3a96562c5fa0cba90dc'}
              modelId={'648c5e8ed95c58ddd045ad7e'}
              onClose={onCloseSlider}
            />
          </DrawerContent>
        </Drawer>
      )}
      {/* system prompt show modal */}
      {
        <Modal isOpen={!!showSystemPrompt} onClose={() => setShowSystemPrompt('')}>
          <ModalOverlay />
          <ModalContent maxW={'min(90vw, 600px)'} pr={2} maxH={'80vh'} overflowY={'auto'}>
            <ModalCloseButton />
            <ModalBody pt={5} whiteSpace={'pre-wrap'} textAlign={'justify'}>
              {showSystemPrompt}
            </ModalBody>
          </ModalContent>
        </Modal>
      }
      {/* context menu */}

      {messageContextMenuData && (
        <Box
          zIndex={10}
          position={'fixed'}
          top={messageContextMenuData.top}
          left={messageContextMenuData.left}
        >
          <Box ref={ContextMenuRef}></Box>
          <Menu isOpen>
            <RenderContextMenu
              history={messageContextMenuData.message}
              index={chatData.history.findIndex(
                (item) => item._id === messageContextMenuData.message._id
              )}
              AiDetail={!isPc}
            />
          </Menu>
        </Box>
      )}
    </Flex>
  );
};

export default Dialogue;
