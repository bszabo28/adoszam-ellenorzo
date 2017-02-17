Adószám hibáinak, infóinak megjelenítése

<template>
	<div v-if="validator">
		<ul v-if="validator.valid" class="list-group">
			<li class="list-group-item">Adószám törzse: {{validator.main}}</li>
			<li class="list-group-item">CVS: {{validator.cvs}}</li>
			<li class="list-group-item" v-show="validator.region">Régió: {{validator.regionName}}</li>
			<li class="list-group-item" v-show="validator.vat">Áfakör: {{validator.vatName}}</li>
			<li class="list-group-item add-item" v-show="!exists && !isMax">
				<input type="button" value="Elment" class="btn btn-primary" @click="add">
			</li>
		</ul>

		<ul v-else class="list-group">
			<li class="list-group-item" v-for="error in validator.errors">{{error}}</li>
		</ul>
	</div>
</template>
<!--<style lang="scss" scoped>

	input{
		background-color: red !important;
	}
</style>-->
<script>
	import { mapGetters } from 'vuex';

	export default{

		 computed: {
			...mapGetters(['validator','exists','isMax']),
		},

		methods: {
			add(){
				this.$store.commit('addTaxnumber');
			 }
		}
	};
</script>