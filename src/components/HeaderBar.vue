<template>
    <div class="header">
        <div class="logo">
            <img src="../assets/logo.png" alt="I-Music" />
            <span>{{ $store.state.musicstore.product }}</span>
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
            <div class="user">
                <div v-if="$store.state.userstore.profile.status == false">
                    <a-avatar icon="user" size="small" />
                    <a-button type="link" @click="openLoginPanel">
                        未登录
                    </a-button>
                    <a-icon type="caret-down" />
                </div>
                <div v-else>
                    <a-avatar
                        icon="user"
                        :src="$store.state.userstore.profile.avatarUrl"
                        size="small"
                    />
                    <a-popover title="" trigger="hover">
                        <template slot="content">
                            <a-button @click="logout">退出登陆</a-button>
                        </template>
                        <a-button type="link">
                            {{ $store.state.userstore.profile.nickname }}
                        </a-button>
                    </a-popover>
                    <a-icon type="caret-down" />
                </div>
            </div>
            <div class="win-tool">
                <i class="ifont icon-minimum" @click="winToolClick('min')"></i>
                <i class="ifont icon-maximize" @click="winToolClick('max')"></i>
                <i class="ifont icon-close" @click="winToolClick('close')"></i>
            </div>
        </div>
        <a-modal
            class="login-model"
            width="350px"
            v-model="loginVisible"
            title="登陆"
            :footer="null"
            @ok="login"
        >
            <a-form-model
                ref="loginform"
                class="login-form"
                style="padding:0 20px"
                :model="formData"
                :rules="rules"
            >
                <a-form-model-item validate-status="error">
                    <a-input
                        v-model="formData.phone"
                        id="error"
                        placeholder="请输入手机号"
                    >
                        <a-select
                            slot="addonBefore"
                            default-value="Http://"
                            style="width: 70px"
                        >
                            <a-select-option value="Http://">
                                +86
                            </a-select-option>
                            <a-select-option value="Https://">
                                +010
                            </a-select-option>
                        </a-select>
                    </a-input>
                </a-form-model-item>
                <a-form-model-item validate-status="error">
                    <a-input
                        v-model="formData.pwd"
                        id="error"
                        placeholder="请输入密码"
                        type="password"
                    >
                        <a-icon slot="prefix" type="key" />
                    </a-input>
                </a-form-model-item>
                <a-form-model-item validate-status="error">
                    <a-button
                        class="login-btn"
                        block
                        @click="login"
                        html-type="submit"
                        :disabled="formData.phone === '' || formData.pwd === ''"
                    >
                        登陆
                    </a-button>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>

<script>
const session = window.require("electron").remote.session;
const { ipcRenderer } = window.require("electron");
const axios = require("axios");
axios.defaults.withCredentials = true;
export default {
    name: "HeaderBar",
    data() {
        return {
            searchtext: "",
            loginVisible: false,
            formData: {
                phone: "",
                pwd: ""
            },
            rules: {
                phone: [
                    {
                        required: false,
                        message: "请输入手机号",
                        trigger: "blur"
                    }
                ],
                pwd: [
                    { required: false, message: "请输入密码", trigger: "blur" }
                ]
            }
        };
    },
    mounted() {
        this.getLoginStatus();
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
                this.$store.commit("musicstore/updateShowPanel", "search");
                axios
                    .get(
                        "http://127.0.0.1:8989/search?keywords=" +
                            this.searchtext,
                        {}
                    )
                    .then(res => {
                        console.log("数据是:", res);
                        if (res.data.code === 200) {
                            this.renderMusic(res.data.result);
                        }
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }
        },
        renderMusic(data) {
            let tracks = data.songs.map(item => {
                return {
                    id: item.id,
                    title: item.name,
                    duration: item.duration,
                    artist: item.artists[0].name,
                    fileName: item.name,
                    album: item.album.name,
                    source: "neteaseCloud"
                };
            });
            data.searchtext = this.searchtext;
            this.$store.commit("musicstore/updateSearchResult", data);
            this.$store.commit("musicstore/updateAllTracks", tracks);
        },
        //获取登陆状态
        getLoginStatus() {
            axios
                .get("http://127.0.0.1:8989/login/status", {})
                .then(res => {
                    console.log("登陆状态:", res);
                    if (res.data.code === 200) {
                        this.$store.commit(
                            "userstore/updateProfile",
                            res.data.profile
                        );
                    } else if (res.data.code === 301) {
                        this.$store.commit("userstore/updateProfile", {
                            status: false
                        });
                        console.log("登陆状态:", res.data.msg);
                    }
                })
                .catch(e => {
                    this.$store.commit("userstore/updateProfile", {
                        status: false
                    });
                    console.log(e);
                });
        },
        //打开登录面板
        openLoginPanel() {
            if (!this.loginVisible) {
                this.loginVisible = !this.loginVisible;
            }
        },
        //登陆
        login() {
            const v_this = this;
            this.$refs.loginform.validate(valid => {
                if (valid) {
                    axios
                        .get(
                            "http://127.0.0.1:8989/login/cellphone?phone=" +
                                this.formData.phone +
                                "&password=" +
                                this.formData.pwd +
                                "",
                            {}
                        )
                        .then(res => {
                            console.log("登陆结果:", res);
                            if (res.data.code === 200) {
                                this.$store.commit(
                                    "userstore/updateUser",
                                    res.data
                                );
                                this.getLoginStatus();
                                this.loginVisible = false;

                                //cookie
                                var cookies = res.data.cookie.split(";");
                                cookies.map(item => {
                                    v_this.setCookie(
                                        item.split("=")[0],
                                        item.split("=")[1]
                                    );
                                });
                            } else if (res.data.code === 502) {
                                this.$message.error(res.data.msg);
                            }
                        })
                        .catch(e => {
                            console.log(e);
                        });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        logout() {
            axios
                .get("http://127.0.0.1:8989/logout/", {})
                .then(res => {
                    console.log("退出结果:", res);
                    if (res.data.code === 200) {
                        this.cleanCookie()
                        this.getLoginStatus();
                    } else if (res.data.code === 502) {
                        this.$message.error(res.data.msg);
                    }
                })
                .catch(e => {
                    console.log(e);
                });
        },
        setCookie(name, value) {
            let Days = 30;
            let exp = new Date();
            let date = Math.round(exp.getTime() / 1000) + Days * 24 * 60 * 60;
            const cookie = {
                url: "http://127.0.0.1:723",
                name: name,
                value: value,
                expirationDate: date
            };
            session.defaultSession.cookies.set(cookie, error => {
                if (error) console.error(error);
            });
        },
        //清楚缓存
        cleanCookie(){
            session.defaultSession.clearStorageData({
            origin: this.webApi,
            storages: ['cookies']
            }, function (error) {
            if (error) console.error(error);
            })
        },
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
        width: 250px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        -webkit-app-region: no-drag;
        .user {
            flex: 1;
            color: #e1e1e1;
            text-align: right;
            margin-right: 20px;
            button {
                font-size: 12px;
                color: #e1e1e1;
                padding: 5px;
            }
            :hover {
                color: #fff;
            }
        }
        .win-tool {
            width: 85px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            padding: 0 19px 0 0;
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
.login-btn {
    background-color: #ea4848;
    color: #fff;
    :hover {
        background-color: #c62f2f;
    }
}
</style>
<style lang="scss">
.login-form /deep/ .ant-btn:hover,
.ant-btn:focus,
.ant-btn:active,
.ant-btn.active {
    background-color: #c62f2f;
    border-color: #fff;
    color: #fff;
}
</style>