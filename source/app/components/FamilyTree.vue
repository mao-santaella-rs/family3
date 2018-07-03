<template lang="pug">
	.fmly-wrpr
		.line
		vfamilynode(:datos='datos',:personas="personas")
</template>

<script>
import db from "../firebase/init";
import vfamilynode from "./FamilyNode.vue";

export default {
	name: "vfamilytree",
	components: {
		vfamilynode
	},
	data() {
		return {
		};
	},
	computed: {
		datos(){
			return this.$store.state.family
		},
		personas(){
			return this.$store.state.personas
		}
	},
	methods: {},
	created() {},
	mounted() {}
};
</script>

<style lang="sass">

</style>
