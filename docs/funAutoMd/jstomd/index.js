import jsdoc2md from 'jsdoc-to-markdown';
import fs from 'fs';
import path from 'path';
import { extractFunctionBodies } from './ast-extract-code.js';


// 定义输入输出路径
const inputDir = 'docs/funAutoMd/es6sourse';
const outputDir = 'docs/fun/autoMd';
const sidbarBase = '/fun/autoMd/'

const fileNameMap = {
    'common': '通用函数',
    'commonData': '通用请求数据',
}


// 获取所有 JS 文件路径
const files = fs.readdirSync(inputDir)
  .filter(file => file.endsWith('.js'))
  .map(file => {
    // console.log('file', file)
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

// 调用函数开始生成文档
generateDocs();


// 异步函数来处理文件并生成文档
async function generateDocs() {
    // 临时文件路径
    try {
        let arr = []
        let tempath
        // 遍历文件并生成 Markdown 文档
        for (const file of files) {
            arr.push({
                text: file.text,
                link: file.sidebarPath,
            })
            const tempFilePath = `${file.filePath}.temp.js`;  
            tempath = tempFilePath
            
            // 读取原始文件内容
            const originalContent = await fs.promises.readFile(file.filePath, 'utf8');
            // 过滤掉 export const xxx = xxx; 这类语句
            const filteredContent = originalContent.replace(/^export\s+const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*\1\s*;$/gm, '');
            // console.log('aaafilepath', file.filePath)
            // 创建临时文件
            await fs.promises.writeFile(tempFilePath, filteredContent);
            
            // 读取模板文件
            const templatepath = path.join(process.cwd(), 'docs/funAutoMd/jstomd/mdtemplate.hbs')
            const template = await fs.promises.readFile(templatepath, 'utf8');

            // 获取 JSDoc 数据
            const templateData = await jsdoc2md.getTemplateData({
                files: tempFilePath,
            });
            // 解析源代码并提取函数体
            await extractFunctionBodies(templateData);

            addInfo(templateData)

            console.log('templateData', JSON.stringify(templateData[0], null, 2)); // 查看第一个文档对象

            const output = await jsdoc2md.render({ 
                // files: tempFilePath,
                data: templateData,
                template: template,
            });

            // 删除临时文件
            await fs.promises.unlink(tempFilePath);
            
            console.log(`md文档已生成: ${file.sidebarPath}.md`)
            // 将生成的 Markdown 写入文件
            fs.writeFileSync(file.outPath, output);
        }
        fs.writeFileSync(path.join(process.cwd(), 'docs/funAutoMd', 'funSidebar.js'), `export const funSidebar = ${JSON.stringify(arr, null, 4)}`)
    } catch (error) {
        console.error('Error generating docs:', error);
        try {
            await fs.promises.access(tempath);
            await fs.promises.unlink(tempath);
            console.log('已清理临时文件');
          } catch (unlinkError) {
            // 忽略文件不存在的错误
          }
    }
}

function addInfo(templateData) {
    templateData?.forEach((item, index) => {
        let fileName = item.meta?.filename.replace(/\.temp|\.js/g, '')
        if (index === 0) {
            item.title = fileNameMap[fileName] || fileName || ''
        }
        item.cpath = `var util = require('vue/utils/${fileName}')`
        item.use = `util.${item.name}...`
        item.needDescription = item.params?.some(param => param.description && param.description.trim() !== '');
        item.notDescription = !item.needDescription;
        item.code = item.code?.replace('export ', '')
    });
}