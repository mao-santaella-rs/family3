<template lang="pug">
	.row
		.fmly(v-if='datos', v-for='family in datos')
			.couple
				.ref
				.person(v-for='(person,index) in family.couple', :key='person+index')
					.person-item
						.person-item__img(:style="{'background-image': 'url('+personas[person].img+')'}")
						.person-item__info
							.person-item__info__name
								span {{personas[person].name}}
							.person-item__info__others
								span.person-item__info__nickname {{personas[person].nickname}}
								span.person-item__info__year(v-if="personas[person].dates.birth") {{dateTransform(personas[person].dates.birth.seconds)}}
								
			vfamilynode(v-if='family.relatives', :datos='family.relatives', :personas="personas")
</template>

<script>
export default {
	name: "vfamilynode",
	props: ["datos","personas"],
	data() {
	  return {};
	},
	watch: {},
	methods: {
		dateTransform(timestamp){
			var a = new Date(0);
			a.setSeconds(timestamp);
			var months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
			var year = a.getFullYear();
			var month = months[a.getMonth()];
			var date = a.getDate();
			var time = date + ' ' + month + ' ' + year ;
			return time;
		}
	},
	created() {},
	mounted() {}
	
}
</script>

<style lang="sass">

</style>
