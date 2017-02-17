

import Vue from 'vue';
import store from './vuex/vuex';

import App from './app.vue';

// import jQuery from 'jquery';
import _ from 'lodash';

// window.jQuery = jQuery;
window._ = _;

const app = new Vue({
        store,
        el: '#vue-app',
        components: {
                'app-component': App
        },
        template: '<app-component></app-component>'
});