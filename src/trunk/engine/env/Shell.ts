import { Injectable } from "../../core/injector/Injector";
import { core } from "../../core/Core";
import { load } from "../../utils/HTTPUtil";
import { environment } from "./Environment";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-23
 * @modify date 2017-10-23
 * 
 * 外壳接口，该类既作为外壳接口的注入基类，也作为标准浏览器的实现使用
*/
@Injectable
export default class Shell
{
    /**
     * 获取当前外壳类型
     * 
     * @readonly
     * @type {string}
     * @memberof Shell
     */
    public get type():string
    {
        return "web";
    }
    
    /*************************** 下面是页面跳转接口 ***************************/

    /**
     * 刷新页面
     * 
     * @param {{
     *         forcedReload?:boolean, // false表示允许从缓存取，true表示强制从服务器取，默认是false
     *         url?:string, // 传递则使用新URL刷新页面
     *         replace?:boolean // 如果有新url，则表示是否要替换当前浏览历史
     *     }} [params] 
     * @memberof Shell
     */
    public reload(params?:{
        forcedReload?:boolean,
        url?:string,
        replace?:boolean
    }):void
    {
        if(!params)
            window.location.reload();
        else if(!params.url)
            window.location.reload(params.forcedReload);
        else if(!params.replace)
            window.location.href = params.url;
        else
            window.location.replace(params.url);
    }

    /**
     * 打开一个新页面
     * 
     * @param {{
     *         url?:string, // 新页面地址，不传则不更新地址
     *         name?:string, // 给新页面命名，或导航到已有页面
     *         replace?:boolean, // 是否替换当前浏览历史条目，默认false
     *         features:{[key:string]:any} // 其他可能的参数
     *     }} [params] 
     * @memberof Shell
     */
    public open(params?:{
        url?:string,
        name?:string,
        replace?:boolean,
        features:{[key:string]:any}
    }):void
    {
        if(!params) 
        {
            window.open();
        }
        else
        {
            var features:string[] = undefined;
            if(params.features)
            {
                features = [];
                for(var key in params.features)
                {
                    features.push(key + "=" + params.features[key]);
                }
            }
            window.open(params.url, params.name, features && features.join(","), params.replace);
        }
    }

    /**
     * 关闭窗口
     * 
     * @memberof Shell
     */
    public close():void
    {
        window.close();
    }

    /*************************** 下面是本地存储接口 ***************************/

    /**
     * 获取本地存储
     * 
     * @param {string} key 要获取值的键
     * @returns {string} 获取的值
     * @memberof Shell
     */
    public localStorageGet(key:string):string
    {
        return window.localStorage.getItem(key);
    }

    /**
     * 设置本地存储
     * 
     * @param {string} key 要设置的键
     * @param {string} value 要设置的值
     * @memberof Shell
     */
    public localStorageSet(key:string, value:string):void
    {
        window.localStorage.setItem(key, value);
    }

    /**
     * 移除本地存储
     * 
     * @param {string} key 要移除的键
     * @memberof Shell
     */
    public localStorageRemove(key:string):void
    {
        window.localStorage.removeItem(key);
    }

    /**
     * 清空本地存储
     * 
     * @memberof Shell
     */
    public localStorageClear():void
    {
        window.localStorage.clear();
    }

    /*************************** 下面是音频接口 ***************************/

    private _context:AudioContext;
    private _inited:boolean = false;
    private _audioDict:{[url:string]:AudioData} = {};
    private _playingDict:{[url:string]:AudioPlayingData} = {};

    private initAudioContext():void
    {
        this._context = new (window["AudioContext"] || window["webkitAudioContext"])();
        var onInit:()=>void = ()=>{
            window.removeEventListener("touchstart", onInit);
            window.removeEventListener("mousedown", onInit);
            // 生成一个空的音频，播放并停止，用以解除限制
            var source: AudioBufferSourceNode = this._context.createBufferSource();
            source.buffer = this._context.createBuffer(1, 1, 44100);
            source.connect(this._context.destination);
            source.start();
            source.stop();
            // 设置标识符
            this._inited = true;
            // 如果当前有正在播放的音频，全部再播放一次
            for(var url in this._playingDict)
            {
                var playingData:AudioPlayingData = this._playingDict[url];
                // 停止播放
                this.audioStop(url);
                // 重新播放
                this.audioPlay(url, playingData.params);
            }
        };
        window.addEventListener("touchstart", onInit);
        window.addEventListener("mousedown", onInit);
    }

    /**
     * 加载音频
     * 
     * @param {string} url 音频URL
     * @memberof Shell
     */
    public audioLoad(url:string):void
    {
        // 调整为CDN地址
        url = environment.toCDNHostURL(url);
        // 尝试获取缓存数据
        var data:AudioData = this._audioDict[url];
        // 如果没有缓存才去加载
        if(!data)
        {
            // 记录数据
            this._audioDict[url] = data = {buffer:null, autoPlay:false, autoPlayParams: null, startTime: 0};
            // 开始加载
            load({
                url: url,
                responseType: "arraybuffer",
                onResponse: (result:ArrayBuffer) => {
                    this._context.decodeAudioData(result, (buffer:AudioBuffer)=>{
                        data.buffer = buffer;
                        // 如果自动播放则播放
                        if(data.autoPlay) this.audioPlay(url, data.autoPlayParams);
                    });
                }
            });
        }
    }

