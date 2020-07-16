<template>
    <div class="hotmv">
        <ul class="item" v-for="(item, index) in mvList" :key="index">
                <li class="item-d">
                    <img slot="cover" :alt="item.name" :src="item.cover" />
                    <div class="mask" @click="viewMv(item)">
                        <i class="ifont icon-1_music73"></i>
                    </div>
                </li>
                <div class="desc">{{ item.name }}-{{ item.artistName }}</div>
            </ul>
            <infinite-loading :distance="distance" @infinite="infiniteHandler">
                <div slot="spinner">拼命加载中...</div>//加载中的文字
                <div slot="no-more">已加载完毕!</div>//加载完毕的文字
                <div slot="no-results">暂无数据:(</div>//没有数据的文字
            </infinite-loading>
        <div>
            <a-drawer
                :title="currMv.name"
                placement="bottom"
                :closable="true"
                :visible="visible"
                height="100%"
                @close="onClose"
            >
                <div :key="mvUrl">
                    <video width="100%" height="100%" controls autoplay>
                        <source :src="mvUrl" type="video/mp4" />
                    </video>
                </div>
            </a-drawer>
        </div>
    </div>
</template>
<script>
import InfiniteLoading from "vue-infinite-loading";
const axios = require("axios");
export default {
    name: "HotMv",
    data() {
        return {
            mvList: [],
            visible: false,
            currMv: { id: "000000" },
            mvUrl: "",
            limit:20,
            distance: 100, //临界值，距离底部多少距离时触发函数  infiniteHandler
        };
    },
    components: {
        InfiniteLoading, //直接在组件中声明
    },
    created() {
        this.loadHotMv();
    },
    methods: {
        //加载默认mv
        loadHotMv() {
            axios
                .get(this.$store.state.musicstore.api + "/top/mv?limit="+this.limit+"&offset="+this.mvList.length, {})
                .then((res) => {
                    console.log("mv数据是:", res);
                    if (res.data.code === 200) {
                        this.mvList = this.mvList.concat(res.data.data);
                    }
                })
                .catch((e) => {
                    console.log(e);
                });
        },
        infiniteHandler($state) {
            console.log("触发");
             axios
                .get(this.$store.state.musicstore.api + "/top/mv?limit="+this.limit+"&offset="+this.mvList.length, {})
                .then((res) => {
                    if (res.data.code === 200) {
                        if(res.data.data.length===0){
                            $state.complete();
                        }
                        this.mvList = this.mvList.concat(res.data.data);
                        $state.loaded();
                    }
                })
                .catch((e) => {
                    console.log(e);
                });
        },
        //打开mv
        viewMv(item) {
            console.log("MV ID:" + item.id);
            this.currMv = item;
            this.visible = true;
            this.updateMvUrl(item.id);
        },
        //更新mvurl
        updateMvUrl(id) {
            axios
                .get(this.$store.state.musicstore.api + "/mv/url?id=" + id, {})
                .then((res) => {
                    console.log("mvUlr是:", res);
                    if (res.data.code === 200) {
                        this.mvUrl = res.data.data.url;
                    }
                })
                .catch((e) => {
                    console.log(e);
                });
        },
        onClose() {
            this.visible = false;
        },
    },
};
</script>
<style lang="scss" scoped>
.hotmv {
    margin: 10px;
    display: flex;
    flex-wrap: wrap;
    .item {
        margin-bottom: 10px;
        width: 33%;
        list-style: none;
        .item-d {
            width: 100%;
            position: relative;
        }
        img {
            width: 100%;
            border-radius: 4px;
        }
        .mask {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            opacity: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            i {
                font-size: 60px;
                color: #fff;
                opacity: 1;
            }
        }
        .mask:hover {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: #000;
            opacity: 0.4;
        }
        .desc {
            padding: 10px;
            font-size: 12px;
        }
    }
    .infinite-loading-container{
        width: 100%;
    }
}
</style>
