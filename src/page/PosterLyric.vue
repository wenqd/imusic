<template>
    <div class="poster" :data-img="img" :style="div_before">
        <div class="close" @click="hidePoster">
            <i class="ifont icon-suoxiao"></i>
        </div>
        <a-row>
            <a-col :span="12" class="img">
                <img :src="img" :class="{ Rotation: playStatus.isPlay }" alt="海报" />
            </a-col>
            <a-col :span="12" class="lyric">
                <div>
                    <div class="title">
                        <span>{{ music.title }}</span>
                    </div>
                    <div class="artist">
                        <span>歌手 : {{ music.artist }}</span>
                    </div>
                    <div class="album">
                        <span>专辑 : {{ music.album }}</span>
                    </div>
                </div>
                <div class="lyric-content" ref="lyriccontent">
                    <ul>
                        <li
                            v-for="(item, index) in lyric"
                            :key="index"
                            :id="'lyric-item-' + index"
                            :class="{ current: currentNum === index }"
                        >
                            {{ item.txt }}
                        </li>
                    </ul>
                </div>
            </a-col>
        </a-row>
    </div>
</template>
<script>
import BScroll from "@better-scroll/core";
import Lyric from "lyric-parser/src/index";
const axios = require("axios");
let lyric_c = null;
export default {
    name: "PosterLyric",
    data() {
        return {
            scroll: "",
            lyric: [], //歌词
            currentNum: 0 //歌词当前行数
        };
    },
    props: {
        img: {
            //当前音乐海报
            type: String,
            default: () => {
                return "";
            }
        },
        currMusic: {
            //当前音乐
            type: Object,
            default: () => {
                return {};
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
        }
    },
    computed: {
        music:function(){
            return this.currMusic;
        },
        div_before: function() {
            return {
                "--background": "#d5d6d5 url(" + this.img + ") no-repeat center"
            };
        },
        plays: function() {
            //播放状态
            return this.playStatus;
        }
    },
    watch: {
        music: {
            handler(newval, oldval) {
                this.getLyric(newval.id);
            },
            deep: true
        },
        plays: {
            handler(newval, oldval) {
                if (lyric_c !== null) {
                    lyric_c.seek(newval.currTime_def * 1000);
                    if (!newval.isPlay) {
                        lyric_c.togglePlay();
                    }
                }
            },
            deep: true
        },
        "plays.isPlay": {
            handler(newval, oldval) {
                lyric_c.togglePlay();
            },
            deep: true
        }
    },
    created() {
        this.getLyric(this.music.id);
    },
    methods: {
        getLyric(id) {
            if (lyric_c !== null) {
                lyric_c.stop();
                lyric_c = null;
            }
            if (this.music.source !== "neteaseCloud") {
                //本地音乐不加载歌词
                this.lyric = [{ txt: "暂无歌词" }];
                return;
            }
            const v_this = this;
            axios
                .get(this.$store.state.musicstore.api + "/lyric?id=" + id, {})
                .then(res => {
                    console.log("歌词:", res);
                    lyric_c = new Lyric(res.data.lrc.lyric, this.handleLyric);
                    console.log(lyric_c.lines);
                    this.$nextTick(() => {
                        this.scroll = new BScroll(this.$refs.lyriccontent, {
                            scrollY: true,
                            click: true,
                            probeType: 3 // listening scroll hook
                        });
                    });
                    this.lyric = lyric_c.lines;
                    if (this.playStatus.isPlay) {
                        lyric_c.play();
                    }
                })
                .catch(e => {
                    console.log(e);
                });
        },
        handleLyric({ lineNum, txt }) {
            this.currentNum = lineNum;
            console.info("line:" + lineNum);
            // 若当前行大于5,开始滚动,以保歌词显示于中间位置
            if (lineNum > 5) {
                this.scroll.refresh();
                //let lineEl = this.$refs.lyriccontent[lineNum - 5];
                // 结合better-scroll，滚动歌词
                this.scroll.scrollToElement(
                    "#lyric-item-" + (lineNum - 5),
                    1000
                );
            } else {
                this.scroll.scrollToElement("#lyric-item-0", 0, 1000);
                this.scroll.refresh();
            }
        },
        //隐藏歌词海报
        hidePoster() {
            this.$emit("hidePoster", {});
        }
    }
};
</script>
<style lang="scss" scoped>
.poster {
    overflow: hidden;
    .close {
        cursor: pointer;
        position: absolute;
        top: 15px;
        left: 15px;
        z-index: 9;
        i {
            font-size: 28px;
        }
    }
    .ant-row {
        height: 100%;
        .img {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            img {
                width: 300px;
                height: 300px;
                border-radius: 50%;
                border: 10px solid #3c3331;
                box-shadow: 0px 1px 7px 5px #c3baba66;
            }
        }
        .lyric {
            height: 100%;
            padding: 50px 0 0;
            font-size: 12px;
            .title {
                font-size: 30px;
            }
            .lyric-content {
                overflow: hidden;
                margin: 20px 0;
                height: calc(100% - 150px);
                ul {
                    list-style: none;
                    padding: 0;
                    font-size: 16px;
                    li {
                        margin: 10px 0;
                    }
                    .current {
                        color: #fff;
                        font-size: 20px;
                    }
                }
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
            animation: rotation 35s linear infinite;
            -moz-animation: rotation 35s linear infinite;
            -webkit-animation: rotation 35s linear infinite;
            -o-animation: rotation 35 linear infinite;
        }
    }
}
.poster::before {
    content: "";
    position: absolute;
    -webkit-filter: blur(5px);
    filter: blur(20px);
    z-index: -1;
    background: var(--background);
    width: 100%;
    height: 100%;
    background-size: cover;
    opacity: 0.6;
}
</style>