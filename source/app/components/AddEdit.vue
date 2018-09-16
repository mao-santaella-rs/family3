<template lang="pug">
#addedit
	h5.card-title(v-if="$route.name == 'edit'") Edit Relative
	h5.card-title(v-else) Add Relative
	.row
		.col-md-6
			label(for='form-name') Name
			input#form-name(type='text',v-model="name")
			.form-check.form-check-inline
				input#form-sex-m.form-check-input(type='radio', name='formsex', v-model="sex" ,value='m')
				label.form-check-label(for='form-sex-m') Masculine
			.form-check.form-check-inline
				input#form-sex-f.form-check-input(type='radio', name='formsex', v-model="sex" ,value='f')
				label.form-check-label(for='form-sex-f') Femenine
		.col-md-6
			label(for='form-nickname') Nick Name
			input#form-nickname(type='text',v-model="nk_name")
		.col-md-6
			label(for='form-mother') Mother
			select#form-mother(v-model="mother")
				option(v-for="(person,key,index) in femenine", :key="key + index", :value="key") {{person.name}}
		.col-md-6
			label(for='form-father') Father
			select#form-father(v-model="father")
				option(v-for="(person,key,index) in masculine", :key="key + index", :value="key") {{person.name}}
		.col-md-6
			label(for='form-spouse') Spouse
			select#form-spouse(v-model="spouse")
				option(v-for="(person,key,index) in people", :key="index + key", :value="key") {{person.name}}
		.col-md-6
			label(for='form-img') Image Url
			input#form-img(type='text',v-model="image")
		.col-md-6
			label(for='form-birth') Birth Day
			input#form-birth(type='date',v-model="b_day_p",placeholder="yyyy-mm-dd")
			.form-check.form-check-inline
				input#form-dead-q.form-check-input(type='checkbox', value='true', v-model="dead")
				label.form-check-label(for='form-dead-q') Deceased
		.col-md-6(v-if="dead")
			label(for='form-dead') Deceased Date
			input#form-dead(type='date',v-model="d_day_p",placeholder="yyyy-mm-dd")
		.col-md-6
			label(for='form-bio') Bio
			textarea#form-bio(rows='3',v-model="bio")
		.col-12(v-if="feedback")
			p(v-html="feedback")
		.col-12.form-action
			button(v-if="$route.name == 'edit'", @click.prevent="updateData()") Update
			button(v-else, @click.prevent="addData()") Add
			a(@click.prevent="deleteData()",href, v-if="$route.name == 'edit'", title="Delete").lnk.lnk-delete Delete

</template>

