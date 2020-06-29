const axios = require("axios");

const musicstore = {
    namespaced: true,
    state: {
        api:'http://127.0.0.1:8989',
        product: "I Music",
        currMusic: {
            fileName: "暂无正在播放的音乐...",
        }, //当前音乐
        allTracks: [],
        playStatus: {},
        searchResult: {
            songCount: 0,
            songs: [],
        },
        playList:[],//歌单列表
        showPanel: "online", //显示的面板
    },
    mutations: {
        updateCurrMusic(state, music) {
            if (music.source === "neteaseCloud") {
                //网易云音乐
                axios
                    .get(
                        state.api+"/song/detail?ids=" + music.id,
                        {}
                    )
                    .then((res) => {
                        console.log("数据是:", res);
                        if (res.data.code === 200) {
                            if (res.data.songs.length > 0) {
                                const track = res.data.songs[0];
                                music = {
                                    id: track.id,
                                    title: track.name,
                                    duration: track.duration,
                                    artist: track.ar[0].name,
                                    fileName: track.name,
                                    album: track.al.name,
                                    source: "neteaseCloud",
                                    image: track.al.picUrl,
                                };
                                state.currMusic = music;
                            } else {
                                state.currMusic = music;
                            }
                        }
                    })
                    .catch((e) => {
                        state.currMusic = music;
                    });
            } else {
                state.currMusic = music;
            }
        },
        updatePlayList(state, tracks,playList){
            state.playList = playList;
        },
        updateAllTracks(state, tracks) {
            state.allTracks = tracks;
        },
        updateSearchResult(state, data) {
            state.searchResult = data;
        },
        updateShowPanel(state, data) {
            state.showPanel = data;
        },
    },
};
export default musicstore