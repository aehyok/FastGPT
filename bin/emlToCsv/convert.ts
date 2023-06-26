import * as fs from 'fs';
import * as csvWriter from 'csv-writer';
import * as mailparser from 'mailparser';

interface EmlData {
  date?: string;
  orderId?: string;
  text?: string;
  toEml?: string;
  fromEml?: string;
  product?: string;
  formRole?: 'buyer' | 'seller'; // 发送者角色 buyer: 买家, seller: 卖家
}

const emlDataConvertedList: Record<string, EmlData[]> = {};

const data: EmlData = {};

// 自定义比较函数
const compareDates = (a: EmlData, b: EmlData) => {
  const dateA = new Date(a.date).getTime();
  const dateB = new Date(b.date).getTime();
  return dateA - dateB;
};

const setEmlDataConverted = (data: EmlData) => {
  const key = data.orderId;
  emlDataConvertedList[key]
    ? emlDataConvertedList[key].push(data)
    : (emlDataConvertedList[key] = [data]);
  // 根据日期进行排序
  emlDataConvertedList[key].sort(compareDates);
};

const getEmlDataConverted = (headers: any, text: string, html: string): EmlData => {
  data.formRole =
    headers.get('from').text.indexOf('donotreply@amazon.com') === -1 ? 'buyer' : 'seller';
  data.date = headers.get('date');
  const headerFromHtml = headers.get('from').html;
  const headerToHtml = headers.get('to').html;
  const headerHtmlStart = '<a href="mailto:';
  data.fromEml = headerFromHtml.substring(
    headerFromHtml.indexOf(headerHtmlStart) + headerHtmlStart.length,
    headerFromHtml.indexOf('" class')
  );
  data.toEml = headerToHtml.substring(
    headerToHtml.indexOf(headerHtmlStart) + headerHtmlStart.length,
    headerToHtml.indexOf('" class')
  );
  const sellerTextStart = '-------------- 开始使用邮件 --------------------';
  const sellerTextEnd = '-------------- 结束消息 -----------------------';
  const buyerTextStart = '------------- 邮件正文开始: -------------';
  const buyerTextEnd = '------------- End message -------------';

  if (text) {
    const sellerTextOrderStart = '订单编号：';
    const buyerTextOrderStart = '# ';
    data.orderId =
      data.formRole === 'buyer'
        ? text
            .substring(
              text.indexOf(buyerTextOrderStart) + buyerTextOrderStart.length,
              text.indexOf(':\n1')
            )
            .replace(/\s*/g, '')
        : text
            .substring(
              text.indexOf(sellerTextOrderStart) + sellerTextOrderStart.length,
              text.indexOf(':\n\n#')
            )
            .replace(/\s*/g, '');
    const symbols = ['\n', "'", '+']; // 要删除的符号列表
    const symbolRegex = new RegExp(symbols.map((sym) => '\\' + sym).join('|'), 'g');
    data.text =
      data.formRole === 'buyer'
        ? text
            .substring(
              text.indexOf(buyerTextStart) + buyerTextStart.length,
              text.indexOf(buyerTextEnd)
            )
            .replace(symbolRegex, '')
        : // .replace(/\s*/g, '')
          text
            .substring(
              text.indexOf(sellerTextStart) + sellerTextStart.length,
              text.indexOf(sellerTextEnd)
            )
            .replace(symbolRegex, '');
    // .replace(/\s*/g, '');
  } else {
    const htmlOrderStart = '订单编号： ';
    data.orderId =
      data.formRole === 'buyer'
        ? html
            .substring(html.indexOf(htmlOrderStart) + htmlOrderStart.length, html.indexOf(':</p>'))
            .replace(/\s*/g, '')
        : html
            .substring(html.indexOf(htmlOrderStart) + htmlOrderStart.length, html.indexOf(':</p>'))
            .replace(/\s*/g, '');
    const regex = /<pre(?:\s[^>]*)?>(.*?)<\/pre>/s;
    const match1 = html.match(regex);
    data.text = match1 ? match1[1] : '';
  }
  return data;
};

async function convertEmlToCsv(emlFolderPath: string, csvFilePath: string) {
  const csvData = [];
  // csvData.push(['question', 'answer']);
  const emlFiles = fs.readdirSync(emlFolderPath);
  for (const emlFile of emlFiles) {
    const emlFilePath = `${emlFolderPath}/${emlFile}`;
    const emlData = fs.readFileSync(emlFilePath, 'utf-8');
    const mail = await mailparser.simpleParser(emlData);
    const { headers, subject, text, html } = mail;
    setEmlDataConverted(
      JSON.parse(JSON.stringify(getEmlDataConverted(headers, text, html as string)))
    );
  }

  for (const key of Object.keys(emlDataConvertedList)) {
    let question = '';
    let answer = '';
    emlDataConvertedList[key].forEach((item) => {
      if (item.formRole === 'seller' && question === '') return;
      if (item.formRole === 'buyer' && question === '') return (question = item.text);
      if (item.formRole === 'buyer' && question !== '' && answer === '')
        return (question = question + '\n' + item.text);
      if (item.formRole === 'buyer' && question !== '' && answer !== '') {
        csvData.push({ Field: question, Value: answer });
        question = item.text;
        return (answer = '');
      }
      if (item.formRole === 'seller' && answer === '') return (answer = item.text);
      if (item.formRole === 'seller' && answer !== '') return (answer = answer + '\n' + item.text);
    });
  }

  const csvWriterObject = csvWriter.createObjectCsvWriter({
    path: csvFilePath,
    header: [
      { id: 'Field', title: 'question' },
      { id: 'Value', title: 'answer' }
    ],
    alwaysQuote: true // 强制使用引号包围字段值
  });

  await csvWriterObject.writeRecords(csvData);
  console.log('Conversion completed successfully!');
}

const emlFolderPath = '../../../mail-eco';
const csvFilePath = './output.csv';

convertEmlToCsv(emlFolderPath, csvFilePath).catch((error) => {
  console.error('Error occurred during conversion:', error);
});
