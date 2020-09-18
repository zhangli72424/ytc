import Vue from 'vue'
import App from './App'
import store from './store/index'
import i18n from './lang/index'
import uView from "uview-ui";

Vue.use(uView);
Vue.prototype.$store = store;
Vue.prototype._i18n = i18n;
Vue.config.productionTip = false
App.mpType = 'app'
Vue.filter('formatParsefloat', val => {
	if ((!val && val != 0) || val == null || val == undefined || val == 'undefined') {
		return 0
	}
	return parseFloat(val)
})
const app = new Vue({
	i18n,
	store,
    ...App
})
app.$mount()
