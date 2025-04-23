import jsdoc2md from 'jsdoc-to-markdown';
import fs from 'fs';
import path from 'path';

// 定义输入输出路径
const inputDir = 'docs/funAutoMd/source';
const outputDir = 'docs/funAutoMd/md';
const sidbarBase = '/funAutoMd/md/'

const fileNameMap = {
    'math': '方法集',
    'str': '字符集',
}

// 获取所有 JS 文件路径
const files = fs.readdirSync(inputDir)
  .filter(file => file.endsWith('.js'))
  .map(file => {
    console.log('file', file)
    let name = file.replace('.js', '')
    return {
        name: name, // 文件名
        text: fileNameMap[name] || name, // 文件名对应的标题
        file: file, // 文件名，带扩展名（.js）
        outPath: path.join(process.cwd(), outputDir, `${name}.md`), // 输出文件路径
        filePath: path.join(process.cwd(), inputDir, file), // 输入文件路径
        sidebarPath: `${sidbarBase}${name}`
    }
});



console.log('files', files)

// 异步函数来处理文件并生成文档
async function generateDocs() {
    try {
        let arr = []
        // 遍历文件并生成 Markdown 文档
        for (const file of files) {
            arr.push({
                text: file.text,
                link: file.sidebarPath,
            })
            // 生成 Markdown 文档
            const output = await jsdoc2md.render({ files: file.filePath  });
            // console.log('output', output)
            // 将生成的 Markdown 写入文件
            fs.writeFileSync(file.outPath, output);
        }
        fs.writeFileSync(path.join(process.cwd(), 'docs/funAutoMd', 'funSidebar.js'), `export const funSidebar = ${JSON.stringify(arr, null, 4)}`)
    } catch (error) {
        console.error('Error generating docs:', error);
    }
}

// 调用函数开始生成文档
generateDocs();