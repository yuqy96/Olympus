const { fork } = require("child_process");
const path = require("path");

start();

async function start(dict)
{
    console.log("开始编译 Preloader.js");
    await run(wrapPath("../node_modules/typescript/bin/tsc"), wrapPath("../trunk/src/Preloader.ts"), "--outFile", wrapPath("../trunk/dist/Preloader.js"));
    console.log("开始丑化 Preloader.js ==> Preloader.min.js");
    await run(wrapPath("../node_modules/uglify-js/bin/uglifyjs"), wrapPath("../trunk/dist/Preloader.js"), "-o", wrapPath("../trunk/dist/Preloader.min.js"));
    console.log("开始编译 Olympus.js");
    await run(wrapPath("../node_modules/typescript/bin/tsc"), "-p", wrapPath("../trunk/tsconfig.json"));
    await run(wrapPath("../node_modules/typescript/bin/tsc"), "-p", wrapPath("../trunk/tsconfig_deploy.json"));
    console.log("开始丑化 Olympus.js ==> Olympus.min.js");
    await run(wrapPath("../node_modules/uglify-js/bin/uglifyjs"), wrapPath("../trunk/dist/Olympus.js"), "-o", wrapPath("../trunk/dist/Olympus.min.js"));
    console.log("开始编译 DOM.js");
    await run(wrapPath("../node_modules/typescript/bin/tsc"), "-p", wrapPath("../branches/dom/tsconfig.json"));
    console.log("开始丑化 DOM.js ==> DOM.min.js");
    await run(wrapPath("../node_modules/uglify-js/bin/uglifyjs"), wrapPath("../branches/dom/dist/DOM.js"), "-o", wrapPath("../branches/dom/dist/DOM.min.js"));
    console.log("开始编译 Egret.js");
    await run(wrapPath("../node_modules/typescript/bin/tsc"), "-p", wrapPath("../branches/egret/tsconfig.json"));
    await run(wrapPath("../node_modules/typescript/bin/tsc"), "-p", wrapPath("../branches/egret/tsconfig_deploy.json"));
    console.log("开始丑化 Egret.js ==> Egret.min.js");
    await run(wrapPath("../node_modules/uglify-js/bin/uglifyjs"), wrapPath("../branches/egret/dist/Egret.js"), "-o", wrapPath("../branches/egret/dist/Egret.min.js"));
    console.log("完成");
}

function run(cmd, ...args)
{
    return new Promise((resolve)=>{
        fork(cmd, args).on("close", resolve);
    });
}

function wrapPath(p)
{
    return path.resolve(__dirname, p);
}