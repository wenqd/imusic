const fs = require("fs");
const path = require("path");
const request = require("../public/util/request");
const { cookieToJson } = require("../public/util/index");

let obj = {};
fs.readdirSync(path.join(__dirname, "module"))
    .reverse()
    .forEach((file) => {
        if (!file.endsWith(".js")) return;
        let fileModule = require("../public/module/" + file);
        obj[file.split(".").shift()] = function(data) {
            if (typeof data.cookie === "string") {
                data.cookie = cookieToJson(data.cookie);
            }
            return fileModule(
                {
                    ...data,
                    cookie: data.cookie ? data.cookie : {},
                },
                request
            );
        };
    });

const express = require("express");
const bodyParser = require("body-parser");
//const packageJSON = require('./package.json')
//const exec = require('child_process').exec
const cache = require("../public/util/apicache").middleware;
// version check
/* exec('npm info NeteaseCloudMusicApi version', (err, stdout, stderr) => {
  if(!err){
    let version = stdout.trim()
    if(packageJSON.version < version){
      console.log(`最新版本: ${version}, 当前版本: ${packageJSON.version}, 请及时更新`)
    }
  }
}) */

const app_api = express();

// CORS & Preflight request
app_api.use((req, res, next) => {
    if (req.path !== "/" && !req.path.includes(".")) {
        res.set({
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Origin": req.headers.origin || "*",
            "Access-Control-Allow-Headers": "X-Requested-With,Content-Type",
            "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS",
            "Content-Type": "application/json; charset=utf-8",
        });
    }
    req.method === "OPTIONS" ? res.status(204).end() : next();
});

// cookie parser
app_api.use((req, res, next) => {
    (req.cookies = {}),
        (req.headers.cookie || "").split(/\s*;\s*/).forEach((pair) => {
            let crack = pair.indexOf("=");
            if (crack < 1 || crack == pair.length - 1) return;
            req.cookies[
                decodeURIComponent(pair.slice(0, crack)).trim()
            ] = decodeURIComponent(pair.slice(crack + 1)).trim();
        });
    next();
});

// body parser
app_api.use(bodyParser.json());
app_api.use(bodyParser.urlencoded({ extended: false }));

// cache
app_api.use(cache("2 minutes", (req, res) => res.statusCode === 200));

// static
app_api.use(express.static(path.join(__dirname, "public")));

// router
const special = {
    "daily_signin.js": "/daily_signin",
    "fm_trash.js": "/fm_trash",
    "personal_fm.js": "/personal_fm",
};
fs.readdirSync(path.join(__dirname, "module"))
    .reverse()
    .forEach((file) => {
        if (!file.endsWith(".js")) return;
        let route =
            file in special
                ? special[file]
                : "/" + file.replace(/\.js$/i, "").replace(/_/g, "/");
        let question = require("../public/module/" + file);
        app_api.use(route, (req, res) => {
            if (typeof req.query.cookie === "string") {
                req.query.cookie = cookieToJson(req.query.cookie);
            }
            let query = Object.assign(
                {},
                { cookie: req.cookies },
                req.query,
                req.body
            );

            question(query, request)
                .then((answer) => {
                    console.log("[OK]", decodeURIComponent(req.originalUrl));
                    res.append("Set-Cookie", answer.cookie);
                    res.status(answer.status).send(answer.body);
                })
                .catch((answer) => {
                    console.log("[ERR]", decodeURIComponent(req.originalUrl), {
                        status: answer.status,
                        body: answer.body,
                    });
                    if (answer.body.code == "301") answer.body.msg = "需要登录";
                    res.append("Set-Cookie", answer.cookie);
                    res.status(answer.status).send(answer.body);
                });
        });
    });

const port = process.env.PORT || "8989";
const host = process.env.HOST || "127.0.0.1";

app_api.server = app_api.listen(port, host, () => {
    console.log(`server running @ http://${host ? host : "localhost"}:${port}`);
});

export default app_api;
