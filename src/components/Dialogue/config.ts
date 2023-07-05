import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { getQaconfig } from '@/api/translation';
// const LanguageDetect = require('languagedetect');
// const lngDetector = new LanguageDetect();
// const franc = require('franc');
// import { franc } from 'franc';
type getQaconfigDataType = {
  prompt: string;
  code: string;
  name: string;
  _id: string;
};

const languageList = new Map([
  ['/^[\u4e00-\u9fa5]+$/', '中文'],
  ['/^[a-zA-Z]+$/', '英文'],
  ["/^[a-zA-ZÀ-ÿs']+$/", '法文'],
  ["/^[a-zA-ZÀ-ÿs']+$/", '意大利文'],
  ["/^[a-zA-ZÁÉÍÓÚÑÜáéíóúñüs']+$/", '西班牙文']
]);

export function useTranslationSummaryConfig() {
  const COLUMNS = ['name', 'shortName', 'logo', 'intro', 'address', 'email', 'phone'];
  const [tableData, setTableData] = useState([]);
  const { toast } = useToast();
  const getTranslationSummaryList = async (type: string) => {
    // console.log(localStorage.getItem("translate"), "aaa");

    const { code, prompt } = (await getQaconfig(type)) as { code: number; prompt: string };
    console.log(code, 'code', '什么玩意', prompt);
    if (code && prompt) {
      localStorage.setItem('lationSummaryMessage', prompt);
    }

    if (type === 'translate') {
      const chatData = localStorage.getItem('translate') || ('' as string);
      const translateList = chatData ? JSON.parse(chatData).translateList : [];
      return {
        // chatId: "",
        // modelId: "",
        model: {
          name: '翻译AI',
          avatar: '/icon/logo.png'
        },
        history: translateList
      };
    } else {
      const chatData = localStorage.getItem('summary') || ('' as string);

      const translateList = chatData ? JSON.parse(chatData).translateList : [];
      // localStorage.setItem('lationSummaryMessage', '请将下面内容翻译为');
      return {
        model: {
          name: '总结提炼客服问题',
          avatar: '/icon/logo.png'
        },
        history: translateList
      };
    }
  };

  const judgmentLanguageFun = (value: string) => {
    // console.log(lngDetector.getLanguages(value, 2), "aaa",value);
    // console.log(franc, 'adasdas');

    // console.log(franc(value, { minLength: 1, only: ['cmn', 'eng', 'spa', 'fra', 'ita'] }), 'aaaa');

    var chineseRegex = /^[\u4e00-\u9fa5]+$/;
    var chineseRegex1 = /^[a-zA-Z]+$/;
    var chineseRegex2 = /^[a-zA-ZÀ-ÿ\s']+$/;
    var chineseRegex3 = /^[a-zA-ZÀ-ÿ\s']+$/;
    var chineseRegex4 = /^[a-zA-ZÁÉÍÓÚÑÜáéíóúñü\s']+$/;
    console.log('adasd', value, chineseRegex.test(value));

    if (chineseRegex.test(value)) console.log('中文');
    else if (chineseRegex1.test(value)) console.log('英文');
    else if (chineseRegex2.test(value)) console.log('法文');
    else if (chineseRegex3.test(value)) console.log('意大利文');
    else if (chineseRegex4.test(value)) console.log('西班牙文');
  };

  return {
    tableData,
    getTranslationSummaryList,
    judgmentLanguageFun
  };
}

export default function Config() {
  return '';
}
