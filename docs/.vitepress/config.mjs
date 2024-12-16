import { defineConfig } from "vitepress";
import {
	demoblockPlugin,
	demoblockVitePlugin,
} from "vitepress-theme-demoblock";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path from "path";
// import AutoImport from 'unplugin-auto-import/vite'
// import Components from 'unplugin-vue-components/vite'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'


import sidebar from "./sidebar";

console.log(process.env.base)

export default defineConfig({
	title: "文档库",
	description: "组件库",

	base: process.env.base || "/doc/",

	returnToTopLabel: '返回顶部', // 自定义返回顶部文字

	vite: {
		plugins: [
			demoblockVitePlugin(), 
			vueJsx(),
			// AutoImport({
			// 	resolvers: [ElementPlusResolver()],
			// }),
			// Components({
			// 	resolvers: [ElementPlusResolver()],
			// }),
		],
		resolve: {
			alias: {
				"@c": path.resolve(__dirname, "../componet"),
				"@vc": path.resolve(__dirname, "../vueCom"),
				"@t": path.resolve(__dirname, "../tools"),
				"@com": path.resolve(__dirname, "../common"),
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
			{ text: "组件", link: "/componetmd/timeSelect", activeMatch: "/componetmd/" },
			{ text: "工具", link: "/tools/filedsIndex", activeMatch: "/tools/" },
			{ text: "文档", link: "/toolmd/time", activeMatch: "/toolmd/" },
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
