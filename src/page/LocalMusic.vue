<template>
    <div>
        <music-table
            class="music-table"
          :tracks="tracks"
          :currMusic="currMusic"
          :allTracks="allTracks"
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
            tracks: [],
            allTracks: [], //所有本地音乐
            currentRow: null,
            currMusic: {
                fileName: "暂无正在播放的音乐..."
            }, //当前音乐
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
        v_this.allTracks = tracks;
        v_this.tracks = v_this.allTracks;
        console.log(v_this.tracks);
        });
    },
    methods: {
        changeCurrMusic(row) {
            this.currMusic = row;
        },
    }
}
</script>