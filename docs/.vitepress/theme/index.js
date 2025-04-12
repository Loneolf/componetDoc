// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import DefaultTheme from "vitepress/theme";
import Big from 'big.js';

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 表格，解析数据使用，以表格的形式使用
import VxeUITable from 'vxe-table'
import 'vxe-table/lib/style.css'

// 注册状态管理store
import store from '../../vueCom/store/index'

// 一些全局方法，也在此注册，任何页面均可直接使用
import { copyString, zget } from '../../common/util'

// 在导航栏直接使用组件，需要注册为全局组件，Feedback 为反馈组件
import Feedback from "../../vueCom/Feedback.vue";
import "./style.css";
import "./toolsPage.less"

// 精度数值加减库，注册为全局可使用
if (typeof window !== 'undefined') {
	window.Big = Big;
	window.zget = zget;
	window.copyString = copyString;
}

/** @type {import('vitepress').Theme} */
export default {
	extends: DefaultTheme,
	Layout: () => {
		return h(DefaultTheme.Layout, null, {});
	},
	enhanceApp({ app, router, siteData }) {
		app.use(ElementPlus)
		.use(VxeUITable)
		.use(store)
		app.config.globalProperties.$copyString = copyString; // 挂载全局自定义方法
		app.component('Feedback', Feedback)

	},
};
