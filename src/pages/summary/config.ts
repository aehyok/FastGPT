import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/useToast';
export function useTranslationSummaryConfig() {
  const COLUMNS = ['name', 'shortName', 'logo', 'intro', 'address', 'email', 'phone'];
  const [tableData, setTableData] = useState([]);
  const { toast } = useToast();
  const getTranslationSummaryList = (type: string) => {
    // console.log(localStorage.getItem("translate"), "aaa");
    const chatData = localStorage.getItem('summary') || ('' as string);

    if (type === 'summary') {
      const translateList = chatData ? JSON.parse(chatData).translateList : [];
      localStorage.setItem(
        'lationSummaryMessage',
        // '用简单的话语总结提炼这段话的问题，先判断有几个问题，再直接列出问题列表即可，无需回复问题：'
        '用最简短的话语总结提炼这段话：'
      );
      return {
        // chatId: "",
        // modelId: "",
        model: {
          name: '总结AI'
        },
        history: translateList
      };
    }
  };

  return {
    tableData,
    getTranslationSummaryList
  };
}

export default function Config() {
  return '';
}
