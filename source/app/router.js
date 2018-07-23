import Vue from 'vue'
import Router from 'vue-router'
import LogIn from './components/auth/LogIn.vue'
import SignUp from './components/auth/SignUp.vue'
import AddContent from './components/AddContent.vue'


Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/edit',
			name: 'edit',
			component: AddContent
		},
		{
			path: '/login',
			name: 'login',
			component: LogIn

		},
		{
			path: '/signup',
			name: 'signup',
			component: SignUp

		}
	]
})
