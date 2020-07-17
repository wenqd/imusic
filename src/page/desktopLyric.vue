<template>
    <div class="lyric">
        <div>
            <i class="icon-close ifont icon-close" @click="closeWindow"></i>
        </div>
        <div class="text">
            {{ lyric }}
        </div>
    </div>
</template>
<script>
const { ipcRenderer } = window.require("electron");
export default {
    name:'DesktopLyric',
    data(){
        return {
            lyric:""
        }
    },
    computed:{
    },
    mounted(){
        let v_this = this
        setInterval(function(){
            v_this.lyric =  window.localStorage.getItem("currlyric")
        },50)
    },
    methods:{
        closeWindow(){
            ipcRenderer.send("closewindow-Lyric");
        }
    }
}
</script>
<style>
html, body {
    background: rgba(0, 0, 0, 0.2) !important;
}
</style>
<style lang="scss" scoped>
    .lyric{
        display: flex;
        justify-content:center;
        align-items: center;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        -webkit-app-region: drag;
        border: 1px dashed #aaa9a9;
        .icon-close{
            position: absolute;
            top: 5px;
            right: 15px;
            -webkit-app-region: no-drag;
        }
        .text{
            text-align: center;
            font-size: 35px;
            letter-spacing: 8px;
        }
    }
</style>