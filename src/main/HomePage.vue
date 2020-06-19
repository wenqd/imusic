<template>
  <a-layout  style="min-height: 100vh">
    <a-layout id="main">
      <a-layout-header class="header">
          <header-bar></header-bar>
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
           <music-play :currMusic="currMusic" :playStatus="playStatus" :allTracks="allTracks"></music-play>
        </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script>
const { ipcRenderer }  = window.require('electron')
import 'element-ui/lib/theme-chalk/index.css';
const axios = require('axios')
import HeaderBar from '../components/HeaderBar'
import MusicPlay from '../components/MusicPlay'
axios
  .get('http://127.0.0.1:3000/song/url?id=33894312',{
   })
  .then(res => {
    console.log('数据是:', res);
  })
  .catch((e) => {
    console.log(e);
  });
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
    components:{HeaderBar,MusicPlay},
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
    },
    watch:{
    },
    methods:{
        selectLocalMusic(){
            ipcRenderer.send("open-dialog", "打开选择音乐窗口");
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
            if(data===null){
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
