<template lang="pug">
	.fmly-wrpr
		#line.line

		FamilyNode(
			v-if="datos"
			:datos='datos'
			:personas="personas"
			@centerPanZoom="centerPanZoom()"
		)
		
		
</template>

<script>
import FamilyNode from "./FamilyNode.vue";
import { isLoop } from 'babel-types';

export default {
	name: "FamilyTree",
	components: {
		FamilyNode
	},
	data() {
		return {
			paneoZoom: null,
			paneoZoomActive: false,
			initialPanZoom: null
		};
	},
	watch: {
		storePanZoom(){
			if (this.storePanZoom) {
				this.resumePanZoom()
				// console.log("store change resume panZoom");
				
			} else {
				this.pausePanZoom()
				// console.log("store change pause panZoom");
			}
		}
	},

	computed: {
		datos(){
			return this.$store.state.family
		},
		personas(){
			return this.$store.state.personas
		},
		storePanZoom(){
			return this.$store.state.panZoom
		}
	},
	methods: {
		centerPanZoom(){
			let app = this
			const $fmly_wrpr = document.querySelector('.fmly-wrpr')
			app.paneoZoom.centerOn($fmly_wrpr,"x")
		},
		resumePanZoom(){
			let app = this
			app.paneoZoom.resume()
			app.paneoZoom.moveTo(
				app.initialPanZoom.x,
				app.initialPanZoom.y
			)
			app.paneoZoom.zoomAbs(
				app.initialPanZoom.x,
				app.initialPanZoom.y,
				app.initialPanZoom.scale
			)
		},
		pausePanZoom(){
			let app = this
			let transform = app.paneoZoom.getTransform()
			app.initialPanZoom = {
				x: transform.x,
				y: transform.y,
				scale: transform.scale
			}
			// console.log(app.initialPanZoom)
			app.paneoZoom.pause()
			app.paneoZoom.moveTo(0,0)
			app.paneoZoom.zoomAbs(0,0,1)
			// console.log(app.paneoZoom)
			// console.log("is paused")
		},
		panZoom(){
			let app = this
			const $fmly_wrpr = document.querySelector('.fmly-wrpr')
			
			app.paneoZoom = panzoom($fmly_wrpr , {
				maxZoom: 1,
				minZoom: 0.1
			})
			// console.log("panZoom")
		}
	},
	created() {},
	mounted() {
		let app = this
		// pan and zoom activation
		app.panZoom()
		app.initialPanZoom = app.paneoZoom.getTransform()
		
		// app.$nextTick(function () {

		// })
	},
	beforeUpdate() {
	},
	updated() {
		
	},
	beforeDestroy() {
		this.paneoZoom.dispose()
	},
};
</script>

<style lang="sass">
// // BOURBON
@import "../../../node_modules/bourbon/core/bourbon"
// TIPOGRAFIAS
// @import "../../_includes/sass/1-tools/fonts"
// VARIABLES
// @import "../../_includes/sass/1-tools/vars"
// MIXINS PROPIOS
// @import "../../_includes/sass/1-tools/mixins"
// MODULES
// @import "../../_includes/sass/3-modules/family-tree"

.maoma
	+position(absolute,150px null null 150px)
</style>
