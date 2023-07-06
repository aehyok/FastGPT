import { useState, useCallback, useMemo, useEffect } from 'react';
import type { PagingData, NewPagingData } from '../types/index';
import { IconButton, Flex, Box, Input } from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { useMutation } from '@tanstack/react-query';
import { useToast } from './useToast';
import { useQuery } from '@tanstack/react-query';

export const usePagination = <T = any,>({
  api,
  limit = 10,
  params = {},
  defaultRequest = true
}: {
  api: (data: any) => any;
  limit?: number;
  params?: Record<string, any>;
  defaultRequest?: boolean;
}) => {
  const { toast } = useToast();
  const [page, setpage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<T[]>([]);
  const maxPage = useMemo(() => Math.ceil(total / limit) || 1, [limit, total]);
  console.log(maxPage, 'maxPage', total);

  const { mutate, isLoading } = useMutation({
    mutationFn: async (num: number = page, keyword: string = '') => {
      try {
        const res: NewPagingData<T> = await api({
          page: num,
          limit,
          ...params
        });
        setpage(num);
        console.log(res, 'res');

        setTotal(res.data.total);
        setData(res.data.docs);
      } catch (error: any) {
        toast({
          title: error?.message || '获取数据异常',
          status: 'error'
        });
        console.log(error);
      }
    }
  });

  const Pagination = useCallback(() => {
    return (
      <Flex alignItems={'center'} justifyContent={'end'}>
        <IconButton
          isDisabled={page === 1}
          icon={<ArrowBackIcon />}
          aria-label={'left'}
          size={'sm'}
          w={'28px'}
          h={'28px'}
          onClick={() => mutate(page - 1)}
        />
        <Flex mx={2} alignItems={'center'}>
          <Input
            defaultValue={page}
            w={'50px'}
            size={'xs'}
            type={'number'}
            min={1}
            max={maxPage}
            onBlur={(e) => {
              const val = +e.target.value;
              if (val === page) return;
              if (val >= maxPage) {
                mutate(maxPage);
              } else if (val < 1) {
                mutate(1);
              } else {
                mutate(+e.target.value);
              }
            }}
          />
          <Box mx={2}>/</Box>
          {maxPage}
        </Flex>
        <IconButton
          isDisabled={page === maxPage}
          icon={<ArrowForwardIcon />}
          aria-label={'left'}
          size={'sm'}
          w={'28px'}
          h={'28px'}
          onClick={() => mutate(page + 1)}
        />
      </Flex>
    );
  }, [maxPage, mutate, page]);

  useEffect(() => {
    defaultRequest && mutate(1);
  }, []);

  return {
    page,
    limit,
    total,
    data,
    isLoading,
    Pagination,
    getData: mutate
  };
};
