<template>
  <a-layout  style="min-height: 100vh">
    <a-layout id="main">
      <a-layout-header class="header">
          <div class="logo">
              <img src="../assets/logo.png" alt="I-Music">
              <span>I Music</span>
          </div>
          <div class="search">
          </div>
          <div class="tool">
              <div class="win-tool">
                <i class="ifont icon-minimum" @click="winToolClick('min')"></i>
                <i class="ifont icon-maximize" @click="winToolClick('max')"></i>
                <i class="ifont icon-close" @click="winToolClick('close')"></i>
              </div>
          </div>
      </a-layout-header>
      <a-layout-content class="content">
        <div class="title">
            <div class="h_left">
                <h2>本地音乐</h2><span>共{{tracks.length}}首</span>
            </div>
            <div class="h_right">
                <a-button type="link" style="font-size: 11px;" @click="selectLocalMusic">添加本地音乐</a-button>
            </div>
        </div>
        <div class="music">
            <div  v-show="allTracks.length>0" style="width: 100%">
                <div class="playAll">
                    <a-button size="small" @click="selectLocalMusic" icon="play-circle">播放全部</a-button>
                    <a-input-search size="small" placeholder="搜索本地音乐" class="search-input" @change="onSearch"/>
                </div>
                <vxe-table class="music-table" 
                    ref="MusicTable"
                    stripe
                    size="mini"
                    highlight-current-row
                    highlight-hover-row
                    show-overflow
                    resizable
                    max-height="9999"
                    :data="tracks"
                    :context-menu="tableMenu"
                    @cell-dblclick="handleDbClickChange"
                    @context-menu-click="contextMenuClickEvent"
                    style="width: 100%"
                >
                    <vxe-table-column
                        type="seq"
                        width="50">
                    </vxe-table-column>
                    <vxe-table-column
                        title="音乐标题"
                        :show-overflow-tooltip="true"
                    >
                        <template slot-scope="scope">
                            <div><i v-show="currMusic.id == scope.row.id " class="play-now ifont icon-laba"></i>{{scope.row.title||scope.row.fileName}}</div>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column
                        field="artist"
                        title="歌手"
                        width="200"
                        :show-overflow-tooltip="true"
                    >
                    </vxe-table-column>
                    <vxe-table-column
                        field="album"
                        title="专辑"
                        :show-overflow-tooltip="true"
                    >
                    </vxe-table-column>
                    <vxe-table-column
                        field="filePath"
                        title="路径"
                        :show-overflow-tooltip="true"
                    >
                    </vxe-table-column>
                    <vxe-table-column
                        title="图片"
                        width="50"
                        :show-overflow-tooltip="true"
                    >
                         <template slot-scope="scope">
                            <img v-if="false" :src="getImgUrl(scope.row)" style="width:22px;height:22px;" alt="专辑图片" />
                        </template>
                    </vxe-table-column>
                </vxe-table>
            </div>
            <div v-if="allTracks.length==0" class="empty-tmp">
                <div class="desc">
                    请添加本地音乐
                </div>
                <div class="slogan">
                    爱我所爱&nbsp;&nbsp;&nbsp;&nbsp;听你想听
                </div>
                <div>
                    <a-button type="primary" @click="selectLocalMusic">添加本地音乐</a-button>
                </div>
            </div>
        </div>
      </a-layout-content>
      <a-layout-footer class="footer">
           <div class="audio">
                <div class="audio-tool">
                    <a-row>
                      <a-col :span="8">
                          <i class="ifont icon-1_music83" style="font-size: 30px;"
                             @click="changeMusic('pre')"
                          ></i>
                      </a-col>
                      <a-col :span="8">
                          <i :class="{'ifont':true,'icon-1_music73':!playStatus.isPlay,'icon-1_music87':playStatus.isPlay}" style="font-size: 40px;" 
                            @click="playPause"
                          ></i>
                      </a-col>
                      <a-col :span="8">
                          <i class="ifont icon-1_music82" style="font-size: 30px;"
                            @click="changeMusic('next')"
                          ></i>
                      </a-col>
                    </a-row>
                </div>
                <div class="audio-setting">
                    <div class="fengmian">
                        <img :class="{Rotation:playStatus.isPlay}" :src="currMusic.image||require('../assets/fengmian.png')" alt="专辑图片">
                    </div>
                    <div class="info">
                        <div class="title">
                            {{currMusic.title||'请选择播放音乐'}}
                        </div>
                        <div class="author">{{currMusic.artist}}</div>
                    </div>
                </div>
                <div class="audio-process">
                    <div class="start-time">
                        {{playStatus.currTime}}
                    </div>
                    <a-progress
                         class="progress"
                        :stroke-color="{
                            '0%': '#108ee9',
                            '100%': '#87d068',
                        }"
                        selection ={}
                        :percent="playStatus.percent"
                        :showInfo="false"
                    />
                    <div class="end-time">
                        {{playStatus.duration}}
                    </div>
                </div>
           </div>
        </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script>
