<template lang="pug">
#addcontent
	h5.card-title Editar Familiar
	.row.form
		.col-md-6.form-group
			label(for='form-name') Name
			input#form-name.form-control(type='text',v-model="name")
			.form-check.form-check-inline
				input#form-sex-m.form-check-input(type='radio', name='formsex', v-model="sex" ,value='m')
				label.form-check-label(for='form-sex-m') Masculine
			.form-check.form-check-inline
				input#form-sex-f.form-check-input(type='radio', name='formsex', v-model="sex" ,value='f')
				label.form-check-label(for='form-sex-f') Femenine
		.col-md-6.form-group
			label(for='form-nickname') Nick Name
			input#form-nickname.form-control(type='text',v-model="nk_name")
		.col-md-6.form-group
			label(for='form-mother') Mother
			select#form-mother.form-control(v-model="mother")
				option(v-for="(person,key,index) in femenine", :key="key + index", :value="key") {{person.name}}
		.col-md-6.form-group
			label(for='form-father') Father
			select#form-father.form-control(v-model="father")
				option(v-for="(person,key,index) in masculine", :key="key + index", :value="key") {{person.name}}
		.col-md-6.form-group
			label(for='form-spouse') Spouse
			select#form-spouse.form-control(v-model="spouse")
				option(v-for="(person,key,index) in people", :key="index + key", :value="key") {{person.name}}
		.col-md-6.form-group
			label(for='form-img') Image Url
			input#form-img.form-control(type='text',v-model="image")
		.col-md-6.form-group
			label(for='form-birth') Birth Day
			input#form-birth.form-control(type='date',v-model="b_day_p")
			.form-check.form-check-inline
				input#form-dead-q.form-check-input(type='checkbox', value='true', v-model="dead")
				label.form-check-label(for='form-dead-q') Deceased
		.col-md-6.form-group(v-if="dead")
			label(for='form-dead') Deceased Date
			input#form-dead.form-control(type='date',v-model="d_day_p")
		.col-md-6.form-group
			label(for='form-bio') Bio
			textarea#form-bio.form-control(rows='3',v-model="bio")
		.col-12.form-group(v-if="feedback")
			p(v-html="feedback")
		.col-12.form-group.form-action
			button.btn.btn-primary(@click.prevent="updateData()") Save

</template>

<script>
export default {
	name: "editContent",
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
		// '$route': (to,from) => {
		// 	this.loadData();
		// }
		b_day_p(){
			var rawDate = this.people[this.$route.params.id].dates.birth.seconds
			var dbDate = new Date()
			dbDate.setSeconds(rawDate)

			// console.log("dbTime = " + dateTransform(rawDate));
			// console.log("db date= " + rawDate);
			
			// var date = new Date(this.b_day_p)
			// var date = new Date(1987,4,20,0,0,1,0)
			var date = new Date("1987-04-20T00:00:01.0Z")
			// var date = new Date("20 Apr 1987 00:00:01 GMT")
			
			var dYear = date.getUTCFullYear()
			var dMonth = date.getUTCMonth()
			var dDay = date.getUTCDate()
			var dHours = date.getUTCHours()
			var dMinutes = date.getUTCMinutes()
			var dSeconds = date.getUTCSeconds()

			// console.log(date.toUTCString());
			
			// console.log("date = " + dYear + " " + dMonth + " "  + dDay + " "  + dHours + " "  + dMinutes + " "  + dSeconds + " " );
			
			function dateTransform(timestamp){
				var a = new Date(0)
				a.setUTCSeconds(timestamp)
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
				return time				
			}
		}
	},
	methods: {
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
			let dbPersonas = app.$store.state.personas
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
				
				app.$store.state.db.collection("people").doc(personId).update({
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
		}
	},
	computed:{
		masculine(){
			return this.$store.state.masculine
		},
		femenine(){
			return this.$store.state.femenine
		},
		people(){
			return this.$store.state.personas
		}
	},
	created() {
		console.log("created")
		if (this.people) {
			this.loadData()
			this.app_update = true
		}
		console.log("-------")
	},
	updated() {
		let app = this
		if (!app.app_update) {
			
			console.log("updated")
			app.loadData()
			app.app_update = true
			console.log("-------")

		}
		
	},
	// beforeRouteEnter (to, from, next) {
  //   // react to route changes...
	// 	// don't forget to call next()
	// 	console.log("beforeRouteEnter")
	// 	next(vm => {
	// 		// access to component instance via `vm`
	// 		vm.loadData()
	// 	})
	// 	console.log("-------")
		
  // },
	beforeRouteUpdate (to, from, next) {
    // react to route changes...
		// don't forget to call next()
		next()
		console.log("beforeRouteUpdate")
		this.loadData()
		console.log("-------")
  }
	
}
</script>

<style lang="sass" scoped>

</style>

