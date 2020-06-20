import Vue from "vue";
import Vuex from "vuex";
import musicstore from './music'
import userstore from './user'
Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        musicstore,
        userstore,
    },
});
