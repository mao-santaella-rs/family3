<template lang="pug">
#login
	h5.card-title Ingresar
	.form
		.form-group
			label(for='form-user') User
			input#form-user.form-control(type='text',v-model="user")
		.form-group
			label(for='form-password') Password
			input#form-password.form-control(type='password',v-model="password")
		.form-group(v-if="feedback_text")
			p {{feedback_text}}
		.form-group.form-action
			button.btn.btn-primary(@click.prevent="login()") Ingresar
</template>

<script>
export default {
	name: 'LogIn',	
	data() {
		return {
			user: null,
			password: null,
			feedback_text: null
		}
	},
	methods:{
		login(){
			let app = this;
			if(app.user && app.password){
				firebase.auth().signInWithEmailAndPassword(app.user, app.password)
				.then(()=>{
					app.$router.push({ path: '/' })
				})
				.catch(function(error) {
					// Handle Errors here.
					var errorCode = error.code;
					var errorMessage = error.message;
					// ...
				});
			}else{
				if(app.user){
					
				}
			}
		}
	}
	
	
}
</script>

<style lang="sass">
</style>