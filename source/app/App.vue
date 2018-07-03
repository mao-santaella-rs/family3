<template lang="pug">

	#app
		router-view

</template>

<script>
export default {
	name: 'app',
	data(){
		return{
		}
	},
	methods:{
	},
	created() {
		this.$store.dispatch('getData')
	}
}
</script>

<style lang="sass">

</style>
