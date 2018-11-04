<template lang="pug">
	.fmly-wrpr
		#line.line
		.maoma
			//- a(href,@click.prevent="pausePanZoom()") CANCEL
			//- a(href,@click.prevent="resumePanZoom()") RESUME
		FamilyNode(
			v-if="datos"
			:datos='datos'
			:personas="personas"
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
				console.log("store change resume panZoom");
				
			} else {
				this.pausePanZoom()
				console.log("store change pause panZoom");
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
			console.log(app.initialPanZoom)
			app.paneoZoom.pause()
			app.paneoZoom.moveTo(0,0)
			app.paneoZoom.zoomAbs(0,0,1)
			console.log(app.paneoZoom)
			console.log("is paused")
		},
		panZoom(){
			let app = this
			const $fmly_wrpr = document.querySelector('.fmly-wrpr')
			
			app.paneoZoom = panzoom($fmly_wrpr , {
				filterKey: function(/* e, dx, dy, dz */) {
					// don't let panzoom handle this event:
					return true;
				},
				maxZoom: 1,
				minZoom: 0.1
			})
			console.log("panZoom")			
		}
	},
	created() {},
	mounted() {
		// pan and zoom activation
		this.panZoom()
		this.initialPanZoom = this.paneoZoom.getTransform()
	},
	beforeUpdate() {
		// this.pausePanZoom()
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
