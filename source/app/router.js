import Vue from 'vue'
import Router from 'vue-router'
import LogIn from './components/auth/LogIn.vue'
import SignUp from './components/auth/SignUp.vue'
import AddContent from './components/AddContent.vue'
import EditContent from './components/EditContent.vue'


Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/login',
			name: 'login',
			component: LogIn

		},
		{
			path: '/signup',
			name: 'signup',
			component: SignUp

		},
		{
			path: '/add',
			name: 'add',
			component: AddContent
		},
		{
			path: '/edit/:id',
			name: 'edit',
			component: EditContent
		},
	]
})
