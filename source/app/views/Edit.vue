<template lang="pug">

	#edit
		vaddcontent
		vfamilytree

</template>

<script>
import vaddcontent from '../components/AddContent.vue'
import vfamilytree from '../components/FamilyTree.vue'

export default {
	name: 'edit',

	components: {
		vaddcontent,
		vfamilytree
	},

	data(){
		return{
		}
	}
}
</script>

<style lang="sass">

</style>