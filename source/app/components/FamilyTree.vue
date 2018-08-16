<template lang="pug">
	.fmly-wrpr(ref="fmly-wrpr")
		#line.line
		vfamilynode(v-if="datos",:datos='datos',:personas="personas")
</template>

<script>
import vfamilynode from "./FamilyNode.vue";

export default {
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
	mounted() {
		this.$nextTick(function () {
  	})
	}
};
</script>

<style lang="sass">
// // BOURBON
// @import "../../../node_modules/bourbon/core/bourbon"
// // TIPOGRAFIAS
// @import "../../_includes/sass/1-tools/fonts"
// // VARIABLES
// @import "../../_includes/sass/1-tools/vars"
// // MIXINS PROPIOS
// @import "../../_includes/sass/1-tools/mixins"
// // MODULES
// @import "../../_includes/sass/3-modules/family-tree"
</style>
