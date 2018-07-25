<template lang="pug">
	#addcontent
		.container
			.row.justify-content-center
				.col-9
					.card
						.card-header
							h5.card-title Editar Familiar
						.card-body
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
		  feedback_text: null
	  };
	},
	watch: {
		// '$route': (to,from) => {
		// 	this.loadData();
		// }
	},
	methods: {
		loadData(){
			let app = this
			let people = app.people
			let personId = app.$route.params.id
			let person = people[personId]
			console.log(personId)
			console.log(person)

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
			}
			// console.log("dead: " + person.dates.dead)
			if(person.dates.dead){
				app.d_day_p = dateTransform(person.dates.dead)
				app.dead = true
			}
			
			function dateTransform(timestamp){
				var a = new Date(0)
				a.setSeconds(timestamp.seconds)
				var year = a.getFullYear()
				var month = a.getMonth() + 1
				if(month < 10){
					month = "0" + month
				}
				var date = a.getDate()
				if(date < 10){
					date = "0" + date
				}
				var time = year + '-' + month + '-' + date 
				return time;
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
	},
	updated() {
		console.log("updated")
		this.loadData()
		console.log("-------")
	},
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
.card-title
	margin: 0

.form-group
	&:last-child
		margin: 0

.form-action
	display: flex
	justify-content: flex-end

.container
	margin-top: 50px

.row
	padding-top: 0
</style>

