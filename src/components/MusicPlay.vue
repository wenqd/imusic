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
            <div class="fengmian">
                <img
                    :class="{ Rotation: playStatus.isPlay }"
                    :src="music.image || require('../assets/fengmian.png')"
                    alt="专辑图片"
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
            <vue-slider
                class="progress"
                v-model="playStatus.percent"
                :tooltip-formatter="dragFormatter"
                :lazy="true"
                @change="sliderChange"
            ></vue-slider>
            <div class="end-time">
                {{ playStatus.duration }}
            </div>
        </div>
    </div>
</template>

<script>
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";
const fs = window.require("fs");
const NodeID3 = require("node-id3");
const axios = require("axios");
let musicAudio = new Audio();
export default {
    name: "MusicPlay",
    data() {
        return {
            music: this.currMusic
        };
    },
    components: { VueSlider },
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
        }
    },
    mounted() {
        const v_this = this;
        musicAudio.addEventListener("loadedmetadata", () => {
            v_this.playStatus.duration = this.timeToMinute(musicAudio.duration);
        });
        musicAudio.addEventListener("timeupdate", () => {
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
        //切换音乐
        changeMusic(type) {
            const v_this = this;
            let index = 0;
            this.allTracks.map((item, k) => {
                if (item.id === v_this.music.id) {
                    index = k;
                }
            });
            if (type == "pre") {
                if (index === 0) {
                    index = this.allTracks.length;
                }
                this.music = this.allTracks[index - 1];
            } else if (type == "next") {
                if (index === this.allTracks.length - 1) {
                    index = -1;
                }
                this.music = this.allTracks[index + 1];
            }
            this.$store.commit("musicstore/updateCurrMusic", this.music);
        },
        //读取音乐播放
        playMusic(music, bool) {
            if (bool) {
                //musicAudio.src = music.filePath;
                //获取本地json文件文件的路径
                // 读取本地文件
                if (music.source === "neteaseCloud") {
                    axios
                        .get(
                            "http://127.0.0.1:0723/song/url?id=" + music.id,
                            {}
                        )
                        .then(res => {
                            console.log("数据是:", res);
                            if (res.data.code === 200) {
                                musicAudio.src = this.getOnlineUrl(
                                    res.data.data
                                );
                                musicAudio.play();
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
        dragFormatter(val) {
            let times = parseFloat(musicAudio.duration * (val / 100));
            return this.timeToMinute(times);
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
            box-sizing: initial;
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
}
</style>
