// ast-extract-code.js
import { parse } from "@babel/parser";
import { readFileSync } from "fs";
import { join } from "path";

import traverse from '@babel/traverse';

// 解析源代码并提取函数体
export async function extractFunctionBodies(templateData) {
	// 按文件分组所有函数 doclet
	const functionsByFile = {};

	templateData.forEach((doc) => {
		if (doc.kind === "function" && doc.meta && doc.meta.filename) {
			const filePath = join(
				doc.meta.path || "",
				doc.meta.filename
			);
			functionsByFile[filePath] = functionsByFile[filePath] || [];
			functionsByFile[filePath].push(doc);
		}
	});

	// 创建文件内容缓存
	const fileContentCache = new Map();

	// 遍历每个文件，提取函数体
	for (const filePath in functionsByFile) {
		try {
			// 读取文件内容（每个文件只读取一次）
			let source = fileContentCache.get(filePath);
			if (!source) {
				source = readFileSync(filePath, "utf8");
				fileContentCache.set(filePath, source);
			}

			// 解析源代码为 AST
			const ast = parseSourceCode(source);
			if (!ast) continue;

			// 提取所有函数信息
			const functions = extractFunctionsFromAST(ast, source);

			// 将提取的函数体关联到对应的 doclet
			associateFunctionsWithDoclets(functions, functionsByFile[filePath]);
		} catch (error) {
			console.warn(`Error processing ${filePath}:`, error);
		}
	}
}

// 解析源代码为 AST
function parseSourceCode(source) {
	try {
		return parse(source, {
			sourceType: "module",
			plugins: ["typescript", "classProperties", "decorators-legacy"],
		});
	} catch (error) {
		console.warn("Error parsing source code:", error.message);
		return null;
	}
}

// 从 AST 中提取函数信息
function extractFunctionsFromAST(ast, source) {
	const functions = {};

	traverse.default(ast, {
		// 处理普通函数声明
		FunctionDeclaration(path) {
			const name = path.node.id?.name || "anonymous";
			functions[name] = extractFunctionBody(source, path);
		},

		// 处理箭头函数
		ArrowFunctionExpression(path) {
			const name = findFunctionName(path);
			if (name) functions[name] = extractFunctionBody(source, path);
		},

		// 处理类方法
		ClassMethod(path) {
			const name = path.node.key.name;
			functions[name] = extractFunctionBody(source, path);
		},
	});

	return functions;
}

// 将提取的函数体关联到 doclet
function associateFunctionsWithDoclets(functions, doclets) {
	doclets.forEach((doc) => {
		// 尝试多种名称匹配方式
		const possibleNames = [
			doc.name, // 完整名称
			doc.name.split(".").pop(), // 简单名称
			`${doc.memberof}.${doc.name}`, // 带命名空间
		];

		for (const name of possibleNames) {
			if (functions[name]) {
				doc.code = functions[name];
				break;
			}
		}
	});
}

// 辅助函数：提取函数体文本
function extractFunctionBody(source, path) {
	const startLine = path.node.loc.start.line - 1;
	const endLine = path.node.loc.end.line;
	const lines = source.split("\n");
	return lines.slice(startLine, endLine).join("\n");
}

// 辅助函数：查找箭头函数名称
function findFunctionName(path) {
	let parent = path.parentPath;

	while (parent) {
		if (parent.isVariableDeclarator()) {
			return parent.node.id.name;
		} else if (parent.isClassProperty() || parent.isObjectProperty()) {
			return parent.node.key.name;
		}
		parent = parent.parentPath;
	}

	return null;
}
