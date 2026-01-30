// 验证所有动态数据 JSON 文件的格式
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonFiles = [
  'public/announcement.json',
  'public/countdowns.json',
  'public/todos.json',
  'public/exams.json',
  'public/micro-news.json',
  'public/glossary.json'
];

let hasError = false;

console.log('开始验证 JSON 文件...\n');

jsonFiles.forEach(file => {
  try {
    const content = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
    JSON.parse(content);
    console.log(`✓ ${file} - 格式正确`);
  } catch (error) {
    console.error(`✗ ${file} - 格式错误:`);
    console.error(`  ${error.message}\n`);
    hasError = true;
  }
});

if (hasError) {
  console.error('\n验证失败！请修复上述错误。');
  process.exit(1);
} else {
  console.log('\n所有 JSON 文件格式正确！');
  process.exit(0);
}
