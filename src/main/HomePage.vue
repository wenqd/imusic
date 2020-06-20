<template>
    <a-layout style="min-height: 100vh">
        <a-layout id="main">
            <a-layout-header class="header">
                <header-bar></header-bar>
            </a-layout-header>
            <a-layout-content class="content">
                <div class="group-list">
                    <a-menu
                        class="menu"
                        :openKeys="['sub1', 'sub2']"
                        :default-selected-keys="['1']"
                        :open-keys.sync="openKeys"
                        mode="inline"
                        @click="handleClick"
                    >
                        <a-sub-menu
                            key="sub1"
                            @titleClick="titleClick"
                            disabled
                        >
                            <span slot="title"><span>我的音乐</span></span>
                            <a-menu-item key="1">
                                <i class="ifont icon-ttpod" />本地音乐
                            </a-menu-item>
                        </a-sub-menu>
                        <a-sub-menu
                            key="sub2"
                            @titleClick="titleClick"
                            disabled
                        >
                            <span slot="title"><span>网易云音乐</span></span>
                            <a-menu-item key="3">
                                <i class="ifont icon-playlist" />我的歌单
                            </a-menu-item>
                            <a-menu-item key="4">
                                <i class="ifont icon-top" />Top 50
                            </a-menu-item>
                        </a-sub-menu>
                    </a-menu>
                </div>
                <div class="content-r">
                    <local-music></local-music>
                </div>
            </a-layout-content>
            <a-layout-footer class="footer">
                <music-play
                    :currMusic="$store.state.currMusic"
                    :allTracks="$store.state.allTracks"
                ></music-play>
                <i class="suofang ifont icon-suofang"></i>
            </a-layout-footer>
        </a-layout>
    </a-layout>
</template>
<script>
const axios = require("axios");
import HeaderBar from "../components/HeaderBar";
import MusicPlay from "../components/MusicPlay";
import LocalMusic from "../page/LocalMusic";
axios
    .get("http://127.0.0.1:0723/song/url?id=33894312", {})
    .then(res => {
        console.log("数据是:", res);
    })
    .catch(e => {
        console.log(e);
    });
export default {
    data() {
        return {
            current: ["mail"],
            openKeys: ["sub1"]
        };
    },
    components: { HeaderBar, MusicPlay, LocalMusic },
    watch: {},
    methods: {
        handleClick(e) {
            console.log("click", e);
        },
        titleClick(e) {
            console.log("titleClick", e);
        }
    }
};
</script>
<style lang="scss">
#main /deep/ .ant-layout-header {
    padding: 0px;
}
#main /deep/ .ant-layout-footer {
    padding: 0px;
}
//submenu 颜色
.group-list /deep/ .ant-menu-item-disabled,
.ant-menu-submenu-disabled {
    cursor: default !important ;
}
.group-list
    /deep/
    .ant-menu-inline
    > .ant-menu-submenu
    > .ant-menu-submenu-title {
    line-height: 30px;
    height: 30px;
}
.group-list /deep/ .ant-menu-item-disabled > .ant-menu-submenu-title,
.ant-menu-submenu-disabled > .ant-menu-submenu-title {
    cursor: default !important ;
}
.group-list /deep/ .ant-menu-item-disabled > .ant-menu-submenu-title,
.ant-menu-submenu-disabled > .ant-menu-submenu-title span {
    color: #7f7f7f !important ;
    cursor: default;
    height: 30px;
    line-height: 30px;
}
.group-list /deep/ .ant-menu-submenu-arrow {
    display: none;
}
.group-list /deep/ .ant-menu {
    background: #f5f5f7;
}
.group-list /deep/.ant-menu-submenu > .ant-menu {
    background: #f5f5f7;
}
.group-list /deep/.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
    background-color: #e6e7ea;
    color: #000000;
}
.group-list /deep/.ant-menu-item:hover {
    color: #000000;
}
.group-list /deep/.ant-menu-item,
.ant-menu-submenu-title {
    padding: 0 10px !important;
}
.group-list /deep/ .ant-menu-item,
.ant-menu-submenu-title [role="menuitem"] {
    padding: 0 30px !important;
}
.group-list /deep/ .ant-menu-inline .ant-menu-selected::after,
.ant-menu-inline .ant-menu-item-selected::after {
    transform: scaleY(1);
    opacity: 1;
    transition: transform 0.15s cubic-bezier(0.645, 0.045, 0.355, 1),
        opacity 0.15s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.group-list /deep/ .ant-menu-vertical .ant-menu-item::after,
.ant-menu-vertical-left .ant-menu-item::after,
.ant-menu-vertical-right .ant-menu-item::after,
.ant-menu-inline .ant-menu-item::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    border-right: 3px solid #c62f2f !important;
    transform: scaleY(0.0001);
    opacity: 0;
    transition: transform 0.15s cubic-bezier(0.215, 0.61, 0.355, 1),
        opacity 0.15s cubic-bezier(0.215, 0.61, 0.355, 1);
    content: "";
}
</style>
<style lang="scss" scoped>
#main {
    .header {
        height: 50px;
        background-color: #c62f2f;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        color: #fff;
        line-height: 50px;
        position: fixed;
        left: 0;
        right: 0;
        z-index: 9;
        -webkit-app-region: drag;
    }
    .content {
        background-color: #fafafa;
        position: absolute;
        top: 50px;
        bottom: 60px;
        left: 0;
        right: 0;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .group-list {
            width: 200px;
            border-right: 0.5px solid #e1e1e1;
            i {
                vertical-align: -0.125em;
                text-rendering: optimizeLegibility;
                -webkit-font-smoothing: antialiased;
                margin-right: 10px;
            }
            .menu {
                height: 100%;
            }
        }
        .content-r{
            flex: 1;
            overflow: auto;
        }
    }
    .footer {
        height: 60px;
        background-color: #f6f6f8;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 9;
        .suofang {
            position: absolute;
            bottom: 0px;
            right: 3px;
            font-size: 12px;
            color: #000;
            z-index: 999;
        }
    }
}
</style>
<style lang="scss">
/*滚动条的宽度*/

::-webkit-scrollbar {
    width: 9px;
    height: 9px;
}

/*外层轨道。可以用display:none让其不显示，也可以添加背景图片，颜色改变显示效果*/

::-webkit-scrollbar-track {
    width: 6px;
    background-color: #ffffff;
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 2em;
}

/*滚动条的设置*/

::-webkit-scrollbar-thumb {
    background-color: #e1e1e2;
    background-clip: padding-box;
    min-height: 28px;
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 2em;
}
/*滚动条移上去的背景*/

::-webkit-scrollbar-thumb:hover {
    background-color: #fff;
}
</style>
