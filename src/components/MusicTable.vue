<template>
    <div class="music-table">
        <div class="music">
            <div v-show="allTracks.length > 0" style="width: 100%">
                <div class="playAll">
                    <a-button
                        size="small"
                        icon="play-circle"
                        >播放全部</a-button
                    >
                    <a-input-search
                        size="small"
                        placeholder="搜索本地音乐"
                        class="search-input"
                        @change="onSearch"
                    />
                </div>
                <vxe-table
                    class="music-table"
                    ref="MusicTable"
                    stripe
                    size="mini"
                    border="inner"
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
                    <vxe-table-column type="seq" width="50"></vxe-table-column>
                    <vxe-table-column
                        title="音乐标题"
                        :show-overflow-tooltip="true"
                    >
                        <template slot-scope="scope">
                            <div>
                                <i
                                    v-show="music.id == scope.row.id"
                                    class="play-now ifont icon-laba"
                                ></i>
                                {{ scope.row.title || scope.row.fileName }}
                            </div>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column
                        field="artist"
                        title="歌手"
                        width="200"
                        :show-overflow-tooltip="true"
                    ></vxe-table-column>
                    <vxe-table-column
                        field="album"
                        title="专辑"
                        :show-overflow-tooltip="true"
                    ></vxe-table-column>
                    <vxe-table-column
                        field="filePath"
                        title="路径"
                        :show-overflow-tooltip="true"
                    ></vxe-table-column>
                    <vxe-table-column
                        title="图片"
                        width="50"
                        :show-overflow-tooltip="true"
                    >
                        <template slot-scope="scope">
                            <img
                                v-if="false"
                                :src="getImgUrl(scope.row)"
                                style="width:22px;height:22px;"
                                alt="专辑图片"
                            />
                        </template>
                    </vxe-table-column>
                </vxe-table>
            </div>
        </div>
    </div>
</template>

<script>
const { ipcRenderer } = window.require("electron");
export default {
    name: "MusicTable",
    data() {
        return {
            music: this.currMusic,
            tableMenu: {
                body: {
                    options: [
                        [
                            {
                                code: "play",
                                name: "播放",
                                prefixIcon: "ifont icon-1_music73",
                                className: "tableMenu-item"
                            }
                        ],
                        [
                            {
                                code: "remove",
                                name: "从列表中删除",
                                prefixIcon: "ifont icon-shanchu",
                                className: "tableMenu-item"
                            }
                        ]
                    ]
                }
            }
        };
    },
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
        tracks: {
            //当前音乐
            type: Array,
            default: () => {
                return [];
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
        currMusic(data) {
            this.music = data;
        }
    },
    methods: {
        handleDbClickChange({ row }) {
            this.music = row;
            this.$emit("change", row);
        },
        //右键菜单点击事件
        contextMenuClickEvent({ menu, row, column }) {
            switch (menu.code) {
                case "play":
                    // 播放
                    if (row && column) {
                        this.music = null;
                        this.music = row;
                        this.$emit("change", row);
                    }
                    break;
                case "remove":
                    //删除
                    if (row && column&&row.source!=="neteaseCloud") {
                        ipcRenderer.send("delete-track", row.id);
                    }
                    break;
                default:
                    this.$XModal.message(`点击了 ${menu.name} 选项`);
            }
        },
        //本地音乐搜索
        onSearch({ data }) {
            if (data === null) {
                this.tracks = this.allTracks;
                return;
            }
            this.tracks = this.allTracks.filter(item => {
                if (item.fileName) {
                    if (item.fileName.indexOf(data) > -1) {
                        return true;
                    } else {
                        return false;
                    }
                }
            });
        }
    }
};
</script>

<style lang="scss">
//表格行高
#main /deep/ .vxe-table .vxe-body--column,
.vxe-table .vxe-footer--column,
.vxe-table .vxe-header--column {
    line-height: 26px;
}
//表格行高
#main /deep/ .vxe-table.size--mini .vxe-body--column.col--ellipsis,
.vxe-table.size--mini .vxe-footer--column.col--ellipsis,
.vxe-table.size--mini .vxe-header--column.col--ellipsis,
.vxe-table.vxe-editable.size--mini .vxe-body--column {
    height: 26px;
}
//表格表头高度
#main /deep/ .vxe-table.size--mini .vxe-body--column:not(.col--ellipsis),
.vxe-table.size--mini .vxe-footer--column:not(.col--ellipsis),
.vxe-table.size--mini .vxe-header--column:not(.col--ellipsis) {
    padding: 3px 0;
}
//右键菜单图标样式
.music-table /deep/ .vxe-context-menu--link .vxe-context-menu--link-prefix,
.vxe-context-menu--link .vxe-context-menu--link-suffix {
    top: 0;
}
.audio-process /deep/ .ant-progress-inner {
    background-color: #e1e1e1;
}
//搜索框宽度
.music-table .search-input /deep/ .ant-input-sm {
    border-radius: 45px !important;
    font-size: 12px;
    padding: 0 16px;
    border: 0.5px solid #e1e1e1;
}
</style>
<style lang="scss" scoped>
.music-table {
    .music {
        .empty-tmp {
            text-align: center;
            margin-top: 120px;
            .desc {
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 15px;
            }
            .slogan {
                font-size: 12px;
                margin-bottom: 35px;
                color: #888888;
            }
            button {
                height: 55px;
                width: 190px;
                border-radius: 4px;
                border: 0;
                background-color: #1167a8;
                color: #fff;
                font-size: 17px;
            }
        }
        .playAll {
            margin: 11px 15px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            .search-input {
                height: 26px;
                width: 160px;
            }
            button {
                background-color: #c62f2f;
                height: 32px;
                padding: 0 20px;
                color: #fff;
                border-color: #fff;
            }
            button:hover {
                border-color: #922323;
                background-color: #922323;
            }
        }
        .music-table {
            border-top: 0.5px solid #e1e1e1;
            .play-now {
                color: #c62f2f;
                margin-left: -25px;
                position: absolute;
            }
            .tableMenu-item {
                line-height: 30px;
            }
        }
    }
}
</style>
