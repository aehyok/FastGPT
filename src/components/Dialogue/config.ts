import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { getQaconfig } from '@/api/translation';
// const LanguageDetect = require('languagedetect');
// const lngDetector = new LanguageDetect();
// const franc = require('franc');
// import { franc } from 'franc';
import { franc } from 'franc-min';
type moduleNameObjType = {
  summary: string;
  translate: string;
  judge: string;
  keyword: string;
  parseSemantics: string;
  malfunction: string;
};

const languageList = new Map([
  ['/^[\u4e00-\u9fa5]+$/', '中文'],
  ['/^[a-zA-Z]+$/', '英文'],
  ["/^[a-zA-ZÀ-ÿs']+$/", '法文'],
  ["/^[a-zA-ZÀ-ÿs']+$/", '意大利文'],
  ["/^[a-zA-ZÁÉÍÓÚÑÜáéíóúñüs']+$/", '西班牙文']
]);

export function useTranslationSummaryConfig() {
  const recognitionLanguage = {
    cmn: '中文',
    eng: '英文',
    spa: '西班牙语',
    fra: '法语',
    ita: '意大利语'
  };
  const getTranslationSummaryList = async (type: string) => {
    const moduleNameObj: moduleNameObjType = {
      summary: '总结提炼客服问题',
      translate: '翻译AI',
      judge: '识别是否退换货',
      keyword: '关键词提取',
      parseSemantics: '解析需求和目的',
      malfunction: '解析是否手机故障'
    };
    const { code, prompt, remark } = (await getQaconfig(type)) as {
      code: number;
      prompt: string;
      remark: string;
    };
    if (code && prompt) localStorage.setItem('lationSummaryMessage', prompt);
    if (code && remark) localStorage.setItem('remark', remark);

    if (type) {
      const chatData = localStorage.getItem(type) || ('' as string);
      const translateList = chatData ? JSON.parse(chatData).translateList : [];
      return {
        // chatId: "",
        // modelId: "",
        model: {
          // @ts-ignore
          name: moduleNameObj[type],
          avatar: '/icon/logo.png'
        },
        history: translateList
      };
    }
  };

  const judgmentLanguageFun = (value: string) => {
    // console.log(lngDetector.getLanguages(value, 2), "aaa",value);
    // console.log(franc, 'adasdas');
    /**
     *
     *  cmn: 中文
     *  eng: 英文
     *  spa: 西班牙语
     *  fra: 法语
     *  ita: 意大利语
     *
     */

    console.log(
      // @ts-ignore
      recognitionLanguage[
        franc(value, { minLength: 10, only: ['cmn', 'eng', 'spa', 'fra', 'ita'] })
      ],
      'aaaa'
    );

    // var chineseRegex = /^[\u4e00-\u9fa5]+$/;
    // var chineseRegex1 = /^[a-zA-Z]+$/;
    // var chineseRegex2 = /^[a-zA-ZÀ-ÿ\s']+$/;
    // var chineseRegex3 = /^[a-zA-ZÀ-ÿ\s']+$/;
    // var chineseRegex4 = /^[a-zA-ZÁÉÍÓÚÑÜáéíóúñü\s']+$/;
    // console.log('adasd', value, chineseRegex.test(value));

    // if (chineseRegex.test(value)) console.log('中文');
    // else if (chineseRegex1.test(value)) console.log('英文');
    // else if (chineseRegex2.test(value)) console.log('法文');
    // else if (chineseRegex3.test(value)) console.log('意大利文');
    // else if (chineseRegex4.test(value)) console.log('西班牙文');

    return (
      // @ts-ignore
      recognitionLanguage[
        franc(value, { minLength: 10, only: ['cmn', 'eng', 'spa', 'fra', 'ita'] })
      ] || '英语'
    );
  };
  judgmentLanguageFun('language art is good');
  return {
    getTranslationSummaryList,
    judgmentLanguageFun
  };
}

export default function Config() {
  return '';
}
