<template>
	<div>
		helló
	</div>
</template>

<scrip>

	import { mapGetters } from 'vuex';

	export default{ 

		computed: {

			...mapGetters(['getTaxnumbers']),


			regions(){
				_.groupBy(this.getTaxnumbers)
			}
		}

	}
</scrip>