import { defineConfig } from "vitepress";
import {
	demoblockPlugin,
	demoblockVitePlugin,
} from "vitepress-theme-demoblock";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vitePluginRaw from 'vite-plugin-raw';
import path from "path";


import sidebar from "./sidebar";

console.log(process.env.base)

export default defineConfig({
	title: "文档库",
	description: "组件库",
	head: [['link', { rel: 'icon',  type: 'image/png', href: '/doc/favicon.png' }]],
	base: process.env.base || "/doc/",

	returnToTopLabel: '返回顶部', // 自定义返回顶部文字
	lastUpdated: true, // 显示最后更新时间
	vite: {
		assetsInclude: ['**/*.html'],
		plugins: [
			demoblockVitePlugin(), 
			vueJsx(),
			vitePluginRaw({
				match: /\.html$/,
			}),
			// 定义组件, 可以直接使用defineOptions
		],

		resolve: {
			alias: {
				"@c": path.resolve(__dirname, "../componet"),
				"@vc": path.resolve(__dirname, "../vueCom"),
				"@t": path.resolve(__dirname, "../tools"),
				"@com": path.resolve(__dirname, "../common"),
				"@a": path.resolve(__dirname, "../assets"),
			},
		},
	},

	markdown: {
		theme: { light: "github-light", dark: "github-dark" },
		image: {
			// 开启图片懒加载
			lazyLoading: true,
		},
		config: (md) => {
			md.use(demoblockPlugin, {
				customClass: "demoblock-custom",
			});
		},
	},

	// cleanUrls: true,

	themeConfig: {
		nav: [
			{ text: "组件", link: "/componet/TimeBar/readme", activeMatch: "/componet/" },
			{ text: "工具", link: "/tools/parseHold", activeMatch: "/tools/" },
			{ text: "文档", link: "/fun/time", activeMatch: "/fun" },
			{ text: "关于本站", link: "/readme"},
			{ text: "建议与反馈", link: '/FeedBack' },
		],

		sidebar,
		outline: [2,4],
		outlineTitle: '大纲~~~',
		//  开启搜索功能
		search: {
			provider: "local",
		},
	},
});
