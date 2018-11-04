<template lang="pug">
	header.header
		.header__logo
			img(src="img/logo-l.svg", alt="")
		.header__user
			.header__user-txt(v-if="session.login")
				span {{session.alias}}
			.header__user__action(v-if="session.login")
				a(href,@click.prevent="signOut()").lnk log Out
			.header__user__action(v-if="!session.login")
				router-link(:to="{name: 'login'}").lnk log In
</template>

<script>
export default {
	name: 'Header',
	data(){
		return {
			
		}
	},
	methods:{
		signOut(){
			this.auth.signOut().then(function() {
				// Sign-out successful.
			}).catch(function(error) {
				// An error happened.
			});
		}
	},
	computed:{
		session(){
			return this.$store.state.session
		},
		auth(){
			return this.$store.state.auth
		}
	}
}
</script>

<style lang="sass">

</style>
