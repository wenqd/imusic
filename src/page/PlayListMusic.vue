<template>
    <div>
        <div class="title">
            <div class="coverImg">
                <img :src="playList.coverImgUrl" alt="" />
            </div>
            <div class="detail">
                <h2>{{ playList.name }}</h2>
                <div class="desc">
                    <a-avatar
                        v-if="playList.creator"
                        icon="user"
                        :src="playList.creator.avatarUrl"
                        size="small"
                    />
                <span class="nickname" v-if="playList.creator">{{playList.creator.nickname}}</span>
                {{getMyDate(playList.trackUpdateTime)}} 创建
                </div>
                <div class="status">
                    <a-row>
                        <a-col :span="6">歌曲数</a-col>
                        <a-col :span="6">{{playList.trackCount}}</a-col>
                        <a-col :span="6">播放数</a-col>
                        <a-col :span="6">{{playList.playCount}}</a-col>
                    </a-row>
                </div>
            </div>
        </div>
        <music-table
            class="music-table"
            :tracks="tracks"
            :allTracks="allTracks"
            :currMusic="$store.state.musicstore.currMusic"
            @change="changeCurrMusic"
        ></music-table>
    </div>
</template>
<script>
const { ipcRenderer } = window.require("electron");
import "element-ui/lib/theme-chalk/index.css";
import MusicTable from "../components/MusicTable";
const axios = require("axios");
export default {
    name: "PlayListMusic",
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
            playList: {}
        };
    },
    components: { MusicTable },
    props: {
        playId: {
            //当前歌单id
            type: String,
            default: () => {
                return "";
            }
        }
    },
    computed: {
        allTracks() {
            return this.$store.state.musicstore.allTracks;
        },
        tracks() {
            return this.allTracks;
        }
    },
    created() {
        this.getPlayDetail();
    },
    methods: {
        selectLocalMusic() {
            ipcRenderer.send("open-dialog", "打开选择音乐窗口");
        },
        changeCurrMusic(row) {
            this.$store.commit("musicstore/updateCurrMusic", row);
        },
        getPlayDetail() {
            axios
                .get(
                    "http://127.0.0.1:0723/playlist/detail?id=" + this.playId,
                    {}
                )
                .then(res => {
                    if (res.data.code === 200) {
                        this.playList = res.data.playlist;
                    }
                })
                .catch(e => {
                    console.log(e);
                });
        },
        //tools
        getMyDate(str) {
            var oDate = new Date(str),
                oYear = oDate.getFullYear(),
                oMonth = oDate.getMonth() + 1,
                oDay = oDate.getDate(),
                oHour = oDate.getHours(),
                oMin = oDate.getMinutes(),
                oSen = oDate.getSeconds(),
                oTime =
                    oYear +
                    "-" +
                    this.addZero(oMonth) +
                    "-" +
                    this.addZero(oDay) +
                    " " +
                    this.addZero(oHour) +
                    ":" +
                    this.addZero(oMin) +
                    ":" +
                    this.addZero(oSen);
            return oTime;
        },
        //补零操作
        addZero(num) {
            if (parseInt(num) < 10) {
                num = "0" + num;
            }
            return num;
        }
    }
};
</script>
<style lang="scss" scoped>
.title {
    padding: 10px 10px 10px 16px;
    border-bottom: 0.5px solid #e1e1e1;
    display: flex;
    flex-direction: row;
    .coverImg {
        img {
            width: 200px;
            height: 200px;
        }
    }
    .detail{
        margin-left: 20px;
        .desc{
            line-height: 30px;
            font-size: 12px;
            color: #999999;
            .ant-avatar{
                margin-right: 15px;
            }
            .nickname{
                font-size: 13px;
                margin-right: 20px;
                color: #000;
            }
        }
    }
    .status{
        margin: 20px 0;
        color: #999999;
    }
}
</style>