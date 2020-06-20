<template>
    <div class="header">
        <div class="logo">
            <img src="../assets/logo.png" alt="I-Music" />
            <span>{{ $store.state.product }}</span>
        </div>
        <div class="search">
            <a-input-search
                v-model="searchtext"
                size="small"
                placeholder="搜索"
                @search="searchMusic"
                class="search-input"
                style="width: 150px;"
            />
        </div>
        <div class="tool">
            <div class="win-tool">
                <i class="ifont icon-minimum" @click="winToolClick('min')"></i>
                <i class="ifont icon-maximize" @click="winToolClick('max')"></i>
                <i class="ifont icon-close" @click="winToolClick('close')"></i>
            </div>
        </div>
    </div>
</template>

<script>
const { ipcRenderer } = window.require("electron");
const axios = require("axios");

export default {
    name: "HeaderBar",
    data(){
        return {
            searchtext:""
        }
    },
    methods: {
        //菜单栏按钮处理
        winToolClick(type) {
            if (type === "min") {
                //发送最小化命令
                ipcRenderer.send("window-min");
            }
            if (type === "max") {
                //发送最小化命令
                ipcRenderer.send("window-max");
            }
            if (type === "close") {
                //发送最小化命令
                ipcRenderer.send("window-close");
            }
        },
        searchMusic() {
            if (this.searchtext) {
                this.$store.commit("updateShowPanel","search")
                axios
                    .get("http://127.0.0.1:0723/search?keywords="+this.searchtext, {})
                    .then(res => {
                        console.log("数据是:", res);
                        if(res.data.code===200){
                            this.renderMusic(res.data.result)
                        }
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }
        },
        renderMusic(data){
            let tracks = data.songs.map(item=>{
                return {
                    id:item.id,
                    title:item.name,
                    duration:item.duration,
                    artist:item.artists[0].name,
                    fileName:item.name,
                    album:item.album.name,
                    source:'neteaseCloud'
                }
            })
            data.searchtext = this.searchtext
            this.$store.commit("updateSearchResult", data);
            this.$store.commit("updateAllTracks", tracks);
        }
    }
};
</script>

<style lang="scss" scoped>
//搜索框宽度
.search-input /deep/ .ant-input-sm {
    border-radius: 45px !important;
    font-size: 12px;
    padding: 0 16px;
    border: 0px solid #e1e1e1;
    background-color: #a82828;
    color: #fff;
    line-height: 24px;
}
.search-input /deep/ .ant-input-search-icon {
    color: #fff;
}
.search-input
    /deep/
    .ant-input-affix-wrapper:hover
    .ant-input:not(.ant-input-disabled) {
    border: none;
}
.search-input /deep/ .ant-input:focus {
    box-shadow: none;
    border-right-width: 0 !important;
}
.search-input /deep/ .ant-input:hover {
    border-right-width: 0px !important;
    border: 0;
}
.header {
    .logo {
        width: 200px;
        img {
            height: 26px;
            padding-left: 15px;
            display: inline-block;
            box-sizing: border-box;
            vertical-align: middle;
        }
        span {
            font-size: 20px;
            padding-left: 12px;
            display: inline-block;
            box-sizing: border-box;
            vertical-align: middle;
        }
    }
    .search {
        flex: 1;
        .search-input {
            -webkit-app-region: no-drag;
        }
    }
    .tool {
        width: 300px;
        .win-tool {
            width: 70px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            position: absolute;
            right: 20px;
            -webkit-app-region: no-drag;
            i {
                font-size: 13px;
                color: #e29595;
                cursor: pointer;
            }
            i:hover {
                color: #fff;
            }
        }
    }
}
</style>
