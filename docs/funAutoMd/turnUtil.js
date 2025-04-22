import jsdoc2md from 'jsdoc-to-markdown';
import fs from 'fs';
import path from 'path';

// 定义输入输出路径
const inputDir = 'docs/funAutoMd/source';
const outputDir = 'docs/funAutoMd/md';

// 获取所有 JS 文件路径
const files = fs.readdirSync(inputDir)
  .filter(file => file.endsWith('.js'))
  .map(file => path.join(inputDir, file));

console.log('files', files)

// 异步函数来处理文件并生成文档
async function generateDocs() {
    try {
        // 确保 docs 目录存在

        for (const file of files) {
            const filePath = path.join(process.cwd(), file);
            const outputFilePath = path.join(process.cwd(), outputDir, `${file.replace(inputDir, '').replace('.js', '')}.md`);
            console.log('filePath', filePath)
            console.log('outputFilePath', outputFilePath)
            // 生成 Markdown 文档
            const output = await jsdoc2md.render({ files: filePath });

            // 将生成的 Markdown 写入文件
            fs.writeFileSync(outputFilePath, output);
            console.log(`Generated docs for ${file} at ${outputFilePath}`);
        }
    } catch (error) {
        console.error('Error generating docs:', error);
    }
}

// 调用函数开始生成文档
generateDocs();