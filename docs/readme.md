# 文档网站 README 指南

## 简介
文档库项目集成了组件库文档、开发辅助工具、通用函数文档等三大模块
- 组件库是基于业务抽离出来的公共组件，文档详细介绍组件的使用、方法、参数、api等，以及使用组件的demo，前置依赖等。从而提升开发效率，减少重复代码
- 工具是一些辅助开发的工具，如：解析柜台数据，JSON格式化，获取字段下标，css转换，埋点Excel读取，持仓数据解析等
- 通用函数是通过业务抽离出来的纯函数，如：时间格式化，数字格式化等

## 目录结构
```
├── docs/  # 文档目录，存放各个模块的文档
│   ├── .vitepress/  # vitepress 配置目录
│   │   ├── dist/  # 打包后的静态资源
│   │   ├── theme/  # 主题配置目录
│   │   │   ├── common.less  # 全局通用样式
│   │   │   ├── index.js  # 主题配置文件，注册全局ElementPlus、VxeUITable、store、自定义组件以及全局样式，全局的方法，库等
│   │   │   └──...  # 其他主题配置文件
│   │   ├── config.mjs  # vitepress 配置文件
│   │   └── sidebar.js  # 文档配置表，自动生成路由文档
│   ├── assets/  # 静态资源目录，存放图片、样式、静态页面等
│   ├── common/  # 通用文件
│       ├── utils  # 工具函数，例如全局copy，服务端字符串转对象等公共方法 
│       └──...
│   ├── component/  # 组件库文档中的组件
│   │   ├── search/  # 搜索组件
│   │       ├── README.md  # 搜索组件 README 指南
│   │       ├── css  # css 样式
│   │       ├── img  # 图片静态资源
│   │       ├── config  # 模拟数据，配置等
│   │       ├── fun.js  # 接口请求函数
│   │       ├── index.js.js  # 组件入口文件，主要逻辑
│   │       ├── template.html  # 组件模板文件，主要结构
│   │       └── demo  # 组件demo
│   │           ├── demo.html  # demo入口文件
│   │           └── demo.js  # demo脚本
│   │   └── ...  # 其他组件文档
│   ├── fun/  # 通用函数文档
│   │   ├── autoMd/  # 通过脚本生成的md文档
│   │   ├──...  # 其他通用函数文档
│   ├── funAutoMd/  # 将函数文档转换为md文档
│   │   ├── es6sourse/  # 通过脚本自动生成的ES6代码
│   │   ├── jstomd  # es6代码转换为md文档的脚本
│   │       ├── ast-extract-code.js  # 解析ES6代码并提取代码块，将其加入到md文档中
│   │       ├── index.js  # 转换代码主逻辑，通过jsdoc2md插件及模板生成md文档
│   │       └──mdtemplate.hbs  # 模板文件，用于生成md文档
│   │   ├── sourse/  # commonjs格式的源代码
│   │   └── test/ # 测试用例
│   ├── tools/  # 工具文档
│   ├── vueCom/  # Vue组件，大部分是工具组件，还有通用组件，流入侧边栏抽屉(文档中的测试报告等)，反馈组件等，Vue组件目前均在该目录下添加
│   ├── index.md  # 文档网站首页md
│   └──  README.md  # 文档网站 README 指南
...

```

## 快速开始及package脚本说明
``` 
# 安装依赖
npm install

# 启动开发服务器
npm run dev || npm run serve || npm run start

# 构建生产版本
npm run build

# 打包并自动发布
npm run buildUp

# 发布打包产物
npm run updoc

# 增量发布组件（检查变动，只有变动的文件才会上传）
npm run upcomponet

# 全量发布组件
npm run upcomponetfull

# 根据文档注释自动生成MD文档
npm run jsdoc2md

# 启动测试用例并自动发布测试更新测试报告到文档
npm run test

```

## 配置说明
```
// .vitepress/config.js
export default {
  title: '项目名称',
  description: '项目描述',
  head: '网站icon'
  base: '站点基础配置',
  lastupdated: '显示最后更新时间',
  vite: {
    // vite 配置
  },
  markdown: {
    // markdown 配置
  }
  themeConfig: {
    nav: [
      // 导航配置
    ],
    sidebar: [
      // 侧边栏配置
    ],
    search: {
      // 搜索配置
    }
  }
}
```

## md文档编写规范及如何使用Vue组件
[官方文档](https://markdown.com.cn/)

## 单元测试及函数住宿规范
单元测试主要用了jest，起语法建议参考[jest实践指南](https://github.yanhaixiang.com/jest-tutorial/)

## 项目主要所用的技术栈
- vitepress 
- vue3
- @vueuse/core vue3常用方法库（虚拟列表）
- element-plus 组件库
- vxe-table 表格组件
- jest 单元测试
- jsdoc-to-markdown 生成md文档
- vue-json-pretty 格式化json
- xlsx 解析excel 生成excel
- less 样式
- ...