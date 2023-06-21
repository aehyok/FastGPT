import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/useToast';
export function useTranslationSummaryConfig() {
  const COLUMNS = ['name', 'shortName', 'logo', 'intro', 'address', 'email', 'phone'];
  const [tableData, setTableData] = useState([]);
  const { toast } = useToast();
  const getTranslationSummaryList = (type: string) => {
    // console.log(localStorage.getItem("translate"), "aaa");
    const chatData = localStorage.getItem('translate') || ('' as string);

    if (type === 'translate') {
      const translateList = chatData ? JSON.parse(chatData).translateList : [];
      localStorage.setItem('lationSummaryMessage', '请将下面内容翻译为');
      return {
        // chatId: "",
        // modelId: "",
        model: {
          name: '翻译AI'
        },
        history: translateList
      };
    } else {
      const translateList = chatData ? JSON.parse(chatData).translateList : [];
      localStorage.setItem('lationSummaryMessage', '请将下面内容翻译为');
      return {
        model: {
          name: '总结提炼客服问题'
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
