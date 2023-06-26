import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  Flex,
  FormControl,
  Input,
  Textarea,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Tooltip,
  Button,
  Select,
  Grid,
  Switch,
  Image
} from '@chakra-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import type { ModelSchema } from '@/types/mongoSchema';
import { UseFormReturn } from 'react-hook-form';
import { ChatModelMap, ModelVectorSearchModeMap, getChatModelList } from '@/constants/model';
import { formatPrice } from '@/utils/user';
import { useConfirm } from '@/hooks/useConfirm';
import { useSelectFile } from '@/hooks/useSelectFile';
import { useToast } from '@/hooks/useToast';
import { compressImg } from '@/utils/file';
import { useQuery } from '@tanstack/react-query';

const ModelEditForm = ({
  formHooks,
  isOwner,
  handleDelModel
}: {
  formHooks: UseFormReturn<ModelSchema>;
  isOwner: boolean;
  handleDelModel: () => void;
}) => {
  const { openConfirm, ConfirmChild } = useConfirm({
    content: '确认删除该AI助手?'
  });
  const { register, setValue, getValues } = formHooks;
  const [refresh, setRefresh] = useState(false);
  const { File, onOpen: onOpenSelectFile } = useSelectFile({
    fileType: '.jpg,.png',
    multiple: false
  });
  const { toast } = useToast();

  const onSelectFile = useCallback(
    async (e: File[]) => {
      const file = e[0];
      if (!file) return;
      try {
        const base64 = await compressImg({
          file,
          maxW: 100,
          maxH: 100
        });
        setValue('avatar', base64);
        setRefresh((state) => !state);
      } catch (err: any) {
        toast({
          title: typeof err === 'string' ? err : '头像选择异常',
          status: 'warning'
        });
      }
    },
    [setValue, toast]
  );

  const { data: chatModelList = [] } = useQuery(['init'], getChatModelList);

  return (
    <>
      <Card p={4}>
        <Box fontWeight={'bold'}>基本信息</Box>
        <Flex alignItems={'center'} mt={4}>
          <Box flex={'0 0 80px'} w={0}>
            modelId:
          </Box>
          <Box>{getValues('_id')}</Box>
        </Flex>
        <Flex mt={4} alignItems={'center'}>
          <Box flex={'0 0 80px'} w={0}>
            头像:
          </Box>
          <Image
            src={getValues('avatar') || '/icon/logo.png'}
            alt={'avatar'}
            w={['28px', '36px']}
            h={['28px', '36px']}
            objectFit={'cover'}
            cursor={isOwner ? 'pointer' : 'default'}
            title={'点击切换头像'}
            onClick={() => isOwner && onOpenSelectFile()}
          />
        </Flex>
        <FormControl mt={4}>
          <Flex alignItems={'center'}>
            <Box flex={'0 0 80px'} w={0}>
              名称:
            </Box>
            <Input
              isDisabled={!isOwner}
              {...register('name', {
                required: '展示名称不能为空'
              })}
            ></Input>
          </Flex>
        </FormControl>
        <FormControl mt={4}>
          <Flex alignItems={'center'}>
            <Box flex={'0 0 80px'} w={0}>
              分类:
            </Box>
            <Input isDisabled={!isOwner} {...register('remark')}></Input>
          </Flex>
        </FormControl>

        <Flex alignItems={'center'} mt={5}>
          <Box flex={'0 0 80px'} w={0}>
            对话模型:
          </Box>
          <Select
            isDisabled={!isOwner}
            {...register('chat.chatModel', {
              onChange() {
                setRefresh((state) => !state);
              }
            })}
          >
            {chatModelList.map((item) => (
              <option key={item.chatModel} value={item.chatModel}>
                {item.name}
              </option>
            ))}
          </Select>
        </Flex>
        <Flex alignItems={'center'} mt={5}>
          <Box flex={'0 0 80px'} w={0}>
            价格:
          </Box>
          <Box>
            {formatPrice(ChatModelMap[getValues('chat.chatModel')]?.price, 1000)}
            元/1K tokens(包括上下文和回答)
          </Box>
        </Flex>
        <Flex alignItems={'center'} mt={5} display={'none'}>
          <Box flex={'0 0 80px'} w={0}>
            收藏人数:
          </Box>
          <Box>{getValues('share.collection')}人</Box>
        </Flex>
        {isOwner && (
          <Flex mt={5} alignItems={'center'}>
            <Box flex={'0 0 120px'}>删除AI和资料库</Box>
            <Button
              colorScheme={'gray'}
              variant={'outline'}
              size={'sm'}
              onClick={openConfirm(handleDelModel)}
            >
              删除资料库
            </Button>
          </Flex>
        )}
      </Card>
      <Card p={4}>
        <Box fontWeight={'bold'}>模型效果</Box>
        <FormControl mt={4}>
          <Flex alignItems={'center'}>
            <Box flex={'0 0 80px'} w={0}>
              <Box as={'span'} mr={2}>
                温度
              </Box>
              <Tooltip label={'温度越高，模型的发散能力越强；温度越低，内容越严谨。'}>
                <QuestionOutlineIcon />
              </Tooltip>
            </Box>

            <Slider
              aria-label="slider-ex-1"
              min={0}
              max={10}
              step={1}
              value={getValues('chat.temperature')}
              isDisabled={!isOwner}
              onChange={(e) => {
                setValue('chat.temperature', e);
                setRefresh(!refresh);
              }}
            >
              <SliderMark
                value={getValues('chat.temperature')}
                textAlign="center"
                bg="myBlue.600"
                color="white"
                w={'18px'}
                h={'18px'}
                borderRadius={'100px'}
                fontSize={'xs'}
                transform={'translate(-50%, -200%)'}
              >
                {getValues('chat.temperature')}
              </SliderMark>
              <SliderTrack>
                <SliderFilledTrack bg={'myBlue.700'} />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Flex>
        </FormControl>
        <Flex mt={4} alignItems={'center'}>
          <Box mr={4}>资料库搜索</Box>
          <Switch
            isDisabled={!isOwner}
            isChecked={getValues('chat.useKb')}
            onChange={() => {
              setValue('chat.useKb', !getValues('chat.useKb'));
              setRefresh(!refresh);
            }}
          />
        </Flex>
        {getValues('chat.useKb') && (
          <Flex mt={4} alignItems={'center'}>
            <Box mr={4} whiteSpace={'nowrap'}>
              搜索模式&emsp;
            </Box>
            <Select
              isDisabled={!isOwner}
              {...register('chat.searchMode', { required: '搜索模式不能为空' })}
            >
              {Object.entries(ModelVectorSearchModeMap).map(([key, { text }]) => (
                <option key={key} value={key}>
                  {text}
                </option>
              ))}
            </Select>
          </Flex>
        )}

        <Box mt={4}>
          <Box mb={1}>系统提示词</Box>
          <Textarea
            rows={8}
            maxLength={-1}
            isDisabled={!isOwner}
            placeholder={'模型默认的 prompt 词，通过调整该内容，可以引导模型聊天方向。'}
            {...register('chat.systemPrompt')}
          />
        </Box>
      </Card>
      {isOwner && (
        <Card p={4} gridColumnStart={[1, 1]} gridColumnEnd={[2, 3]} display={'none'}>
          <Box fontWeight={'bold'}>分享设置</Box>

          <Grid gridTemplateColumns={['1fr', '1fr 410px']} gridGap={5}>
            <Box>
              <Flex mt={5} alignItems={'center'}>
                <Box mr={3}>模型分享:</Box>
                <Switch
                  isChecked={getValues('share.isShare')}
                  onChange={() => {
                    setValue('share.isShare', !getValues('share.isShare'));
                    setRefresh(!refresh);
                  }}
                />
                <Box ml={12} mr={3}>
                  分享模型细节:
                </Box>
                <Switch
                  isChecked={getValues('share.isShareDetail')}
                  onChange={() => {
                    setValue('share.isShareDetail', !getValues('share.isShareDetail'));
                    setRefresh(!refresh);
                  }}
                />
              </Flex>
              <Box mt={5}>
                <Box>模型介绍</Box>
                <Textarea
                  mt={1}
                  rows={6}
                  maxLength={150}
                  {...register('share.intro')}
                  placeholder={'介绍模型的功能、场景等，吸引更多人来使用！最多150字。'}
                />
              </Box>
            </Box>
            <Box
              textAlign={'justify'}
              fontSize={'sm'}
              border={'1px solid #f4f4f4'}
              borderRadius={'sm'}
              p={3}
            >
              <Box fontWeight={'bold'}>Tips</Box>
              <Box mt={1} as={'ul'} pl={4}>
                <li>
                  开启模型分享后，你的模型将会出现在共享市场，可供 FastGpt
                  所有用户使用。用户使用时不会消耗你的 tokens，而是消耗使用者的 tokens。
                </li>
                <li>开启分享详情后，其他用户可以查看该模型的特有数据：温度、提示词和数据集。</li>
              </Box>
            </Box>
          </Grid>
        </Card>
      )}
      <File onSelect={onSelectFile} />
      <ConfirmChild />
    </>
  );
};

export default ModelEditForm;
