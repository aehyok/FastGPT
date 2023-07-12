import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@/service/response';
import fs from 'fs';
import csv from 'csv-parser';
import * as csvWriter from 'csv-writer';
import { Configuration, OpenAIApi } from 'openai';
import { useTranslationSummaryConfig } from '@/components/Dialogue/config';

async function translate(
  prompt: string,
  type: 'translate' | 'summary' = 'translate',
  derivedLanguage: string
) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAIKEY,
    basePath: process.env.OPENAI_BASE_URL
  });
  const typePromptPrefixs = {
    translate: '请将下面的内容翻译为中文(只输出中文)：',
    summary: `请用${derivedLanguage}简短的总结提炼以下句子，如果句子过短，则原文输出即可，请使用${derivedLanguage}回答（无需输出解释性文字）：`
  };

  const chatApi = new OpenAIApi(configuration);

  const chatCompletion = await chatApi.createChatCompletion({
    model: 'gpt-3.5-turbo-16k',
    temperature: 0,
    frequency_penalty: 0.5, // 越大，重复内容越少
    presence_penalty: -0.5, // 越大，越容易出现新内容
    stop: ['.!?。'],
    messages: [{ role: 'user', content: `${typePromptPrefixs[type]}${prompt}` }]
  });
  return chatCompletion.data.choices[0].message?.content;
}
/* 获取单独设置的QaConfig 通过配置在数据库直接进行读取 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { judgmentLanguageFun } = useTranslationSummaryConfig();
  try {
    const { type } = req.query as {
      type: 'translate' | 'summary'; // 默认为翻译
    };
    const results: any = [];
    const convertResult: any = [];
    fs.createReadStream('output.csv')
      .pipe(csv())
      .on('data', (data: any) => results.push(data))
      .on('end', async () => {
        console.log(results);
        for (const element of results) {
          while (true) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            try {
              const derivedLanguage =
                type === 'translate' ? '' : judgmentLanguageFun(element.question);
              const question = await translate(element.question, type, derivedLanguage);
              const answer =
                type === 'translate'
                  ? await translate(element.answer, type, derivedLanguage)
                  : element.answer;
              convertResult.push({ Field: question, Value: answer });
              break;
            } catch (e) {
              console.log(e);
              console.error('An error occurred');
            }
          }
        }

        const csvFilePath = './ttttt.csv';
        const csvWriterObject = csvWriter.createObjectCsvWriter({
          path: csvFilePath,
          header: [
            { id: 'Field', title: 'question' },
            { id: 'Value', title: 'answer' }
          ],
          alwaysQuote: false // 强制使用引号包围字段值
        });

        await csvWriterObject.writeRecords(convertResult);
        // 在写入完成后，手动添加 BOM
        fs.writeFileSync(csvFilePath, `\ufeff${fs.readFileSync(csvFilePath, 'utf8')}`, 'utf8');

        jsonRes(res, {
          ...results
        });
      });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
