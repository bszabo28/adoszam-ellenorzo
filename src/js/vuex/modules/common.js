
import { Validator } from 'adoszam-ellenorzo';
let V = new Validator();

function exists(taxnumbers,taxnumber){

	if(!taxnumber){
		return true;
	}

	var v = V.check(taxnumber);

	return !!_.find(taxnumbers,i => {
		return i.main === v.main;
	});
}


export default{

	state: {
		taxnumber: null,
		taxnumbers: [],
		maximum: 25,
	},

	getters: {

		exists(state,getters){
			return exists(state.taxnumbers,state.taxnumber);
		},

		validator(state) {
			return V.check(state.taxnumber);
		},

		// Éppen aktuális adószám 
		getTaxnumber(state) {
			return state.taxnumber;
		},

		// Lementett adószámok
		getTaxnumbers(state) {
			return state.taxnumbers;
		},

		isMax(state){
			return state.taxnumbers.length >= state.maximum;
		},

		maximum(state){
			return state.maximum;
		}
	},

	mutations: {

		eraseTaxnumber(state){
			state.taxnumber = null;
		},

		// Éppen aktuális adószám beállítása
		setTaxnumber(state, taxnumber) {
			state.taxnumber = taxnumber;
		},

		// Adószám lementése, akkor, ha még nincs mentve
		// Nincs még a tömbben és nem érte el a tömb a maximumát
		addTaxnumber(state) {

			if(exists(state.taxnumbers,state.taxnumber)){
				 return;
			}

			if(state.taxnumbers.length >= state.maximum){
				return;
			}
			
			var temp = V.check(state.taxnumber);

			if(temp.valid){
				state.taxnumbers.push(temp);
				state.taxnumber = null;
			}
		},

		// Lementett adószám törlése
		removeTaxnumber(state, taxnumber) {
			
			var temp = state.taxnumbers.splice(0);

			if(taxnumber){
				_.remove(temp, taxnumber);
			}
			else{
				temp.pop();
			}

			state.taxnumbers = temp;
		},
	}
}