    /**
     * 播放音频，如果音频没有加载则先加载再播放
     * 
     * @param {string} url 音频URL
     * @param {AudioPlayParams} [params] 播放参数
     * @returns {void} 
     * @memberof Shell
     */
    public audioPlay(url:string, params?:AudioPlayParams):void
    {
        // 调整为CDN地址
        url = environment.toCDNHostURL(url);
        // 如果已经在播放了则什么都不做
        if(this._playingDict[url]) return;
        // 尝试获取缓存数据
        var data:AudioData = this._audioDict[url];
        if(!data)
        {
            // 没有加载过，开始加载音频
            this.audioLoad(url);
            // 设置自动播放
            this._audioDict[url].autoPlay = true;
            this._audioDict[url].autoPlayParams = params;
        }
        else if(!data.buffer)
        {
            // 正在加载中，只设置自动播放
            data.autoPlay = true;
        }
        else
        {
            // 是否停止其他声音
            if(params && params.stopOthers)
            {
                for(var url in this._playingDict)
                {
                    this.audioStop(url);
                }
            }
            // 已经加载完毕，直接播放
            let node: AudioBufferSourceNode = this._context.createBufferSource();
            node.buffer = data.buffer;
            node.loop = params && params.loop;
            node.connect(this._context.destination);
            if(this._inited) node.start((params && params.time) || data.startTime);
            // 记录正在播放的节点
            this._playingDict[url] = {node: node, params: params};
        }
    }

    private _audioStop(url:string, when?:number):void
    {
        // 调整为CDN地址
        url = environment.toCDNHostURL(url);
        // 如果没有在播放则什么都不做
        var playingData:AudioPlayingData = this._playingDict[url];
        if(!playingData) return;
        // 关掉正在播放的音频
        try
        {
            playingData.node.stop(when);
        }
        catch(err) {}
        delete this._playingDict[url];
        // 关掉缓存数据的自动播放功能
        var data:AudioData = this._audioDict[url];
        if(data) data.autoPlay = false;
    }
    
    /**
     * 暂停音频（不会重置进度）
     * 
     * @param {string} url 音频URL
     * @memberof Shell
     */
    public audioPause(url:string):void
    {
        this._audioStop(url);
    }
    
    /**
     * 停止音频（会重置进度）
     * 
     * @param {string} url 音频URL
     * @memberof Shell
     */
    public audioStop(url:string):void
    {
        this._audioStop(url, 0);
    }
    
    /**
     * 跳转音频进度
     * 
     * @param {string} url 音频URL
     * @param {number} time 要跳转到的音频位置，毫秒值
     * @memberof Shell
     */
    public audioSeek(url:string, time:number):void
    {
        // 调整为CDN地址
        url = environment.toCDNHostURL(url);
        // 判断是否正在播放
        var playingData:AudioPlayingData = this._playingDict[url];
        if(playingData)
        {
            playingData.node.stop();
            // 重新播放
            this.audioPlay(url, {time: time});
        }
        else
        {
            // 记录开启时间
            this._audioDict[url].startTime = time;
        }
    }

    /** 此项代表外壳接口可根据实际情况扩展基类没有的方法或属性 */
    [name:string]:any;
}

export interface AudioPlayParams
{
    /**
     * 播放启动的时间戳
     * 
     * @type {number}
     * @memberof AudioPlayParams
     */
    time?:number;
    /**
     * 是否循环，默认为false
     * 
     * @type {boolean}
     * @memberof AudioPlayParams
     */
    loop?:boolean;
    /**
     * 是否播放前关闭其他声音，默认为false
     * 
     * @type {boolean}
     * @memberof AudioPlayParams
     */
    stopOthers?:boolean;
}

interface AudioData
{
    /**
     * 音频的缓存数据
     * 
     * @type {AudioBuffer}
     * @memberof AudioData
     */
    buffer:AudioBuffer;
    /**
     * 是否自动播放
     * 
     * @type {boolean}
     * @memberof AudioData
     */
    autoPlay:boolean;
    /**
     * 自动播放参数
     * 
     * @type {AudioPlayParams}
     * @memberof AudioData
     */
    autoPlayParams:AudioPlayParams;
    /**
     * 开始时间戳
     * 
     * @type {number}
     * @memberof AudioData
     */
    startTime:number;
}

interface AudioPlayingData
{
    /**
     * 正在播放的音频节点
     * 
     * @type {AudioBufferSourceNode}
     * @memberof AudioPlayingData
     */
    node:AudioBufferSourceNode;
    /**
     * 播放参数
     * 
     * @type {AudioPlayParams}
     * @memberof AudioPlayingData
     */
    params:AudioPlayParams;
}

/** 初始化音频系统，为具有权限限制的系统解除音频限制 */
var shell:Shell = core.getInject(Shell);
shell["initAudioContext"]();
/** 再额外导出一个单例 */
export { shell };