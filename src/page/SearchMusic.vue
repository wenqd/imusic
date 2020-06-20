<template>
    <div>
        <div class="title">
            <div class="h_left">
                <span>搜索<span style="color:#0c73c2">"{{$store.state.searchResult.searchtext }}"</span>,找到{{$store.state.searchResult.songCount }}首单曲</span>
            </div>
        </div>
        <music-table
            class="music-table"
            :tracks="tracks"
            :allTracks="allTracks"
            :currMusic="$store.state.currMusic"
            @change="changeCurrMusic"
        ></music-table>
    </div>
</template>
<script>
const { ipcRenderer } = window.require("electron");
import "element-ui/lib/theme-chalk/index.css";
import MusicTable from "../components/MusicTable";
export default {
    name: "SearchMusic",
    data() {
        return {
            currentRow: null,
            playStatus: {
                //是否播放状态
                isPlay: false,
                duration: "0:00",
                currTime: "0:00",
                percent: 0 //百分比进度
            },
        };
    },
    components: { MusicTable },
    computed:{
        allTracks(){
            return this.$store.state.allTracks
        },
        tracks(){
            return this.allTracks
        }
    },
    mounted() {
    },
    methods: {
        selectLocalMusic() {
            ipcRenderer.send("open-dialog", "打开选择音乐窗口");
        },
        changeCurrMusic(row) {
            this.$store.commit("updateCurrMusic", row);
        },
    }
};
</script>
<style lang="scss" scoped>
.title {
    padding: 10px 10px 10px 16px;
    border-bottom: 0.5px solid #e1e1e1;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 55px;
    line-height: 38px;
    .h_left {
        h2 {
            display: inline-block;
            padding: 0 12px 0 20px;
            font-size: 17px;
        }
        span {
            font-size: 12px;
            color: #666666;
        }
    }
}
</style>