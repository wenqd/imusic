<template>
    <div class="audio">
        <div class="audio-tool">
            <a-row>
                <a-col :span="8">
                    <i
                        class="ifont icon-1_music83"
                        style="font-size: 30px;"
                        @click="changeMusic('pre')"
                    ></i>
                </a-col>
                <a-col :span="8">
                    <i
                        :class="{
                            ifont: true,
                            'icon-1_music73': !playStatus.isPlay,
                            'icon-1_music87': playStatus.isPlay
                        }"
                        style="font-size: 40px;"
                        @click="playPause"
                    ></i>
                </a-col>
                <a-col :span="8">
                    <i
                        class="ifont icon-1_music82"
                        style="font-size: 30px;"
                        @click="changeMusic('next')"
                    ></i>
                </a-col>
            </a-row>
        </div>
        <div class="audio-setting">
            <div class="fengmian" @click="posterShow = !posterShow">
                <img
                    :class="{ Rotation: playStatus.isPlay }"
                    :src="music.image || require('../assets/fengmian.png')"
                    alt="查看歌词"
                    title="查看海报-歌词"
                />
            </div>
            <div class="info">
                <div class="title">
                    <a-tooltip placement="topLeft">
                        <template slot="title">
                            {{
                                music.title ||
                                    music.fileName ||
                                    "请选择播放音乐"
                            }}
                        </template>
                        {{ music.title || music.fileName || "请选择播放音乐" }}
                    </a-tooltip>
                </div>
                <div class="author">{{ music.artist }}</div>
            </div>
        </div>
        <div class="audio-process">
            <div class="start-time">
                {{ playStatus.currTime }}
            </div>
            <div class="progress">
                <vue-slider
                    v-model="playStatus.percent"
                    :tooltip-formatter="dragFormatter"
                    :lazy="true"
                    @change="sliderChange"
                ></vue-slider>
                <div class="lyric">{{currTimeLyric}}</div>

            </div>
            <div class="end-time">
                {{ playStatus.duration }}
            </div>
            <i
                :class="{
                    'voleme-icon': true,
                    'ifont': true,
                    'icon-yinliang': volume !== 0,
                    'icon-jingyin': volume === 0
                }"
                @click="volume===0?volume=50:volume=0"
            ></i>
            <vue-slider
                class="volume"
                v-model="volume"
                :lazy="true"
                @change="sliderChangeVolume"
            ></vue-slider>
            <i
                :class="{
                    'playtype-icon': true,
                    'ifont': true,
                    'icon-danquxunhuan': playtype === 0,
                    'icon-suiji': playtype === 2,
                    'icon-shunxubofang': playtype === 1
                }"
                @click="playTypeChange"
            ></i>
        </div>
        <div class="poster" v-show="posterShow">
            <poster-lyric
                :key="music.id"
                :img="music.image || require('../assets/fengmian.png')"
                :currMusic="music"
                :playStatus="playStatus"
                @hidePoster="posterShow = false"
                @currTimeLyric="currTimeLyricEvent"
            ></poster-lyric>
        </div>
    </div>
</template>

