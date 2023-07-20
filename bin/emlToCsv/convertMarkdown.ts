import { marked } from 'marked';
import fs from 'fs';

// 创建一个新的 renderer
const renderer = new marked.Renderer();

// 初始化一个数组来存储所有的二级标题

interface Qa {
  question?: string
  answer?: string
}

let headerLength = 0;
let pargraraphLength = 0;
const ListData: Record<string, Qa>[] = []
// 重写 renderer 的 heading 方法
renderer.heading = (text, level) => {
  // 如果是二级标题
  if (level === 3) {
    // 将标题添加到数组中;
    console.log(level, text);
    ListData[headerLength] = { ...ListData[headerLength], answer: text };
    headerLength++;
    
  }
};

renderer.paragraph = (text) => {
  console.log('paragraph', pargraraphLength)
  console.log(text);
  ListData[pargraraphLength] = { ...ListData[pargraraphLength], question: text };
  pargraraphLength++;
};


fs.readFile('./index.md', 'utf8', function (err, data) {
  if (err) {
    console.log('Error: ' + err);
    return;
  }
  console.log(data, 'data---data')
  marked(data, { renderer });
  console.log(ListData);  
});

// 使用自定义的 renderer 解析 Markdown 文本


// 输出所有的二级标题
// ['Subtitle 1.1', 'Subtitle 1.2', 'Subtitle 2.1']
