
import Vue from 'vue';
import Vuex from 'vuex';

import Common from './modules/common';

Vue.use(Vuex);

export default new Vuex.Store({

	modules: {
		common:  Common,
	}
});