<script>
import VueSlider from "vue-slider-component";
import PosterLyric from "../page/PosterLyric";
import "vue-slider-component/theme/default.css";
const fs = window.require("fs");
const NodeID3 = require("node-id3");
const axios = require("axios");
let musicAudio = new Audio();
export default {
    name: "MusicPlay",
    data() {
        return {
            music: this.currMusic,
            playtype:1,//播放模式  0:单曲循环  1 顺序播放  2 随机播放
            volume: 80, //音量
            posterShow: false, //海报是否显示
            currTimeLyric:"",//当前时间歌词
        };
    },
    components: { VueSlider, PosterLyric },
    props: {
        currMusic: {
            //当前音乐
            type: Object,
            default: () => {
                return {
                    fileName: "暂无正在播放的音乐..."
                };
            }
        },
        playStatus: {
            //是否播放状态
            type: Object,
            default: () => {
                return {
                    isPlay: false,
                    duration: "0:00",
                    currTime: "0:00",
                    duration_def: "",
                    currTime_def: "",
                    percent: 0 //百分比进度
                };
            }
        },
        allTracks: {
            //所有音乐
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    computed: {
        triggerShowPanel() {
            return this.$store.state.musicstore.showPanel;
        }
    },
    watch: {
        music: {
            handler(newval, oldval) {
                if (!this.music.image) {
                    this.music.image = this.getImgUrl(newval);
                }
                if (newval === oldval) {
                    this.getImgUrl(newval);
                    this.playMusic(newval, false);
                } else {
                    this.playMusic(newval, true);
                }
                this.$emit("change", newval);
            },
            deep: true
        },
        currMusic(data) {
            this.music = data;
        },
        triggerShowPanel() {
            if (this.triggerShowPanel === "search") {
                this.posterShow = false;
            }
        },
        volume(){
            //音量条件
            this.sliderChangeVolume(this.volume)
        },
        //播放模式
        playtype(){

        }
    },
    mounted() {
        const v_this = this;
        musicAudio.addEventListener("loadedmetadata", () => {
            v_this.playStatus.duration = this.timeToMinute(musicAudio.duration);
        });
        musicAudio.addEventListener("timeupdate", () => {
            v_this.playStatus.duration_def = musicAudio.duration;
            v_this.playStatus.currTime_def = musicAudio.currentTime;
            v_this.playStatus.currTime = this.timeToMinute(
                musicAudio.currentTime
            );
            if (v_this.playStatus.currTime === v_this.playStatus.duration) {
                //v_this.playStatus.isPlay=false
                this.changeMusic("next");
            }
            let value = parseInt(
                (musicAudio.currentTime / musicAudio.duration) * 100
            );
            if (!isNaN(value)) {
                v_this.playStatus.percent = value;
            }
        });
    },
    methods: {
        //播放暂停控制
        playPause() {
            if (this.playStatus.isPlay) {
                musicAudio.pause();
                this.playStatus.isPlay = false;
            } else {
                if (musicAudio.src !== "") {
                    musicAudio.play();
                    this.playStatus.isPlay = true;
                }
            }
        },
        //切换音乐,step:向后播放第几首
        changeMusic(type,tempPlayType) {
            /*  start 当单曲循环时，遇到vip歌曲强制调到下一首 */
            tempPlayType  = this.playtype===0?tempPlayType || this.playtype:tempPlayType = this.playtype
            /**end */
            const v_this = this;
            let index = 0;
            this.allTracks.map((item, k) => {
                if (item.id === v_this.music.id) {
                    index = k;
                }
            });
            let music = {};
            switch (tempPlayType) {
                case 0://单曲循环
                    music = this.allTracks[index];
                    break;
                case 1://顺序播放
                    if (type == "pre") {
                        if (index === 0) {
                            index = this.allTracks.length;
                        }
                        music = this.allTracks[index - 1];
                    } else if (type == "next") {
                        if (index === this.allTracks.length - 1) {
                            index = -1;
                        }
                        music = this.allTracks[index + 1];
                    }
                    break;
                case 2://随机播放
                    music = this.allTracks[this.random(0,this.allTracks.length-1)];
                    break;
                default:
                    if (type == "pre") {
                        if (index === 0) {
                            index = this.allTracks.length;
                        }
                        music = this.allTracks[index - 1];
                    } else if (type == "next") {
                        if (index === this.allTracks.length - 1) {
                            index = -1;
                        }
                        music = this.allTracks[index + 1];
                    }
                    break;
            }
            this.$store.commit("musicstore/updateCurrMusic", music);
        },
        //读取音乐播放
        playMusic(music, bool) {
            const v_this = this;
            if (bool) {
                //musicAudio.src = music.filePath;
                //获取本地json文件文件的路径
                // 读取本地文件
                if (music.source === "neteaseCloud") {
                    axios
                        .get(
                            this.$store.state.musicstore.api +
                                "/song/url?id=" +
                                music.id,
                            {}
                        )
                        .then(res => {
                            console.log("数据是:", res);
                            if (res.data.code === 200) {
                                let onlineUrl = this.getOnlineUrl(
                                    res.data.data
                                );
                                if (onlineUrl == null) {
                                    this.$message.info(
                                        "当前歌曲需要VIP，2s后切换到下一首!"
                                    );
                                    setTimeout(function() {
                                        //切换音乐
                                        v_this.changeMusic("next",-1);
                                    }, 2000);
                                } else {
                                    musicAudio.src = onlineUrl;
                                    musicAudio.play();
                                }
                            }
                        })
                        .catch(e => {
                            console.log(e);
                        });
                } else {
                    musicAudio.src = fs.statSync(music.filePath);
                    let data = fs.readFileSync(music.filePath);
                    var musicBlob = new Blob([data], { type: "audio/x-mpeg" });
                    musicAudio.src = URL.createObjectURL(musicBlob);
                    musicAudio.play();
                }
            }
            musicAudio.volume = parseFloat(this.volume / 100);
            musicAudio.play();
            this.playStatus.isPlay = true;
        },
        getOnlineUrl(data) {
            return data[0].url;
        },
        //获取音乐专辑图片
        getImgUrl(music) {
            if (music.filePath) {
                let data = fs.readFileSync(music.filePath);
                let tags = NodeID3.read(data);
                if (tags.image) {
                    var imgblob = new Blob([tags.image.imageBuffer]);
                    var url = URL.createObjectURL(imgblob);
                    return url;
                } else {
                    return require("../assets/fengmian.png");
                }
            }
        },
        //快进
        sliderChange(value, index) {
            musicAudio.currentTime = parseFloat(
                musicAudio.duration * (value / 100)
            );
        },
        //音量调节
        sliderChangeVolume(value, index) {
            musicAudio.volume = parseFloat(value / 100);
        },
        //播放模式修改
        playTypeChange(){
            this.playtype = (this.playtype + 1)%3
        },
        dragFormatter(val) {
            let times = parseFloat(musicAudio.duration * (val / 100));
            return this.timeToMinute(times);
        },
        //实时歌词
        currTimeLyricEvent(txt){
            this.currTimeLyric = txt
        },
        // 秒转换分钟00:00:00格式
        timeToMinute(times) {
            var t = "";
            if (times > -1) {
                //var hour = Math.floor(times/3600);
                var min = Math.floor(times / 60) % 60;
                var sec = times % 60;
                /* if(hour < 10) {
                    t = '0'+ hour + ":";
                } else {
                    t = hour + ":";
                }
                */
                if (min < 10) {
                    t += "0";
                }
                t += min + ":";
                if (sec < 10) {
                    t += "0";
                }
                t += sec.toFixed(2);
            }
            t = t.substring(0, t.length - 3);
            return t;
        },
        //生成随机数
        random(min,max){
            var range = max - min;
            var rand = Math.random();
            var num = min + Math.round(rand * range);
            return num;
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.audio {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-top: 1px solid #e1e1e1;
    margin-top: -1px;
    .audio-tool {
        width: 180px;
        text-align: center;
        padding: 0 15px;
        color: #c62f2f;
        div {
            height: 60px;
            line-height: 60px;
        }
        i {
            cursor: pointer;
        }
    }
    .audio-process {
        flex: 1;
        padding: 18px 35px 0 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        color: #000;
        .start-time {
            text-align: center;
            height: 24px;
            line-height: 24px;
            margin-right: 15px;
        }
        .end-time {
            width: 40px;
            text-align: center;
            height: 24px;
            line-height: 24px;
            margin-left: 15px;
        }
        .progress {
            flex: 1;
            margin: 2px 0;
            .vue-slider{
                box-sizing: initial;
            }
            .lyric{
                text-align: center;
                font-size: 12px;
                box-sizing: initial;
            }
        }
        .voleme-icon {
            margin: 0 2px 0 15px;
            cursor: pointer;
        }
        .volume {
            margin: 2px 5px;
            width: 100px !important;
            box-sizing: initial;
        }
        .playtype-icon{
            cursor: pointer;
            margin-left: 10px;
        }
    }
    .audio-setting {
        width: 160px;
        height: 60px;
        font-size: 12px;
        display: flex;
        flex-direction: row;
        div {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .fengmian {
            line-height: 60px;
            width: 35px;
            margin-right: 10px;
            cursor: pointer;
            img {
                width: 33px;
                height: 33px;
                border-radius: 50%;
            }
        }
        .info {
            flex: 1;
            .title {
                color: #000000;
                margin: 13px 0 1px;
            }
            .author {
                color: #7d7d7d;
            }
        }
        @-webkit-keyframes rotation {
            from {
                -webkit-transform: rotate(0deg);
            }
            to {
                -webkit-transform: rotate(360deg);
            }
        }

        .Rotation {
            -webkit-transform: rotate(360deg);
            animation: rotation 5s linear infinite;
            -moz-animation: rotation 5s linear infinite;
            -webkit-animation: rotation 5s linear infinite;
            -o-animation: rotation 5 linear infinite;
        }
    }
    .poster {
        width: 100%;
        position: fixed;
        top: 50px;
        background-color: #eaeaea;
        height: calc(100% - 111px);
    }
}
</style>
