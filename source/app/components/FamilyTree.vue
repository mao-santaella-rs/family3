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
			datos: {},
			personas: []
		};
	},
	watch: {},
	methods: {
		getData() {
			const app = this;
			let dbObject = [];
			db.collection('people').orderBy("row").onSnapshot(snapshot => {
				snapshot.forEach(doc => {
					dbObject[doc.id] = doc.data();
				});
				app.personas = dbObject;
				// console.log(dbObject);
				app.orderData()
			});
		},
		
		orderData() {
			console.clear();
			const app = this;
			let flyCount = 1;
			let usedObject = {};
			let treObject = {
				"familia": {
					"couple": []
				}
			};

			const lowestRow = app.personas[Object.keys(app.personas)[0]].row;
			// console.log(lowestRow);

			for (let key in app.personas) {
				// console.log("***PERSONA MF: " + app.personas[key].name);
				// si es = a lowest row
				if(app.personas[key].row == lowestRow) {
					// console.log(app.personas[key].name + " lowest ROW");
					
					agregarTreeObject(treObject, "", key, true);

					usedObject[key] = [];
					usedObject[key].push("familia");
					
				} else {
					// si encuentra mother en usados
					if (findUsed(app.personas[key].conections.mother)) {
						let mother = app.personas[key].conections.mother;
						// console.log(app.personas[key].name + " MOTHER: " + app.personas[mother].name);
						
						let newPath = usedObject[mother][0] + ".relatives.familia" + (flyCount + 1);
						agregarTreeObject(treObject, usedObject[mother][0], key, "familia" + (flyCount + 1), true);
						// agrego key a usados
						usedObject[key] = [];
						usedObject[key].push(newPath);
					} 
					// si encuentra father in usados
					else if (findUsed(app.personas[key].conections.father)) {
						let father = app.personas[key].conections.father;
						// console.log(app.personas[key].name + " FATHER: " + app.personas[father].name);
						
						let newPath = usedObject[father][0] + ".relatives.familia" + (flyCount + 1);
						agregarTreeObject(treObject, usedObject[father][0], key, "familia" + (flyCount + 1), true);
						
						// agrego key a usados
						usedObject[key] = [];
						usedObject[key].push(newPath);
					}
				}
				consoleObj();
			}

			for (let key in app.personas) {
				// console.log("***PERSONA C: " + app.personas[key].name);
				if (!usedObject[key]) {
					// si encuentra spouse in usados
					if (findUsed(app.personas[key].conections.spouse)) {
						let spouse = app.personas[key].conections.spouse;
						// console.log(app.personas[key].name + " SI encontre SPOUSE: " + app.personas[spouse].name);
						
						agregarTreeObject(treObject, usedObject[spouse][0], key);
						usedObject[key] = [];
						usedObject[key].push(usedObject[spouse][0]);
					}
				}
			}

			consoleObj();
			app.datos = treObject
			
			function consoleObj(){
				// console.log("usedObject");
				// console.log(usedObject);
				// console.log("treeObject");
				// console.log(treObject);
			}

			function findUsed(key) {
				let usados = Object.keys(usedObject);
				let resultado = false;
				for (var i = 0; i < usados.length; i++) {
					if (usados[i] == key) {
						resultado = true;
					}
				}
				return resultado;
			}
			
			function returnKey(key){
				for(var i in app.personas) {
					if (app.personas[i] == key){
						return i;
					}
				}
				return false;
			}

			function agregarTreeObject(obj, path, key, familyId = false, relation = false) {
				//separa el string en un array
				// console.log("path: " + path);
				let parts = path.split(".");
				// console.log(parts);
				
				// si el array tiene un solo valor
				if (parts.length == 1) {
					
					if(parts[0] === ""){
						obj.familia.couple.push(key);
						return true;
					}
					// si relation es true(realtive)
					else if(relation){
						let familyObj = parts[0];
						// console.log(obj[familyObj]);
						
						if(!obj[familyObj].relatives){
							// creo una propiedad 'relatives' en el objeto provisional
							obj[familyObj].relatives = {};
						}
						//dentro de 'relatives' creo una propiedad 'family#' basada en el counter
						obj[familyObj].relatives[familyId] = {};
						// dentro de 'family#' creo una propiedad 'couple' como array
						obj[familyObj].relatives[familyId].couple = [];
						// y le agrego a 'couple' el key
						obj[familyObj].relatives[familyId].couple.push(key);
						// ahora le sumo 1 a el caunter para el nombre de la familia
						flyCount = flyCount + 1;
						// retorno para que pare la funcion
						return true;
					} 
					// si relation es false(couple)
					else {
						// al path le agrego el key al 'couple' al que pertenece. la pareja ya debe estar en el objProvicional
						obj[parts[0]].couple.push(key);
						// retorno para que pare la funcion
						return true;
					}
				}
				// si 'path' tiene mas de un item se reinicia la misma funcion con un item menos pero con el objeto dentro de un nivel mas
				return agregarTreeObject(obj[parts[0]], parts.slice(1).join("."), key, familyId, relation);
			}

		}
	},
	created() {
		this.getData()
	},
	mounted() {
		// this.orderData()
	}
};
</script>

<style lang="sass">

</style>
