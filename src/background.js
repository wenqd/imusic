"use strict";

import { app,screen, protocol, BrowserWindow, ipcMain, dialog, Menu,Tray } from "electron";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import path from 'path'
const MusicStore = require("./common/js/MusicDataStore");
const myMusic = new MusicStore({ name: "iMusic" });
/*隐藏electron创建的菜单栏*/
console.info("平台:"+process.platform)
if (process.platform === "darwin") {
    let template = [
        {
            label: "文件",
            submenu: [
                {
                    label: "退出",
                    click: () => {
                        console.log("我点击了退出");
                        app.quit();
                    },
                },
            ],
        },
        {
            label: "关于",
            submenu: [
                {
                    label: "关于我们",
                    click: () => {
                        console.log("我点击了关于我们");
                        dialog.showMessageBox({
                            title: "关于我们",
                            type: "info",
                            detail:"by wenqd",
                            message: "IMusic 音乐播放器 爱我所爱,听你想听",
                        });
                    },
                },
                {
                    label: "开发者工具",
                    click: () => {
                        console.log("我点击了开发者工具");
                        win.webContents.openDevTools();
                    },
                },
                {
                    label: "刷新页面",
                    click: () => {
                        console.log("我点击了刷新页面");
                        win.reload()
                    },
                },
    
            ],
        },
    ];
    
    let m = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(m);
}

import {
    createProtocol,
    /* installVueDevtools */
} from "vue-cli-plugin-electron-builder/lib";
const isDevelopment = process.env.NODE_ENV !== "production";
console.log("环境："+process.env)

let win;
let lyricWindow;
protocol.registerSchemesAsPrivileged([
    { scheme: "app", privileges: { secure: true, standard: true } },
]);
// 针对Mac端的一些配置
let isFrame = false;
if (process.platform === "darwin") {
    isFrame = true
}
function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 990,
        height: 700,
        frame: isFrame,
        transparent:true,
        webPreferences: {
            nodeIntegration: true, //process.env.ELECTRON_NODE_INTEGRATION
        },
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
        if (!process.env.IS_TEST) win.webContents.openDevTools();
    } else {
        createProtocol("app");
        // Load the index.html when not in development
        win.loadURL("http://localhost:8080");
    }

    win.on("closed", () => {
        win = null;
    });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});
ipcMain.on("open-dialog", (event, msg) => {
    console.log(msg);
    dialog
        .showOpenDialog({
            properties: ["openFile", "multiSelections"],
            filters: [{ name: "Music", extensions: ["mp3", "WAV", "WMA", "flac"] }],
        })
        .then(function(tracks) {
            myMusic.addTracks(tracks.filePaths);
            console.log("持久化音乐列表数据");
            win.send("getTracks", myMusic.getTracks());
        });
});
//删除音乐
ipcMain.on("delete-track", (event, deleteId) => {
    const updateTracks = myMusic.deleteTrack(deleteId).getTracks();
    win.send("getTracks", updateTracks);
});
//查看引用
ipcMain.on("view-track", (event) => {
    const tracks = myMusic.getTracks();
    win.send("getTracks", tracks);
});
app.on("ready", async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        //
    }
    createWindow();
    setTray();//创建托盘
    win.webContents.on("did-finish-load", () => {
        win.send("getTracks", myMusic.getTracks());
    });
    /* installExtension(VUEJS_DEVTOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log("An error occurred: ", err)); */
        setTimeout(()=>{
            BrowserWindow.addDevToolsExtension('C:/Users/wen/AppData/Local/Google/Chrome/User Data/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/5.3.3_0');
        },500)
});
//接收最小化命令
ipcMain.on("window-min", function() {
    win.minimize();
});
//接收最大化命令
ipcMain.on("window-max", function() {
    if (win.isMaximized()) {
        win.restore();
    } else {
        win.maximize();
    }
});
//接收关闭命令
ipcMain.on("window-close", function() {
    win.close();
});
//接收隐藏任务栏命令
ipcMain.on("window-hide", function() {
    win.hide()
});
//接收新建歌词窗口命令
ipcMain.on("newwindow-Lyric", function() {
    let width = screen.getPrimaryDisplay().workAreaSize.width
    let height = screen.getPrimaryDisplay().workAreaSize.height
    lyricWindow = new BrowserWindow({
        width: 1200,
        height: 100,
        x:(width-1200)/2,//设置坐标
        y:height-200,
        frame: false,
        resizable:true,
        transparent:true,
        webPreferences: {
            nodeIntegration: true, //process.env.ELECTRON_NODE_INTEGRATION
        },
    });
    lyricWindow.loadURL("http://localhost:8080#/lyric");
});
//接收关闭歌词窗口命令
ipcMain.on("closewindow-Lyric", function() {
    lyricWindow.close()
});
// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === "win32") {
        process.on("message", (data) => {
            if (data === "graceful-exit") {
                app.quit();
            }
        });
    } else {
        process.on("SIGTERM", () => {
            app.quit();
        });
    }
}
let appTray = null;   // 引用放外部，防止被当垃圾回收
// 隐藏主窗口，并创建托盘，绑定关闭事件
function setTray () {
    //  ，通常被添加到一个 context menu 上.
    // 系统托盘右键菜单
    let trayMenuTemplate = [{     // 系统托盘图标目录
        label: '退出',
        click: function () {
            app.quit();
        }
    }];
    // 当前目录下的app.ico图标
    let iconPath = path.join(__dirname, '../public/logo.ico');
    appTray = new Tray(iconPath);
    // 图标的上下文菜单
    const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
    // 设置托盘悬浮提示
    appTray.setToolTip('爱我所爱 听你想听');
    // 设置托盘菜单
    appTray.setContextMenu(contextMenu);
    // 单击托盘小图标显示应用
    appTray.on('click', function(){
        // 显示主程序
        win.show();
        // 关闭托盘显示
        //appTray.destroy();
    });
}
require("./neteaseCloudMusic");
