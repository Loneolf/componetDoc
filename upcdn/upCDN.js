import fs from "fs";
import path from "path";
import COS from "cos-nodejs-sdk-v5"
import { COSSECRET, region, upConfig } from "./myConfig.js";

const cos = new COS({
	SecretId: COSSECRET.id,
	SecretKey: COSSECRET.key,
});

const upc = upConfig[process.env?.upType || 'doc']

const bucket = upc.bucket
// 默认是全量上传
const isFullUp = process.env?.up || 'full'

// const TestData = {}
// traverseFiles(upc.upDir, (fileData) => {
// 	TestData[fileData.filePath] = fileData
// });
// setTimeout(async () => {
// 	write(TestData)
// 	// await deleteFile();
// 	// arr.forEach((item) => {
// 	// 	uploadFile(item);
// 	// });
// }, 300);
console.log(isFullUp)
main()
async function main() {
	const Data = await readFile()
	let upList = Data.newDataList
	let del = upList
	if (!upList.length) {
		return console.log('没有文件更新')
	}
	if (isFullUp === 'increment') {
		let tem = getDiff(Data.newData, Data.originData)
		upList = tem.diffList
		del = tem.needDeletList
	}
	if (isFullUp === 'full') {
		await deletAllFile()
	} else {
		await deleteFile(del)
	}
	console.log('上传文件', upList)
	upList.forEach((item) => {
		uploadFile(item);
	});
	write({data: Data.newData, list: Data.newDataList})
}

// 删除所有文件
function deletAllFile() {
	return new Promise((resolve, reject) => {
		cos.getBucket({
			Bucket: bucket,
			Region: region,
			Prefix: upc.cosDir, 
			Marker: upc.cosDir, 
			MaxKeys: 10000,
		}, function (listError, listResult) {
			if (listError) return console.log('list error:', listError);
			var objects = listResult.Contents.map(function (item) {
				return {filePath: item.Key}
			});
			if (!objects.length) {
				console.log(upc.cosDir + '目录下已无数据')
				resolve()
				return
			}
			deleteFile(objects).then(()=> {
				resolve()
			}).catch(()=>{
				reject()
			})
		})
	})
}

// 删除文件
function deleteFile(delArr) {
	if (!delArr.length) return
	return new Promise((res, rej)=> {
		var objects = delArr.map(function (item) {
			return { Key: item.filePath };
		});
		console.log('清理目录', objects)
		cos.deleteMultipleObject(
			{
				Bucket: bucket,
				Region: region,
				Objects: objects,
			},
			function (delError, deleteResult) {
				if (delError) {
					console.log(delError);
					return rej()
				}
				if (deleteResult?.statusCode === 200) {
					console.log("清理原目录成功！");
					return res();
				}
				rej()
			}
		);
	})
}


//单个上传文件
async function uploadFile(pathItem) {
	cos.putObject(
		{
			Bucket: bucket,
			Region: region,
			Key: pathItem.filePath, //上传到 存储桶 的路径 *
			StorageClass: "STANDARD",
			Body: fs.createReadStream(pathItem.originPath), // 被上传的 文件对象
			Headers: {
				'Content-Disposition': "inline",
				"X-Frame-Options": "SAMEORIGIN"
			},
		},
		function (err, data) {
			if (data?.statusCode === 200) {
				console.log(`上传${pathItem.filePath}到cdn成功！`);
			}
			if (err) {
				console.log(err);
			}
		}
	);
}
// 读取文件，获取本地文件列表和存储的json形式旧数据
// 会返回数组和对象形式的数据，返回对象是因为使用对象做差分diff性能更优
function readFile() {
	let newData = {};
	let originData = {}
	let newDataList = [];
	let originDataList = []
	return new Promise((resolve, reject) => {
		traverseFiles(upc.upDir, (fileData) => {
			newData[fileData.filePath] = fileData
			newDataList.push(fileData)
		});
		fs.readFile(path.resolve(path.resolve(), upc.outFile), (err, data) => {
			if (err) {
				console.error(err)
			} else {
				try {
					if (data) {
						let tem = JSON.parse(data)
						originData = tem.data
						originDataList = tem.list
					}
				} catch (error) {
					console.error(error)
				}
			}
		})
		setTimeout(() => {
			resolve({
				originData,
				newData,
				newDataList,
				originDataList
			})
		}, 200);

	})
}

// 递归读取打包后的文件夹，返回文件夹目录
function traverseFiles(folderPath, callback) {
	fs.readdir(folderPath, (err, files) => {
		if (err) throw err;
		// 遍历文件列表
		files.forEach((file) => {
			const filePath = path.join(folderPath, file);
			fs.stat(filePath, (err, stats) => {
				if (err) throw err;
				if (stats.isFile()) {
					const path = `${upc.cosDir}${filePath.replace(/\\/g, "/").replace(`${upc.upDir}/`, "")}`
					callback({
						filePath: path, 
						size:stats.size, 
						time: stats.mtime,
						originPath: filePath,
					});
				} else if (stats.isDirectory()) {
					traverseFiles(filePath, callback);
				}
			});
		});
	});
}

// 通过比对文件的更新时间和文件大小，获取需要更新的文件
// needDeletList，需要删除的文件，新数据中没有的文件或者更新的文件，都需要删除
function getDiff(newData, oldData) {
	// 旧列表有而新列表没有，则放入到删除list中，新列表中有或者与旧列表的更新时间大小不一样的，放入到diffList中
	// 所以新旧列表都需要循环一遍
	newData = JSON.parse(JSON.stringify(newData))
	let needDeletList = []
	let diffList = []
	
	for (const key1 in newData) {
		let newItem = newData[key1]
		let oldItem = oldData[key1]
		if (!oldItem || newItem.time !== oldItem.time || newItem.size !== oldItem.size) {
			diffList.push(newItem)
		}
	}
	for (const key2 in oldData) {
		if (!newData[key2] ){
			needDeletList.push(oldData[key2])
		}
	}
	return {
		needDeletList: [...needDeletList, ...diffList],
		diffList,
	}
}

/**
 * 将数据写入文件。
 * 
 * @param {any} data - 需要写入文件的数据，该数据会被转换为 JSON 字符串。
 * @param {string} [p] - 可选参数，指定要写入的文件路径。如果未提供，则使用配置中的输出文件路径。
 */
function write(data, p) {
    fs.writeFile(
        p || path.resolve(path.resolve(), upc.outFile),
        JSON.stringify(data),
        (error) => {
            if (error) {
                console.log("写入文件错误", error);
            } else {
                console.log("更新目录文件成功");
            }
        }
    );
}