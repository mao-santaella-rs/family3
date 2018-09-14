<template lang="pug">

#signup
	h5.card-title Registro
	.form
		.form-group
			label(for='form-user') User
			input#form-user.form-control(type='email',v-model="user")
		.form-group
			label(for='form-password') Password
			input#form-password.form-control(type='password',v-model="password")
		.form-group
			label(for='form-alias') Alias
			input#form-alias.form-control(type='text',v-model="alias")
		.form-group(v-if="feedback_text")
			p {{feedback_text}}
		.form-group.form-action
			button.btn.btn-primary(@click="signup") Registrar

</template>

<script>
export default {
	name: 'Signup',	
	data() {
		return {
			user: null,
			password: null,
			alias: null,
			feedback_text: null,
			slug: null
		}
	},
	methods:{
		signup(){
			let app = this;
			let db = this.$store.state.db;
			app.feedback_text = null

			if (app.alias && app.user && app.password) {
				app.slug = slugify(app.alias);
				let ref = db.collection('users').doc(app.slug)
				ref.get().then(doc => {
					console.log(doc)
					if (doc.exists) {
						app.feedback_text = "el usuario ya existe";
					} else {
						// app.feedback_text = "el usuario esta disponible";
						firebase.auth().createUserWithEmailAndPassword(app.user,app.password)
							.then(cred => {
								console.log(cred.user)
								ref.set({
									alias: app.alias,
									user_id: cred.user.uid
								})
							}).then(() => {
								// app.$router.push({path: '/'})
								
								app.$router.go(-1)
							})
							.catch(err => {
								console.log(err)
								app.feedback_text = err.message
							})
					}
				})
				console.log(app.slug)
			}else{
				app.feedback_text = "hay que entrar un alias"
			}

			// in functions
			function slugify(text){
				return text.toString().toLowerCase()
					.replace(/\s+/g, '-')				// Replace spaces with -
					.replace(/[^\w\-]+/g, '')   // Remove all non-word chars
					.replace(/\-\-+/g, '-')     // Replace multiple - with single -
					.replace(/^-+/, '')         // Trim - from start of text
					.replace(/-+$/, '');        // Trim - from end of text
			}
		}
	}
	
}
</script>

<style lang="sass">

</style>
