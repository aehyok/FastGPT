import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@/service/response';
import fs from 'fs';
import csv from 'csv-parser';
import * as csvWriter from 'csv-writer';
import { Configuration, OpenAIApi } from 'openai';

async function translate(prompt: string) {
  let startTime = Date.now();
  const configuration = new Configuration({
    apiKey: process.env.OPENAIKEY,
    basePath: process.env.OPENAI_BASE_URL
  });

  const chatApi = new OpenAIApi(configuration);

  const chatCompletion = await chatApi.createChatCompletion({
    model: 'gpt-3.5-turbo-16k',
    messages: [{ role: 'user', content: `请将下面的内容翻译为中文：${prompt}` }]
  });
  return chatCompletion.data.choices[0].message?.content;
}
/* 获取单独设置的QaConfig 通过配置在数据库直接进行读取 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
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
              const question = await translate(element.question);
              const answer = await translate(element.answer);
              console.log(question);
              convertResult.push({ Field: question, Value: answer });
              break;
            } catch (e) {
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