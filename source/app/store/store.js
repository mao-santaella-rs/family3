import Vue from 'vue'
import Vuex from 'vuex'

import { firebaseApp, fbFirestore, fbAuthentication } from "../firebase/init";

Vue.use(Vuex)

export const store = new Vuex.Store({
	state: {
		firebase: firebaseApp,
		db: fbFirestore,
		auth: fbAuthentication,
		personas: null,
		family: null,
		session: {
			'login': null,
			'alias': null,
			'uid': null,
			'email': null
		},
		lines: {},
		panZoom: true
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
		},
		storePanZoom: (state,val) => {
			state.panZoom = val
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
		orderData: (context,databasePeople) => {
			// para llevar el conteo de las familias
			let familyCount = 1;
			// para saber cuales personas ya estan dentro del treeObject
			let usedPeople = {};
			// para saber cuales personas no entraron en las familias directas, solo entrarian los familiares no directos
			let nonUsedPeople = {};
			// json para guardar en vuex para generar el arbol
			let treeObject = {
				"familia": {
					"couple": []
				}
			};

			const lowestRow = databasePeople[Object.keys(databasePeople)[0]].row;

			// loop en todos los elementos como llegan de firebase
			for (var key in databasePeople) {
				
				// si es = a lowest row
				if (databasePeople[key].row == lowestRow) {
					agregarTreeObject(treeObject, "", key, true);
					usedPeople[key] = "familia";
				} else {
					// si encuentra mother en usados se guarda key en treeObject debajo de mother 
					if (findUsed(databasePeople[key].conections.mother)) {
						let mother = databasePeople[key].conections.mother;
						let newPath = usedPeople[mother] + ".relatives.familia" + (familyCount + 1);

						agregarTreeObject(treeObject, usedPeople[mother], key, "familia" + (familyCount + 1), true);
						usedPeople[key] = newPath;
					}
					// si encuentra father in usados se guarda key en treeObject debajo de father
					else if (findUsed(databasePeople[key].conections.father)) {
						let father = databasePeople[key].conections.father;
						let newPath = usedPeople[father] + ".relatives.familia" + (familyCount + 1);
						
						agregarTreeObject(treeObject, usedPeople[father], key, "familia" + (familyCount + 1), true);
						usedPeople[key] = newPath;
					}
					// else is a non direct relative
					else {
						nonUsedPeople[key] = null
					}
				}
			}
			// now find spots for the non direct relatives
			for (var key in nonUsedPeople) {
				if (findUsed(databasePeople[key].conections.spouse)) {
					let spouse = databasePeople[key].conections.spouse;

					agregarTreeObject(treeObject, usedPeople[spouse], key);
					usedPeople[key] = usedPeople[spouse];
				}
			}

			
			context.commit('storeFamiliaData', treeObject);
			console.log(nonUsedPeople)
			
			function findUsed(key) {
				let usados = Object.keys(usedPeople);
				let resultado = false;
				for (var i = 0; i < usados.length; i++) {
					if (usados[i] == key) {
						resultado = true;
					}
				}
				return resultado;
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
						familyCount = familyCount + 1;
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
		orderLinesData: (context, databasePeople) => {
			let objectL = {}
			for (let key in databasePeople){
				let personMom = databasePeople[key].conections.mother
				let personDad = databasePeople[key].conections.father
				// console.log(databasePeople[key].name)
				
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

								let userdatabasePeople = {
									'login': true,
									'alias': userP.alias,
									'uid': user.uid,
									'email': user.email
								}
								context.commit('storeSessionData', userdatabasePeople)

							});
						})
						.catch(error => {
							console.log("Error getting document:", error);
						});
					
				} else {
					// No user is signed in.
					let userdatabasePeople = {
						'login': false,
						'alias': null,
						'uid': null,
						'email': null
					}
					context.commit('storeSessionData', userdatabasePeople)
				}
			});
		},
		panZoomChange: (context, val) => {
			context.commit('storePanZoom',val)
		}
	},
	getters:{
		
	}

})