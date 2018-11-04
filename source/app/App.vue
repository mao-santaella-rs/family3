<template lang="pug">

	#app.app
		vHeader
		router-view(v-if="people")
		vFamilyTree
		//- vFamilyTree(:style="{ transform: 'scale( 0.'+ zoom +')'}")
		//- .zoom
		//- 	input(type="range", min="100", max="999", value="999", v-model="zoom")


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
	methods:{},
	computed:{
		people(){
			return this.$store.state.personas
		}
	},
	created() {
		this.$store.dispatch('getData')
		this.$store.dispatch('sessionV')
	},
	mounted() {}
}
</script>

<style lang="sass">
</style>
