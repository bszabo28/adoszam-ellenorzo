<template>
	<nav aria-label="Page navigation" v-if="max > 1">
		<ul class="pagination">
			<li v-for="i in range" :class="{active: i===current}">
				<a href="#" @click.prevent="goto(i)">{{i+1}}</a>
			</li>
		</ul>
	</nav>
</template>

<script>

	import { mapGetters } from 'vuex';

	export default{

		props: ['max','current'],

		computed: {
		
			range(){
				return _.range(this.max);
			}
		},

		methods: {

			goto(i){
				this.$emit('changed',i);
			}
		}
	}
</script>