import Vue from 'vue'
import Router from 'vue-router'
import LogIn from './components/auth/LogIn.vue'
import SignUp from './components/auth/SignUp.vue'
import Modal from './components/Modal.vue'
import AddEdit from './components/AddEdit.vue'


Vue.use(Router)
	
export default new Router({
	routes: [
		{
			path: '/m',
			
			component: Modal,
			children: [
				{ 
					path: 'login',
					name: 'login',
					component: LogIn
				},
				{
					path: 'signup',
					name: 'signup',
					component: SignUp
				},
				{
					path: 'add',
					name: 'add',
					component: AddEdit
				},
				{
					path: 'edit/:id',
					name: 'edit',
					component: AddEdit
				}
			]
		},
	]
})
