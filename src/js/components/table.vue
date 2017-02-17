<template>
	<div v-show="getPage.length">

		<p v-if="isMax" class="bg-danger message">Nem lehet több adószámot felvenni a táblázatba!</p>

		<div class="table-responsive">

			<table class="table">
				<thead>
					<tr>
						<th>Adószám törzse</th>
						<th>Áfakör</th>
						<th>Régió</th>
						<th>Törlés</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="taxnumber in getPage">
						<td>{{taxnumber.main}}</td>
						<td>{{taxnumber.vatName || '-'}}</td>
						<td>{{taxnumber.regionName || '-' }}</td>
						<td>
							<input type="button" value="Törlés" class="btn btn-danger" @click="remove(taxnumber)">
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<paginator-component 
			v-on:changed="paginate"
			:max="getMaxPageCount" 
			:current="page">
		</paginator-component>
	</div>
</template>

<script>

	import { mapGetters } from 'vuex';
	import Paginator from './paginator.vue';

	export default {

		watch: {
			getTaxnumbers(){
				if(this.enabled || this.maxPage > this.getMaxPageCount){
					this.page = Math.floor((this.getTaxnumbers.length - 1) / this.countPerPage);
				}
			}
		},

		computed: {
			...mapGetters(['getTaxnumbers','isMax','maximum']),

			getPage(){
				var begin = this.page * this.countPerPage;
				var end = (this.page + 1) * this.countPerPage; 

				return  this.getTaxnumbers.slice(begin,end);
			},

			getMaxPageCount(){
				return Math.ceil(this.getTaxnumbers.length / this.countPerPage);
			},

			maxPage(){
				return Math.ceil(this.maximum / this.countPerPage);
			}			
		},

		components: {
			'paginator-component': Paginator,
		},

		data(){
			return {
				page: 0,
				enabled: true,
				countPerPage: 5,
			}
		},

		methods: {
			remove(v){
				this.enabled = false;
				this.$store.commit('removeTaxnumber',v);

				this.$nextTick(() => {
					this.enabled = true;
				})
			},

			paginate(i){
				this.page = i;
			}			
		}
	};
</script>