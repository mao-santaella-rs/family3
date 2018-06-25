<template lang="pug">
    .row
        .fmly(v-if='datos', v-for='family in datos')
            .couple
                .ref
                .person(v-for='(person,index) in family.couple', :key='person+index')
                    .person-item
                        .person-item__img
                            img(:src="personas[person].img", alt="")
                        .person-item__info
                            .person-item__info__name
                                span {{personas[person].name}}
                            .person-item__info__nickname
                                span {{personas[person].nickname}}
                            .person-item__info__year
                                span {{dateTransform(personas[person].dates.birth.seconds)}}
                                
            FamilyNode(v-if='family.relatives', :datos='family.relatives', :personas="personas")
</template>

<script>
export default {
   name: "FamilyNode",
   props: ["datos","personas"],
   data() {
      return {};
   },
   watch: {},
   methods: {
       dateTransform(timestamp){
           
            var t = new Date(0); // Epoch
            t.setSeconds(timestamp);

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
