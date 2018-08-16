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
		},
		personasLoad() {
			// let app = this
			// console.log("personas load")
      // if(app.$store.state.personasLoad == app.$store.state.personasNum){
			// 	console.log("cargaron todos")
			// 	// app.createLines()
			// }
    }
	},
	methods: {
		createLines(){

			let app = this
			// VARIABLES
			var fmly_wrpr = app.$el;
			// var fmly_wrpr = app.$el.querySelector('#fmly-wrpr');
			
			var $line = fmly_wrpr.querySelector('.line');
			// console.log($line);

			var svg_id = 'linea-1';
			var svg_width =	$line.offsetWidth;
			var svg_height = $line.offsetHeight;
			console.log(svg_width + '-' + svg_height);




			// var $svg = fnCreateSvg($line,svg_id,svg_width,svg_height);
			
			// var $person = fmly_wrpr.hasAttribute('mother');
			// console.log($person);
			// var $parents = findParents($person);
			
			// var coordenadas_parents = fnCoordenadas($parents);
			// var coordenadas_person = fnCoordenadas($person);
			
			// console.log(coordenadas_parents.left);
			
			// createLine($svg, coordenadas_person.left, coordenadas_person.top, coordenadas_parents.left, coordenadas_parents.top);

			// var $person = fmly_wrpr.querySelectorAll('.person');
			// console.log($person);
			
			// for (i = 0; i < $person.length; i++) {
			// 	var fp = $person[i];
			// 	var fparents = findParents(fp);
				
			// }



			// CREAR SVG EN EL DOM
			function fnCreateSvg(csctnr,csid,cswidth,csheight){
				var NS = "http://www.w3.org/2000/svg";
				var svg = document.createElementNS(NS, "svg");

				svg.setAttribute("id",csid);
				svg.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink");
				svg.setAttribute("viewBox", "0 0 " + cswidth + " " + csheight);
				
				csctnr.appendChild(svg);
				return svg
			}

			function findParents (el) {
				while ((el = el.parentNode) && !el.classList.contains('row'));
				while ((el = el.parentNode) && !el.classList.contains('fmly'));
				el = el.querySelector('.couple');
				el = el.querySelector('.ref');
				return el;
			}

			function fnCoordenadas(ref){
				var rect = ref.getBoundingClientRect();
				var cords = {};
				if (ref.classList.contains('person')){
					cords = {
						top: rect.top + document.body.scrollTop,
						left: rect.left + document.body.scrollLeft + (ref.offsetWidth / 2)
					};
				}else{
					cords = {
						top: rect.top + document.body.scrollTop + (ref.offsetHeight / 2),
						left: rect.left + document.body.scrollLeft + (ref.offsetWidth / 2)
					};
				};
				
				return cords;

			}

			// CREAR LINEA DENTRO DEL SVG
			function createLine(clctnr,clx1,cly1,clx2,cly2){
				var NS = "http://www.w3.org/2000/svg";
				var line = document.createElementNS(NS, "line");

				line.setAttribute("x1",clx1);
				line.setAttribute("y1",cly1);
				line.setAttribute("x2",clx2);
				line.setAttribute("y2",cly2);
				
				clctnr.appendChild(line);
			}


		},
		coordenadas(){
			// let referencia = this.$refs[Object.keys(this.personas)[0]]
			// console.log(referencia)
			
		}
	},
	created() {},
	mounted() {
		this.$nextTick(function () {
			// this.createLines()
			// this.personasLoad
			// this.coordenadas()
			// console.log(this.$refs);
			
			
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
