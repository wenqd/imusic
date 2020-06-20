<template>
    <div class="online">
        <a-tabs default-active-key="1">
            <a-tab-pane key="1" tab="排行榜" force-render>
                <div class="ranking">
                    <a-row :gutter="20">
                        <a-col :span="8">
                            <a-card title="热歌榜" class="top-card">
                                <a v-if="false" slot="extra" href="#">查看全部</a>
                                <template
                                    v-for="(item, index) in topList.data_1.filter((item,index,arr) =>{return index <10})"
                                >
                                    <a-row
                                        :key="index"
                                        :music-id="item.id"
                                        class="item"
                                        @dblclick.native="playMusic(item.id)"
                                    >
                                        <a-col :span="2">{{ index + 1 }}</a-col>
                                        <a-col :span="14" class="name">{{
                                            item.name
                                        }}</a-col>
                                        <a-col :span="8" class="artist">{{
                                            item.ar[0].name
                                        }}</a-col>
                                    </a-row>
                                </template>
                            </a-card>
                        </a-col>
                        <a-col :span="8">
                            <a-card title="新歌榜" class="top-card">
                                <a v-if="false" slot="extra" href="#">查看全部</a>
                                <template
                                    v-for="(item, index) in topList.data_0.filter((item,index,arr) =>{return index <10})"
                                >
                                    <a-row
                                        :key="index"
                                        :music-id="item.id"
                                        class="item"
                                        @dblclick.native="playMusic(item.id)"
                                    >
                                        <a-col :span="2">{{ index + 1 }}</a-col>
                                        <a-col :span="14" class="name">{{
                                            item.name
                                        }}</a-col>
                                        <a-col :span="8" class="artist">{{
                                            item.ar[0].name
                                        }}</a-col>
                                    </a-row>
                                </template>
                            </a-card>
                        </a-col>
                        <a-col :span="8">
                            <a-card title="飙升榜" class="top-card">
                                <a v-if="false" slot="extra" href="#">查看全部</a>
                                <template
                                    v-for="(item, index) in topList.data_2.filter((item,index,arr) =>{return index <10})"
                                >
                                    <a-row
                                        :key="index"
                                        :music-id="item.id"
                                        class="item"
                                        @dblclick.native="playMusic(item.id)"
                                    >
                                        <a-col :span="2">{{ index + 1 }}</a-col>
                                        <a-col :span="14" class="name">{{
                                            item.name
                                        }}</a-col>
                                        <a-col :span="8" class="artist">{{
                                            item.ar[0].name
                                        }}</a-col>
                                    </a-row>
                                </template>
                            </a-card>
                        </a-col>
                    </a-row>
                </div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="歌手榜">
                歌手榜
            </a-tab-pane>
            <a-tab-pane key="3" tab="歌单">
                歌单
            </a-tab-pane>
        </a-tabs>
    </div>
</template>
<script>
const axios = require("axios");
export default {
    name: "OnlineMusic",
    data() {
        return {
            topList: {
                data_0: [],
                data_1: [],
                data_2: []
            }
        };
    },
    mounted() {
        this.getRankList();
    },
    methods: {
        getRankList() {
            this.requetApi(1); //"1": 云音乐热歌榜,
            this.requetApi(0); //"0": 云音乐新歌榜,
            this.requetApi(2); //"2": 云音乐飙升榜,
        },
        requetApi(idx) {
            axios
                .get("http://127.0.0.1:0723/top/list?idx=" + idx, {})
                .then(res => {
                    if (res.data.code === 200) {
                        this.topList["data_" + idx] = res.data.playlist.tracks;
                    }
                })
                .catch(e => {
                    console.log(e);
                });
        },
        //播放音乐
        playMusic(id) {
            this.$store.commit("updateCurrMusic", {
                id,
                source: "neteaseCloud"
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.online {
    .ranking {
        margin: 20px 40px;
        .top-card {
            /deep/ .ant-card-body {
                padding: 13px 20px;
            }
            .item {
                color: #000;
                font-size: 12px;
                padding: 5px 0;
                cursor: pointer;
                :hover {
                    color: #c62f2f;
                }
                .name {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .artist {
                    text-align: right;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }
}
</style>