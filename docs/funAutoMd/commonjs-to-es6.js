import fs from "fs/promises";
import path from "path";
import * as acorn from "acorn";
import * as recast from "recast";

const inputDir = "docs/funAutoMd/sourse";
const outputDir = "docs/funAutoMd/es6sourse";

// 执行主函数
transformDirectory(inputDir, outputDir).catch((error) => {
    console.error("程序执行出错:", error);
    process.exit(1);
});

// 主函数：转换单个文件
async function transformFile(inputPath, outputPath) {
    try {
        const source = await fs.readFile(inputPath, "utf8");

        // 解析代码，特别配置以保留注释
        const ast = recast.parse(source, {
            parser: {
                parse(source) {
                    // 启用onComment选项来收集所有注释
                    const comments = [];
                    const tokens = [];
                    const ast = acorn.parse(source, {
                        ecmaVersion: 2020,
                        sourceType: "module",
                        locations: true,
                        ranges: true,
                        onComment: comments,
                        onToken: tokens,
                    });
                    // 将注释附加到AST
                    ast.comments = comments;
                    return ast;
                },
            },
        });

        // 提取define内部的内容并转换导出语句
        const transformedAst = transformExports(extractDefineContent(ast));

        // 打印AST时明确保留注释
        const outputOptions = {
            comment: true, // 强制保留注释
            quote: "single", // 使用单引号
        };

        const transformedCode = recast.print(
            transformedAst,
            outputOptions
        ).code;

        await fs.writeFile(outputPath, transformedCode);
        console.log(`已转换: ${inputPath} -> ${outputPath}`);
    } catch (error) {
        console.error(`处理文件 ${inputPath} 时出错:`, error);
    }
}

// 提取define包装内的内容，保留注释关联
function extractDefineContent(ast) {
    let defineBody = [];

    // 遍历AST查找define调用
    recast.visit(ast, {
        visitCallExpression(path) {
            const node = path.node;

            // 检查是否为define(...)调用
            if (
                node.callee.type === "Identifier" &&
                node.callee.name === "define"
            ) {
                const callbackArg = findDefineCallback(node.arguments);

                if (callbackArg) {
                    // 提取函数体内容
                    defineBody = callbackArg.body.body;
                    // 停止遍历
                    return false;
                }
            }

            // 继续遍历子节点
            this.traverse(path);
        },
    });

    // 创建新的Program节点，包含提取的内容
    return {
        type: "Program",
        body: defineBody,
        sourceType: "module",
    };
}

// 查找define调用中的回调函数参数
function findDefineCallback(args) {
    // 处理不同形式的define调用
    if (args.length === 1 && args[0].type === "FunctionExpression") {
        // 形式1: define(function() { ... })
        return args[0];
    } else if (
        args.length >= 2 &&
        args[args.length - 1].type === "FunctionExpression"
    ) {
        // 形式2: define(['dep1', 'dep2'], function(dep1, dep2) { ... })
        return args[args.length - 1];
    }

    return null;
}

// 将CommonJS导出转换为ES6导出
function transformExports(ast) {
    const newBody = [];
    const { builders: b } = recast.types;

    ast.body.forEach((node) => {
        // 跳过exports.xxx赋值
        if (
            node.type === "ExpressionStatement" &&
            node.expression.type === "AssignmentExpression" &&
            node.expression.left.object?.name === "exports"
        ) return;

        // 处理函数声明
        if (node.type === "FunctionDeclaration") {
            // 克隆函数节点并剥离注释
            const clonedFunc = { ...node };
            const tem = clonedFunc.comments || [];
            clonedFunc.comments = null; // 清空原函数节点的注释

            // 创建export声明，并将注释附加到export节点
            const exportNode = b.exportNamedDeclaration(clonedFunc, []);
            exportNode.comments = tem; // 直接绑定到export节点的comments属性

            newBody.push(exportNode);
        } else {
            newBody.push(node);
        }
    });

    return { ...ast, body: newBody };
}

// 处理目录中的所有文件
async function transformDirectory(inputDir, outputDir) {
    try {
        // 确保输出目录存在
        await fs.mkdir(outputDir, { recursive: true });

        // 读取目录中的所有项
        const entries = await fs.readdir(inputDir, { withFileTypes: true });

        // 处理每个项
        for (const entry of entries) {
            const inputPath = path.join(inputDir, entry.name);
            const outputPath = path.join(outputDir, entry.name);

            if (entry.isDirectory()) {
                // 递归处理子目录
                await transformDirectory(inputPath, outputPath);
            } else if (entry.isFile() && path.extname(entry.name) === ".js") {
                // 处理JavaScript文件
                await transformFile(inputPath, outputPath);
            }
        }
    } catch (error) {
        console.error(`处理目录 ${inputDir} 时出错:`, error);
    }
}