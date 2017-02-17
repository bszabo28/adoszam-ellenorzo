<template>
        <div :class="{'form-group': true, 'has-error': validator && !validator.valid, 'has-success': validator.valid}">
                <label class="control-label" for="inputWarning1">Iziben írjál be egy adószámot:</label>
                
                <input 
                        type="text" 
                        id="inputWarning1" 
                        v-model="taxnumber" 
			autocomplete="off"
                        class="form-control" 
                        placeholder="Például: 12345676-01-5"
			@keyup.enter.prevent="add"
			@keyup.prevent="generateAndAdd">
		<div class="taxnumber-generator" @click="get">Véletlen adószám létrehozása</div>              
        </div>
</template>
<script>

	import { mapGetters } from 'vuex';
	import { Validator, Generator } from 'adoszam-ellenorzo';  

	const G = new Generator(new Validator());

        export default {

                computed: { 

			...mapGetters(['validator','exists']),

			taxnumber: {
				get(){
					return this.$store.state.common.taxnumber;
				},

				set(v){
					this.$store.commit('setTaxnumber',v);
				}
			}
                },

		methods: {

			add(){
				this.$store.commit('addTaxnumber');
			},

			generateAndAdd(e){
				if(e.keyCode === 38 ){
					this.get();
					this.add();
				}
				else if(e.keyCode === 39){
					this.get();
				}
				else if(e.keyCode === 40){
					this.$store.commit('removeTaxnumber');
				}
			},

			get(){
				var tx = this.taxnumber;
				var temp = G.get();
				temp = `${temp.main}-${temp.vat}-${temp.region}`;
				this.taxnumber = temp;

				jQuery(this.$el).find('input').focus();
			}
		}
        };
</script>