"use strict";

import { app, protocol, BrowserWindow, ipcMain, dialog, Menu } from "electron";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
const MusicStore = require("./common/js/MusicDataStore");
const myMusic = new MusicStore({ name: "iMusic" });
/*隐藏electron创听的菜单栏*/
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

import {
    createProtocol,
    /* installVueDevtools */
} from "vue-cli-plugin-electron-builder/lib";
const isDevelopment = process.env.NODE_ENV !== "production";

let win;

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
        win.loadURL("app://./index.html");
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
    win.webContents.on("did-finish-load", () => {
        win.send("getTracks", myMusic.getTracks());
    });
    installExtension(VUEJS_DEVTOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log("An error occurred: ", err));
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

require("./neteaseCloudMusic");
