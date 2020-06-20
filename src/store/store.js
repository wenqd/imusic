import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        product: "I Music",
        currMusic: {
            fileName: "暂无正在播放的音乐..."
        }, //当前音乐
        allTracks:[],
        playStatus:{}
    },
    mutations: {
        updateCurrMusic(state,music){
            state.currMusic = music
        },
        updateAllTracks(state,tracks){
            state.allTracks = tracks
        }
    },
});
export default store
