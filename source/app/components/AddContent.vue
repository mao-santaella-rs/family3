<template lang="pug">
	#addcontent
		.container
			.row
				.col-9
					.card
						.card-header
							h5.card-title Card title
						.card-body
							.form
								.form-group
									label(for='form-name') Name
									input#form-name.form-control(type='text')
								.form-group
									label(for='form-nickname') Nick Name
									input#form-nickname.form-control(type='text')
								.form-group
									label(for='form-mother') Mother
									select#form-mother.form-control
										option Maru
								.form-group
									label(for='form-father') Father
									select#form-father.form-control
										option chacho
								.form-group
									label(for='form-birth') Birth Day
									input#form-birth.form-control(type='date')
								.form-group
									label(for='form-bio') Bio
									textarea#form-bio.form-control(rows='3')

</template>

<script>
export default {
	name: "vaddcontent",
	data() {
	  return {};
	},
	methods: {},
	created() {},
	mounted() {}
	
}
</script>

<style lang="sass" scoped>
@import "../../_includes/sass/1-tools/bootstrap/bootstrap"
</style>

