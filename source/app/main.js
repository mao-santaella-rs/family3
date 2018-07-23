import Vue from 'vue'
import router from './router'
import {store} from './store/store'

import App from './App.vue'

Vue.config.productionTip = false

let app = null

// espera a que firebase.auth se cargue para que cargue la aplicacion
firebase.auth().onAuthStateChanged(() => {
	if (!app) {
		app = new Vue({
			store,
			router,
			render: h => h(App)
		}).$mount('#app')
	}
})


