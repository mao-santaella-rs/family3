import Vue from 'vue'
import Vuex from 'vuex'

import { fbFirestore, fbStorage, fbAuthentication } from "../firebase/init";

Vue.use(Vuex)

export const store = new Vuex.Store({
	state: {
		db: fbFirestore,
		storage: fbStorage,
		auth: fbAuthentication,
		personas: null,
		family: null,
		session: {
			'login': null,
			'alias': null,
			'uid': null,
			'email': null
		},
		lines: {}
	},
	mutations: {
		storePersonasData: (state,val) => {
			state.personas = val
		},
		storeFamiliaData: (state, val) => {
			state.family = val
		},
		storeSessionData: (state, val) => {
			state.session = val
		},
		storeLinesData: (state, val) => {
			state.lines = val
		}
	},
	actions:{
		getData: context => {
			let dbObject = {};
			context.state.db.collection('people').orderBy("row").onSnapshot(snapshot => {
				snapshot.docChanges().forEach(change => {
					dbObject[change.doc.id] = change.doc.data()
				})
				context.commit('storePersonasData', dbObject)
				// context.commit('storePersonasNumData', Object.keys(dbObject).length)
				context.dispatch('orderData', dbObject)
				context.dispatch('orderLinesData', dbObject)
			})
		},
		orderData: (context,objectP) => {
			let flyCount = 1;
			let usedObject = {};
			let treObject = {
				"familia": {
					"couple": []
				}
			};

			const lowestRow = objectP[Object.keys(objectP)[0]].row;
			// console.log('lowestRow: ' + lowestRow);
			// const hiestRow = objectP[Object.keys(objectP)[Object.keys(objectP).length - 1]].row; 
			// console.log('hiestRow: ' + hiestRow);

			// loop en todos los elementos como llegan de firebase
			for (let key in objectP) {
				

				// si es = a lowest row
				if (objectP[key].row == lowestRow) {
					// console.log(objectP[key].name + " lowest ROW");

					agregarTreeObject(treObject, "", key, true);

					usedObject[key] = [];
					usedObject[key].push("familia");

				} else {
					// si encuentra mother en usados
					if (findUsed(objectP[key].conections.mother)) {
						let mother = objectP[key].conections.mother;
						// console.log(objectP[key].name + " MOTHER: " + objectP[mother].name);

						let newPath = usedObject[mother][0] + ".relatives.familia" + (flyCount + 1);
						agregarTreeObject(treObject, usedObject[mother][0], key, "familia" + (flyCount + 1), true);
						// agrego key a usados
						usedObject[key] = [];
						usedObject[key].push(newPath);
					}
					// si encuentra father in usados
					else if (findUsed(objectP[key].conections.father)) {
						let father = objectP[key].conections.father;
						// console.log(objectP[key].name + " FATHER: " + objectP[father].name);

						let newPath = usedObject[father][0] + ".relatives.familia" + (flyCount + 1);
						agregarTreeObject(treObject, usedObject[father][0], key, "familia" + (flyCount + 1), true);

						// agrego key a usados
						usedObject[key] = [];
						usedObject[key].push(newPath);
					}
				}
				consoleObj();
			}

			for (let key in objectP) {
				// console.log("***PERSONA C: " + objectP[key].name);
				if (!usedObject[key]) {
					// si encuentra spouse in usados
					if (findUsed(objectP[key].conections.spouse)) {
						let spouse = objectP[key].conections.spouse;
						// console.log(objectP[key].name + " SI encontre SPOUSE: " + objectP[spouse].name);

						agregarTreeObject(treObject, usedObject[spouse][0], key);
						usedObject[key] = [];
						usedObject[key].push(usedObject[spouse][0]);
					}
				}
			}

			consoleObj();
			// app.datos = treObject
			context.commit('storeFamiliaData', treObject);

			function consoleObj() {
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

			function returnKey(key) {
				for (var i in objectP) {
					if (objectP[i] == key) {
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

					if (parts[0] === "") {
						obj.familia.couple.push(key);
						return true;
					}
					// si relation es true(realtive)
					else if (relation) {
						let familyObj = parts[0];
						// console.log(obj[familyObj]);

						if (!obj[familyObj].relatives) {
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
		},
		orderLinesData: (context, objectP) => {
			let objectL = {}
			for (let key in objectP){
				let personMom = objectP[key].conections.mother
				let personDad = objectP[key].conections.father
				// console.log(objectP[key].name)
				
				if (personMom && personDad){
					// console.log("mom: " + personMom + " | dad: " + personDad)
					objectL[key] = "a" + personMom + personDad
				} else if (personMom) {
					// console.log("mom: " + personMom)
					objectL[key] = "a" + personMom
				} else if (personDad){
					// console.log("dad: " + personDad)
					objectL[key] = "a" + personDad
				} else {
					objectL[key] = null
				}				
			}
			// console.log(objectL)
			context.commit('storeLinesData', objectL)
		},
		sessionV: context => {
			context.state.auth.onAuthStateChanged( user => {
				if (user) {
					// User is signed in.
					// console.log(user)
					context.state.db.collection("users")
						.where("user_id", "==", user.uid)
						.get()
						.then(querySnapshot => {
							querySnapshot.forEach( doc => {
								let userP = doc.data();
								// console.log(doc.data());

								let userObjectP = {
									'login': true,
									'alias': userP.alias,
									'uid': user.uid,
									'email': user.email
								}
								context.commit('storeSessionData', userObjectP)

							});
						})
						.catch(error => {
							console.log("Error getting document:", error);
						});
					
				} else {
					// No user is signed in.
					let userObjectP = {
						'login': false,
						'alias': null,
						'uid': null,
						'email': null
					}
					context.commit('storeSessionData', userObjectP)
				}
			});
		}
	},
	getters:{
		
	}

})