<template>
    <div class="header">
        <div class="logo">
            <img src="../assets/logo.png" alt="I-Music" />
            <span>I Music</span>
        </div>
        <div class="search"></div>
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
export default {
    name: "HeaderBar",
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
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.header {
    .logo {
        width: 300px;
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
    }
    .tool {
        width: 300px;
        -webkit-app-region: no-drag;
        .win-tool {
            width: 70px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            position: absolute;
            right: 20px;
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
