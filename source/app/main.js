import Vue from 'vue'
import router from './router'
import App from './App.vue'

import {store} from './store/store'


Vue.config.productionTip = false

new Vue({
	store:store,
	router,
	render: h => h(App)
}).$mount('#app')
