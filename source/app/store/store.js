import Vue from 'vue'
import Vuex from 'vuex'

import db from "../firebase/init";

Vue.use(Vuex)

export const store = new Vuex.Store({
	state: {
		db: db,
		people: []
	},
	mutations: {
		storeData: (state,val) => {
			state.people = val
		}
	},
	actions:{
		getData: context => {
			const app = this;
			let dbObject = {};
			context.state.db.collection('people').orderBy("row").onSnapshot(snapshot => {
				snapshot.forEach(doc => {
					dbObject[doc.id] = doc.data();
				});
				context.commit('storeData', dbObject);
			});
		}
	}

})