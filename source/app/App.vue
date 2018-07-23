<template lang="pug">

	#app
		vHeader
		router-view
		vFamilyTree


</template>

<script>
import vHeader from './components/Header.vue'
import vFamilyTree from './components/FamilyTree.vue'
export default {
	name: "app",
	components: {
		vFamilyTree,vHeader
	},
	data(){
		return{
		}
	},
	created() {
		this.$store.dispatch('getData')
		this.$store.dispatch('sessionV')
	}
}
</script>

<style lang="sass">

</style>
