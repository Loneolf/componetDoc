// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import DefaultTheme from "vitepress/theme";

import Feedback from "../../vueCom/Feedback.vue";

// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'

import { copyString } from '../../common/util'

import "./style.css";
import "./toolsPage.less"

/** @type {import('vitepress').Theme} */
export default {
	extends: DefaultTheme,
	Layout: () => {
		return h(DefaultTheme.Layout, null, {
			// https://vitepress.dev/guide/extending-default-theme#layout-slots
		});
	},
	enhanceApp({ app, router, siteData }) {
		// app.use(ElementPlus)
		app.config.globalProperties.$copyString = copyString; // 挂载全局自定义弹窗
		app.component('Feedback', Feedback)

	},
};