<script>
export default {
	name: "AddEdit",
	data() {
	  return {
		  name: null,
		  nk_name: null,
		  sex: null,
		  mother: null,
		  father: null,
		  spouse: null,
		  image: null,
		  d_day: null,
		  d_day_p: null,
		  b_day: null,
		  b_day_p: null,
		  bio: null,
		  row: null,
		  dead: false,
		  feedback: false,
			feedback_text: null,
			app_update: false
	  };
	},
	watch: {
	},
	methods: {
		stateValidation(){
			let app = this
			console.log(app.$route.name);
			// if the computed property people is ready
			if (app.people) {
				// check if is already updated
				if(!app.app_update){					
					// If the route.name is edit and If there is an id in the route params
					if (app.$route.name == 'edit' && app.$route.params.id) {
						app.loadData()
					}
					app.app_update = true
				}
			}
		},
		genderSel(gender){
			let app = this
			let people = app.people
			let objP = {}
			for(var key in people) {
				if(people.hasOwnProperty(key)) {
					if (people[key].sex == gender) {
						objP[key] = app.people[key]
					}
				}
			}
			return objP
		},
		loadData(){
			let app = this
			let people = app.people
			let personId = app.$route.params.id
			let person = people[personId]

			app.name = person.name
			app.nk_name = person.nickname
			app.sex = person.sex
			app.mother = person.conections.mother
			app.father = person.conections.father
			app.spouse = person.conections.spouse
			app.image = person.img
			
			app.bio = person.bio
			app.row = person.row

			if(person.dates.birth) {
				app.b_day_p = dateTransform(person.dates.birth)
			}else{
				app.b_day_p = ""
			}
			
			// console.log("dead: " + person.dates.dead)
			if(person.dates.dead){
				app.d_day_p = dateTransform(person.dates.dead)
				app.dead = true
			}else{
				app.dead = false
			}
			
			function dateTransform(timestamp){
				var a = new Date(0)
				a.setUTCSeconds(timestamp.seconds)
				var year = a.getUTCFullYear()
				var month = a.getUTCMonth() + 1
				if(month < 10){
					month = "0" + month
				}
				var date = a.getUTCDate()
				if(date < 10){
					date = "0" + date
				}
				var time = year + '-' + month + '-' + date
				return time;
			}
			
		},
		updateData(){
			let app = this
			let personId = app.$route.params.id
			let dbPersonas = app.people
			// console.log("update data");

			app.feedback = validacion()

			if(!validacion()){
				// console.log("ya esta validado");
				
				if(app.father != dbPersonas[personId].conections.father){
					app.row = dbPersonas[app.father].row +1
				}
				if(app.mother != dbPersonas[personId].conections.mother){
					app.row = dbPersonas[app.mother].row +1
				}
				if (app.b_day_p) {
					app.b_day = new Date(app.b_day_p + "T00:00:01.0Z")
				}
				if (app.d_day_p) {
					app.d_day = new Date(app.d_day_p + "T00:00:01.0Z")
				}

				actualizarDatos()
			}

			function actualizarDatos(){
				console.log("actualizando datos");
				console.log(app.b_day);
				
				app.dataBase.collection("people").doc(personId).update({
					name: app.name,
					nickname: app.nk_name,
					row: app.row,
					sex: app.sex,
					bio: app.bio,
					img: app.image,
					conections:{
						father: app.father,
						mother: app.mother,
						spouse: app.spouse
					},
					dates:{
						birth: app.b_day,
						dead: app.d_day
					}
				})
					.then(function(docRef) {
						console.log("Se guardo Correctamente")
						app.$router.go(-1)
					})
					.catch(function(error) {
						console.error("Error adding document: ", error);
					});
			}

			function validacion(){
				let feedBack = ""
				if(!app.name){
					feedBack = "El nombre es un campo obligatorio<br>"
				}
				if(!app.nk_name){
					feedBack = feedBack + "El apodo es un campo obligatorio<br>"
				}
				if(feedBack == ""){
					feedBack = null
				}
				return feedBack
			}
		},
		deleteData(){
			let app = this
			let personId = app.$route.params.id
			let dbPersonas = app.people
			var confirmation = confirm("Do you want to delete" + dbPersonas[personId].name);
			if (confirmation) {
				app.dataBase.collection("people").doc(personId).delete()
					.then( () => {
						console.log("Document successfully deleted!");
						app.$store.dispatch('getData')
						app.$router.go(-1)
					}).catch( error => {
						console.error("Error removing document: ", error);
					});
			} else {
				txt = "You pressed Cancel!";
			}
		},
		addData(){
			let app = this
			app.feedback = null
			
			app.feedback = validacion()

			if(!validacion()){
				if(app.father){
					app.row = app.$store.state.personas[app.father].row +1
				}
				if(app.mother){
					app.row = app.$store.state.personas[app.mother].row +1
				}
				if (app.b_day_p) {
					app.b_day = new Date(app.b_day_p + "T00:00:01.0Z")
				}
				if (app.d_day_p) {
					app.d_day = new Date(app.d_day_p + "T00:00:01.0Z")
				}

				enviarDatos()
			}
			

			// functions

			function enviarDatos(){
				app.dataBase.collection("people").add({
					name: app.name,
					nickname: app.nk_name,
					row: app.row,
					sex: app.sex,
					bio: app.bio,
					img: app.image,
					conections:{
						father: app.father,
						mother: app.mother,
						spouse: app.spouse
					},
					dates:{
						birth: app.b_day,
						dead: app.d_day
					}
				})
					.then(function(docRef) {
						console.log("Document written with ID: ", docRef.id)
						app.$router.go(-1)
					})
					.catch(function(error) {
						console.error("Error adding document: ", error)
					});
			}

			function validacion(){
				let feedBack = ""
				if(!app.name){
					feedBack = "El nombre es un campo obligatorio<br>"
				}
				if(!app.nk_name){
					feedBack = feedBack + "El apodo es un campo obligatorio<br>"
				}
				if(!app.sex){
					feedBack = feedBack + "El sexo es un campo obligatorio<br>"
				}
				if(!app.father && !app.mother){
					feedBack = feedBack + "Seleccione uno de los padres<br>"
				}
				if(feedBack == ""){
					feedBack = null
				}
				return feedBack
			}
		}
	},
	computed:{

		people(){
			return this.$store.state.personas
		},
		masculine(){
			return this.genderSel("m")
		},
		femenine(){
			return this.genderSel("f")
		},
		dataBase(){
			return this.$store.state.db
		}
	},
	created() {
		console.log("created")
		this.stateValidation()
		console.log("-------")
	},
	updated() {
		console.log("updated")
		this.stateValidation()
		console.log("-------")
	},
	beforeRouteUpdate (to, from, next) {
    // react to route changes...
		// don't forget to call next()
		next()
		console.log("beforeRouteUpdate")
		this.stateValidation()
		console.log("-------")
  }
	
}
</script>

<style lang="sass">

</style>