const { ipcRenderer }  = window.require('electron')
import 'element-ui/lib/theme-chalk/index.css';
const fs  = window.require("fs");
const NodeID3 = require('node-id3')
let musicAudio = new Audio()
export default {
    data() {
        return {
            tableMenu:{
                body: {
                  options: [
                    [
                      { code: 'play', name: '播放', prefixIcon: 'ifont icon-1_music73', className: 'tableMenu-item' }
                    ],
                    [
                      { code: 'remove', name: '从列表中删除', prefixIcon: 'ifont icon-shanchu', className: 'tableMenu-item' },
                    ]
                  ]
                }
            },
            tracks:[],
            allTracks:[],//所有本地音乐
            currentRow: null,
            currMusic:{
                fileName:'暂无正在播放的音乐...'
            },//当前音乐
            playStatus:{//是否播放状态
                isPlay:false,
                duration:'0:00',
                currTime:'0:00',
                percent:0//百分比进度
            }
        };
        
    },
    mounted(){
        const v_this = this
        ipcRenderer.on("selected_file",(event,filesPath)=>{
            console.log(filesPath)
        })
        ipcRenderer.on("getTracks",(event,tracks)=>{
            v_this.allTracks = tracks;
            v_this.tracks = v_this.allTracks
            console.log(v_this.tracks)

        })
        musicAudio.addEventListener("loadedmetadata",()=>{
            v_this.playStatus.duration = this.timeToMinute(musicAudio.duration)
        })
        musicAudio.addEventListener("timeupdate",()=>{
            v_this.playStatus.currTime = this.timeToMinute(musicAudio.currentTime)
            if(v_this.playStatus.currTime===v_this.playStatus.duration){
                v_this.playStatus.isPlay=false
            }
            v_this.playStatus.percent = parseFloat((musicAudio.currentTime/musicAudio.duration)*100)
        })
    },
    watch:{
        currMusic:{
            handler(newval,oldval){
                if(!(this.currMusic.image)){
                    this.currMusic.image = this.getImgUrl(newval)
                }
                if(newval === oldval){
                    this.getImgUrl(newval)
                    this.playMusic(newval,false)
                }else{
                    this.playMusic(newval,true)
                }
            },
            deep:true
        },
    },
    methods:{
        selectLocalMusic(){
            ipcRenderer.send("open-dialog", "打开选择音乐窗口");
        },
        //菜单栏按钮处理
        winToolClick(type){
            if(type==="min"){
                //发送最小化命令
                ipcRenderer.send('window-min');
            }
            if(type==="max"){
                //发送最小化命令
                ipcRenderer.send('window-max');
            }
            if(type==="close"){
                //发送最小化命令
                ipcRenderer.send('window-close');
            }
        },
        handleDbClickChange({ row }) {
            this.currMusic = row;
        },
        //右键菜单点击事件
        contextMenuClickEvent ({ menu, row, column }) {
            switch (menu.code) {
            case 'play':
                // 播放
                if (row && column) {
                    this.currMusic = null;
                    this.currMusic = row;
                }
                break
            case 'remove':
                //删除
                if (row && column) {
                    ipcRenderer.send('delete-track',row.id)
                }
            break
            default:
                this.$XModal.message(`点击了 ${menu.name} 选项`)
            }
        },
        //本地音乐搜索
        onSearch({data}){
            if(data==""){
                this.tracks  = this.allTracks
                return
            }
            this.tracks  = this.allTracks.filter(item=>{
                if(item.fileName){
                    if(item.fileName.indexOf(data)>-1){
                        return true
                    }else{
                        return false
                    }
                }
            })
        },
        //播放暂停控制
        playPause(){
            if(this.playStatus.isPlay){
                musicAudio.pause()
                this.playStatus.isPlay=false;
            }else{
                if(musicAudio.src!==""){
                    musicAudio.play();
                    this.playStatus.isPlay=true;
                }
            }
        },
        //切换音乐
        changeMusic(type){
            const v_this = this
            let index = 0;
            this.tracks.map((item,k)=>{
                if(item.id===v_this.currMusic.id){
                    index = k
                }
            })
            if(type == "pre"){
                if(index === 0){
                    index = this.tracks.length
                }
                this.currMusic = this.tracks[index-1]
            }else if(type == "next"){
                if(index === this.tracks.length-1){
                    index = -1
                }
                this.currMusic = this.tracks[index+1]
            }
        },
        //读取音乐播放
        playMusic(music,bool){
            if(bool){
               //musicAudio.src = music.filePath;
                //获取本地json文件文件的路径
                // 读取本地文件
                musicAudio.src = fs.statSync(music.filePath);
                let data = fs.readFileSync(music.filePath);
                var musicBlob = new Blob([data], {type: 'audio/x-mpeg'})
                musicAudio.src = URL.createObjectURL(musicBlob)
                musicAudio.play()
            }
            musicAudio.play()
            this.playStatus.isPlay = true
        },
        //获取音乐专辑图片
        getImgUrl(music){
            if(music.filePath){
                let data = fs.readFileSync(music.filePath);
                let tags = NodeID3.read(data)
                if(tags.image){
                    var imgblob = new Blob([tags.image.imageBuffer])
                    var url = URL.createObjectURL(imgblob)
                    return url
                }else{
                    return require('../assets/fengmian.png')
                }
            }
        },
        // 秒转换分钟00:00:00格式
        timeToMinute(times){
            var t="";
            if(times > -1){
                //var hour = Math.floor(times/3600);
                var min = Math.floor(times/60) % 60;
                var sec = times % 60;
                /* if(hour < 10) {
                    t = '0'+ hour + ":";
                } else {
                    t = hour + ":";
                }
                */
                if(min < 10){t += "0";}
                t += min + ":";
                if(sec < 10){t += "0";}
                t += sec.toFixed(2);
            }
            t=t.substring(0,t.length-3);
            return t;
        }
    }
};
</script>
<style lang="scss">
#main  /deep/ .ant-layout-header{
    padding: 0px;
}
#main  /deep/ .ant-layout-footer{
    padding: 0px;
}
//表格行高
#main /deep/ .vxe-table .vxe-body--column, .vxe-table .vxe-footer--column, .vxe-table .vxe-header--column{
    line-height: 26px;
}
//表格行高
#main /deep/ .vxe-table.size--mini .vxe-body--column.col--ellipsis, .vxe-table.size--mini .vxe-footer--column.col--ellipsis, .vxe-table.size--mini .vxe-header--column.col--ellipsis, .vxe-table.vxe-editable.size--mini .vxe-body--column{
    height: 26px;
}
//表格表头高度
#main /deep/ .vxe-table.size--mini .vxe-body--column:not(.col--ellipsis), .vxe-table.size--mini .vxe-footer--column:not(.col--ellipsis), .vxe-table.size--mini .vxe-header--column:not(.col--ellipsis){
    padding: 3px 0;;
}
//右键菜单图标样式
.music-table /deep/ .vxe-context-menu--link .vxe-context-menu--link-prefix, .vxe-context-menu--link .vxe-context-menu--link-suffix{
    top: 0;
}
.audio-process /deep/ .ant-progress-inner{
    background-color: #e1e1e1;
}
//搜索框宽度
.search-input /deep/ .ant-input-sm{
    border-radius: 45px !important;
    font-size: 12px;
    padding: 0 16px;
    border: 0.5px solid #e1e1e1;
}
</style>
<style lang="scss" scoped>
#main{
    .header{
        height: 50px;
        background-color: #c62f2f;
        display: flex;
        flex-direction: row;
        justify-content:space-between;
        color: #fff;
        line-height: 50px;
        position: fixed;
        left: 0;
        right: 0;
        z-index: 9;
        -webkit-app-region: drag;
        .logo{
            width: 300px;
            img{
                height: 26px;
                padding-left: 15px;
                display: inline-block;
                box-sizing: border-box;
                vertical-align: middle;
            }
            span{
                font-size: 20px;
                padding-left: 12px;
                display: inline-block;
                box-sizing: border-box;
                vertical-align: middle;
            }
        }
        .search{
            flex: 1;
        }
        .tool{
            width: 300px;
            -webkit-app-region: no-drag;
            .win-tool{
                width: 70px;
                display: flex;
                flex-direction: row;
                justify-content:space-between;
                position: absolute;
                right: 20px;
                i{
                    font-size: 13px;
                    color: #e29595;
                    cursor: pointer;
                }
                i:hover{
                    color: #fff;
                }
            }
        }
    }
    .content{
        background-color: #fafafa;
        position: absolute;
        top: 50px;
        bottom: 60px;
        left: 0;
        right: 0;
        overflow: auto;
        .title{
            padding-top: 20px;
            border-bottom: 0.5px solid #e1e1e1;
            display: flex;
            flex-direction: row;
            justify-content:space-between;
            height: 55px;
            line-height: 38px;
            .h_left{
                h2{
                    display: inline-block;
                    padding: 0 12px 0 20px;
                    font-size: 17px;
                }
                span{
                    font-size: 12px;
                    color: #666666;
                }
            }
        }
        .music{
            .empty-tmp{
                text-align: center;
                margin-top: 120px;
                .desc{
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 15px;
                }
                .slogan{
                    font-size: 12px;
                    margin-bottom: 35px;
                    color: #888888;
                }
                button{
                    height: 55px;
                    width: 190px;
                    border-radius: 4px;
                    border: 0;
                    background-color: #1167a8;
                    color: #fff;
                    font-size: 17px;
                }
            }
            .playAll{
                margin: 11px 15px;
                display: flex;
                flex-direction: row;
                justify-content:space-between;
                .search-input{
                    height: 26px;
                    width: 160px;
                }
                button{
                    background-color: #c62f2f;
                    height: 32px;
                    padding: 0 20px;
                    color: #fff;
                     border-color: #FFF;
                }
                button:hover{
                    border-color: #922323;
                    background-color: #922323;
                }
            }
            .music-table{
               border-top: 0.5px solid #e1e1e1;
               .play-now{
                    color: #c62f2f;
                    margin-left: -25px;
                    position: absolute;
               }
               .tableMenu-item{
                   line-height: 30px;
               }
            }
        }
    }
    .footer{
        height: 60px;
        background-color: #f6f6f8;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 9;
        .audio{
            display: flex;
            flex-direction: row;
            justify-content:space-between;
            border-top: 1px solid #e1e1e1;
            margin-top: -1px;
            .audio-tool{
                width: 180px;
                text-align: center;
                padding: 0 15px;
                color: #c62f2f;
                div{
                    height: 60px;
                    line-height: 60px;
                }
                i{
                    cursor: pointer;
                }
            }
            .audio-process{
                flex: 1;
                padding: 18px 35px 0 20px;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                color:#000;
                .start-time{
                    text-align: center;
                    height: 24px;
                    line-height: 24px;
                    margin-right: 15px;
                }
                .end-time{
                    width: 40px;
                    text-align: center;
                    height: 24px;
                    line-height: 24px;
                    margin-left: 15px;
                }
                .progress{
                    flex:1
                }
            }
            .audio-setting{
                width: 160px;
                height: 60px;
                font-size: 12px;
                display: flex;
                flex-direction: row;
                div{
                    overflow:hidden;
                    white-space:nowrap;
                    text-overflow: ellipsis;
                }
                .fengmian{
                    line-height: 60px;
                    width: 35px;
                    margin-right: 10px;
                    img{
                        width: 33px;
                        height: 33px;
                        border-radius: 50%;
                    }
                }
                .info{
                    flex: 1;
                    .title{
                        color:#000000;
                        margin: 13px 0 1px;
                    }
                    .author{
                        color:#7d7d7d
                    }
                }
            }
        }
    }
}
@-webkit-keyframes rotation{
from {-webkit-transform: rotate(0deg);}
to {-webkit-transform: rotate(360deg);}
}

.Rotation{
-webkit-transform: rotate(360deg);
animation: rotation 5s linear infinite;
-moz-animation: rotation 5s linear infinite;
-webkit-animation: rotation 5s linear infinite;
-o-animation: rotation 5 linear infinite;
}
</style>
<style lang="scss">
    /*滚动条的宽度*/

    ::-webkit-scrollbar {
        width:9px;
        height:9px;
    }

/*外层轨道。可以用display:none让其不显示，也可以添加背景图片，颜色改变显示效果*/

    ::-webkit-scrollbar-track {
        width: 6px;
        background-color:#FFFFFF;
        -webkit-border-radius: 2em;
        -moz-border-radius: 2em;
        border-radius:2em;
    }

/*滚动条的设置*/

    ::-webkit-scrollbar-thumb {
        background-color:#e1e1e2;
        background-clip:padding-box;
        min-height:28px;
        -webkit-border-radius: 2em;
        -moz-border-radius: 2em;
        border-radius:2em;
    }
/*滚动条移上去的背景*/

    ::-webkit-scrollbar-thumb:hover {
         background-color:#fff;
    }
</style>
