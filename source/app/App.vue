<template lang="pug">

	#app.app
		Header
		router-view(v-if="people")
		FamilyTree(ref="fmlyt")
		.control-panel
			//- a(@click.prevent="stopScroll()",title="cancel scroll").btn--control
			//- 	img(src="img/icons/scroll-icon.svg")
			a(@click.prevent="centerPanZoom()",title="center tree").btn--control
				img(src="img/icons/center-icon.svg")


</template>

<script>
import Header from './components/Header.vue'
import FamilyTree from './components/FamilyTree.vue'
export default {
	name: "app",
	components: {
		FamilyTree,Header
	},
	data(){
		return{
		}
	},
	methods:{
		centerPanZoom() {
    	this.$refs.fmlyt.centerPanZoom()
    },
		stopScroll() {
    	this.$refs.fmlyt.stopScroll()
    }
	},
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
