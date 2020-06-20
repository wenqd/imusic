<template>
    <div>
        <div class="title">
            <div class="h_left">
                <h2>本地音乐</h2>
                <span>共{{ tracks.length }}首</span>
            </div>
            <div class="h_right">
                <a-button
                    type="link"
                    style="font-size: 11px;"
                    @click="selectLocalMusic"
                    >添加本地音乐</a-button
                >
            </div>
        </div>
        <music-table
            class="music-table"
            :tracks="tracks"
            :allTracks="allTracks"
            :currMusic="$store.state.musicstore.currMusic"
            @change="changeCurrMusic"
        ></music-table>
        <div v-if="allTracks.length == 0" class="empty-tmp">
                <div class="desc">请添加本地音乐</div>
                <div class="slogan">
                    爱我所爱&nbsp;&nbsp;&nbsp;&nbsp;听你想听
                </div>
                <div>
                    <a-button type="primary" @click="selectLocalMusic"
                        >添加本地音乐</a-button
                    >
                </div>
            </div>
    </div>
</template>
<script>
const { ipcRenderer } = window.require("electron");
import "element-ui/lib/theme-chalk/index.css";
import MusicTable from "../components/MusicTable";
export default {
    name: "LocalMusic",
    data() {
        return {
            tracks: this.$store.state.musicstore.allTracks,
            allTracks: this.$store.state.musicstore.allTracks, //所有本地音乐
            currentRow: null,
            playStatus: {
                //是否播放状态
                isPlay: false,
                duration: "0:00",
                currTime: "0:00",
                percent: 0 //百分比进度
            }
        };
    },
    components: { MusicTable },
    mounted() {
        const v_this = this;
        ipcRenderer.on("selected_file", (event, filesPath) => {
            console.log(filesPath);
        });
        ipcRenderer.on("getTracks", (event, tracks) => {
            v_this.$store.commit("musicstore/updateAllTracks", tracks);
            v_this.allTracks = tracks;
            v_this.tracks = v_this.allTracks;
        });
        ipcRenderer.send("view-track",{});
    },
    methods: {
        selectLocalMusic() {
            ipcRenderer.send("open-dialog", "打开选择音乐窗口");
        },
        changeCurrMusic(row) {
            this.$store.commit("musicstore/updateCurrMusic", row);
        }
    }
};
</script>
<style lang="scss" scoped>
.title {
    padding-top: 20px;
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