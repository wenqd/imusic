import { ipcRenderer } from 'electron'
export default {
    data() {
        return {
        collapsed: false,
        };
    },
    methods:{
        selectLocalMusic(){
            ipcRenderer.send("open-music-panel", "打开选择音乐窗口");
        }
    }
};