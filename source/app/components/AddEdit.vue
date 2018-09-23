<template lang="pug">
#addedit
	h5.card-title(v-if="$route.name == 'edit'") Edit Relative
	h5.card-title(v-else) Add Relative
	.row

		.col-md-6
			.input-ctnr
				input#form-name(type='text',v-model="name")
				label(for='form-name') Name

		.col-md-6.input-ctnr
			.form-check.form-check-inline
				input#form-sex-m.form-check-input(type='radio', name='formsex', v-model="sex" ,value='m')
				label.form-check-label(for='form-sex-m') M
			.form-check.form-check-inline
				input#form-sex-f.form-check-input(type='radio', name='formsex', v-model="sex" ,value='f')
				label.form-check-label(for='form-sex-f') F
			.form-check.form-check-inline
				label.form-check-label Sex: 

		.col-md-6
			.input-ctnr
				input#form-nickname(type='text',v-model="nk_name")
				label(for='form-nickname') Nick Name

		.col-md-6
			.input-ctnr
				select#form-mother(v-model="mother")
					option(v-for="(person,key,index) in femenine", :key="key + index", :value="key") {{person.name}}
				label(for='form-mother') Mother

		.col-md-6
			.input-ctnr
				select#form-father(v-model="father")
					option(v-for="(person,key,index) in masculine", :key="key + index", :value="key") {{person.name}}
				label(for='form-father') Father
		
		.col-md-6
			.input-ctnr
				select#form-spouse(v-model="spouse")
					option(v-for="(person,key,index) in people", :key="index + key", :value="key") {{person.name}}
				label(for='form-spouse') Spouse

			//- .input-ctnr
				label(for='form-img') Image Url
				input#form-img(type='text',v-model="image")

		.col-md-6
			.input-ctnr
				
				.form-check.form-check-inline
					input#form-dead-q.form-check-input(type='checkbox', value='true', v-model="dead")
					label.form-check-label(for='form-dead-q') Deceased
				input#form-birth(type='date',v-model="b_day_p",placeholder="yyyy-mm-dd")
				label(for='form-birth') Birth Day
				

		.col-md-6
			.input-ctnr(v-if="dead")
				input#form-dead(type='date',v-model="d_day_p",placeholder="yyyy-mm-dd")
				label(for='form-dead') Deceased Date
		
		
		.col-md-6
			.input-ctnr
				textarea#form-bio(rows='7',v-model="bio")
				label(for='form-bio') Bio








		.col-md-6

			.image__selection
				.input-file
					label.input-file__label Select image
					input#my-file.input-file-input(type="file",@change="selectFile($event)")
					label.input-file-label(for="my-file") Select a file...
					p(v-if="selected_img").file-return <b>Selected file:</b><br>{{selected_img}}
					button(v-if="saveImgButton()", @click.prevent="processFile()") Save Image

				.new-image(:style="{'background-image': 'url(' + image +')'}")







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
			app_update: false,

			selected_img: null,
			image_saved: null,
			img_obj: null
	  };
	},
	watch: {
	},
	methods: {
		saveImgButton(){
			let app = this
			let people = app.people
			let routeId = app.$route.params.id
			let person = people[routeId]

			if (app.image_saved) {
				return false
			} else {
				return true
			}
		},
		selectFile(event){
			let app = this
			let file = event.target.files[0]
			app.selected_img = file.name

			var fr = new FileReader();

			fr.onload = function(e) { 
				console.log(e.target.result)
				app.image = e.target.result
				app.img_obj = file
			}

			fr.readAsDataURL(file)

		},
		processFile(){
			let app = this

			let storageRef = app.firebase.storage().ref()

			var imageRef = storageRef.child('photos/' + app.img_obj.name);

			let task = imageRef.put(app.img_obj)

			task.on('state_changed',																																				
				snapshot =>{
					var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					
					console.log('Upload is ' + progress + '% done');
				}, 
				error => {
					switch (error.code) {

						// User doesn't have permission to access the object
						case 'storage/unauthorized': break

						// User canceled the upload
						case 'storage/canceled': break

						// Unknown error occurred, inspect error.serverResponse
						case 'storage/unknown': break
				
					}
				},
				() => {
					// Upload completed successfully, now we can get the download URL
					task.snapshot.ref.getDownloadURL()
						.then( downloadURL => {
							console.log('File available at', downloadURL);
							app.image_saved = true
							app.image = downloadURL
						})
				})











			
		},
		stateValidation(){
			let app = this
			// if the computed property people is ready
			if (app.people) {
				// check if is already updated
				if(!app.app_update){					
					// If the route.name is edit and If there is an id in the route params
					if (app.$route.name == 'edit' && app.$route.params.id) {
						app.loadData()
					}
					// prevent re-update
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
			let routeId = app.$route.params.id
			let person = people[routeId]

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
			let routeId = app.$route.params.id
			let dbPersonas = app.people
			// console.log("update data");

			app.feedback = validacion()

			if(!validacion()){
				// console.log("ya esta validado");
				
				if(app.father != dbPersonas[routeId].conections.father){
					app.row = dbPersonas[app.father].row +1
				}
				if(app.mother != dbPersonas[routeId].conections.mother){
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

				app.dataBase.doc(routeId).update({
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
			let routeId = app.$route.params.id
			let dbPersonas = app.people
			// confirm troug confirm dialog
			var confirmation = confirm("Do you want to delete" + dbPersonas[routeId].name);
			if (confirmation) {
				app.dataBase.doc(routeId).delete()
					.then( () => {
						console.log("Document successfully deleted!");
						app.$store.dispatch('getData')
						app.$router.go(-1)
					}).catch( error => {
						console.error("Error removing document: ", error);
					});
			} else {
				app.feedBack = "You pressed Cancel!";
			}
		},
		addData(){
			let app = this
			app.feedback = null
			
			app.feedback = validacion()

			// if validation pass
			if(!validacion()){
				// asign de correct row
				if(app.father){
					app.row = app.$store.state.personas[app.father].row +1
				}
				if(app.mother){
					app.row = app.$store.state.personas[app.mother].row +1
				}
				// format de the timestamp for firestore
				if (app.b_day_p) {
					app.b_day = new Date(app.b_day_p + "T00:00:01.0Z")
				}
				if (app.d_day_p) {
					app.d_day = new Date(app.d_day_p + "T00:00:01.0Z")
				}

				// send data
				enviarDatos()
			}
			

			// functions
			// fn send data
			function enviarDatos(){
				app.dataBase.add({
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
			// fn validation
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
			return this.$store.state.db.collection("people")
		},
		firebase(){
			return this.$store.state.firebase
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
  // beforeRouteEnter (to, from, next) {
  //   // called before the route that renders this component is confirmed.
  //   // does NOT have access to `this` component instance,
	// 	// because it has not been created yet when this guard is called!
	// 	// next(vm => {
	// 	// 	// access to component instance via `vm`
	// 	// 	console.log(vm.$store.state.session.login);
			
	// 	// 	if (vm.$store.state.session.login) {
	// 	// 		next()
	// 	// 	} else {
	// 	// 		next("/m/login")
	// 	// 	}
	// 	// })
		
	// },
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

