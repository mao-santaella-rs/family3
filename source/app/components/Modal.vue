<template lang="pug">
#modal.modal
	router-link(to="/").modal__background
	//- a(@click.prevent="$router.go(-1)").modal__background
	.modal__window
		router-link(to="/").modal__close
			img(src="img/icons/cancel.svg")
		//- a(@click.prevent="$router.go(-1)").modal__close
			img(src="img/icons/cancel.svg")
		.modal__content
			router-view
</template>

<script>
export default {
	name: 'Modal',	
	data() {
		return {
		}
	},
	methods:{
	}
}
</script>

<style lang="sass">
</style>