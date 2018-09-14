<template lang="pug">
#addcontent
	h5 Agregar Familiar
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
			button.btn.btn-primary(@click.prevent="saveData()") Save

</template>

<script>
export default {
	name: "addContent",
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
		  feedback_text: null
	  };
	},
	methods: {
		saveData(){
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
					app.b_day = new Date(app.b_day_p)
				}
				if (app.d_day_p) {
					app.d_day = new Date(app.d_day_p)
				}

				enviarDatos()
			}
			

			// functions

			function enviarDatos(){
				app.$store.state.db.collection("people").add({
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
	created() {},
	mounted() {}
	
}
</script>

<style lang="sass" scoped>
// .card-title
// 	margin: 0

// .form-group
// 	&:last-child
// 		margin: 0

// .form-action
// 	display: flex
// 	justify-content: flex-end

// .container
// 	margin-top: 50px

// .row
// 	padding-top: 0
</style>

