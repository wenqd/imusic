<template>
    <div>
        <music-table
            class="music-table"
            :tracks = "tracks"
            :allTracks = "allTracks"
            :currMusic= "$store.state.currMusic"
            @change="changeCurrMusic"
        ></music-table>
    </div>
</template>
<script>
const { ipcRenderer } = window.require("electron");
import "element-ui/lib/theme-chalk/index.css";
import MusicTable from "../components/MusicTable";
export default {
    name:"LocalMusic",
    data(){
        return {
            tracks: this.$store.state.allTracks,
            allTracks: this.$store.state.allTracks, //所有本地音乐
            currentRow: null,
            playStatus: {
                //是否播放状态
                isPlay: false,
                duration: "0:00",
                currTime: "0:00",
                percent: 0 //百分比进度
            }
        }
    },
    components: { MusicTable },
    mounted() {
        const v_this = this;
        ipcRenderer.on("selected_file", (event, filesPath) => {
            console.log(filesPath);
        });
        ipcRenderer.on("getTracks", (event, tracks) => {
            this.$store.commit("updateAllTracks",tracks)
            v_this.allTracks = tracks;
            v_this.tracks = v_this.allTracks;
        });
    },
    methods: {
        changeCurrMusic(row) {
            this.$store.commit("updateCurrMusic",row)
        },
    }
}
</script>