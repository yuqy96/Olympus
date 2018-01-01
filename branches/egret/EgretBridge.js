/// <amd-module name="EgretBridge"/>
import { core } from "olympus-r/core/Core";
import ModuleMessage from "olympus-r/engine/module/ModuleMessage";
import RenderMode from "./egret/RenderMode";
import AssetsLoader from "./egret/AssetsLoader";
import BackPanelPolicy from "./egret/panel/BackPanelPolicy";
import FadeScenePolicy from "./egret/scene/FadeScenePolicy";
import MaskEntity from "./egret/mask/MaskEntity";
import { wrapEUIList } from "./egret/utils/UIUtil";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-18
 * @modify date 2017-09-18
 *
 * Egret的表现层桥实现，当前Egret版本：5.0.7
*/
var EgretBridge = /** @class */ (function () {
    function EgretBridge(params) {
        /**
         * 默认弹窗策略
         *
         * @type {IPanelPolicy}
         * @memberof EgretBridge
         */
        this.defaultPanelPolicy = new BackPanelPolicy();
        /**
         * 默认场景切换策略
         *
         * @type {IScenePolicy}
         * @memberof EgretBridge
         */
        this.defaultScenePolicy = new FadeScenePolicy();
        this._initParams = params;
    }
    Object.defineProperty(EgretBridge.prototype, "type", {
        /**
         * 获取表现层类型名称
         *
         * @readonly
         * @type {string}
         * @memberof EgretBridge
         */
        get: function () {
            return EgretBridge.TYPE;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EgretBridge.prototype, "htmlWrapper", {
        /**
         * 获取表现层HTML包装器，可以对其样式进行自定义调整
         *
         * @readonly
         * @type {HTMLElement}
         * @memberof EgretBridge
         */
        get: function () {
            return this._initParams.container;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EgretBridge.prototype, "root", {
        /**
         * 获取根显示节点
         *
         * @readonly
         * @type {egret.DisplayObjectContainer}
         * @memberof EgretBridge
         */
        get: function () {
            return this._root;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EgretBridge.prototype, "stage", {
        /**
         * 获取舞台引用
         *
         * @readonly
         * @type {egret.Stage}
         * @memberof EgretBridge
         */
        get: function () {
            return this._stage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EgretBridge.prototype, "bgLayer", {
        /**
         * 获取背景容器
         *
         * @readonly
         * @type {egret.DisplayObjectContainer}
         * @memberof EgretBridge
         */
        get: function () {
            return this._bgLayer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EgretBridge.prototype, "sceneLayer", {
        /**
         * 获取场景容器
         *
         * @readonly
         * @type {egret.DisplayObjectContainer}
         * @memberof EgretBridge
         */
        get: function () {
            return this._sceneLayer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EgretBridge.prototype, "frameLayer", {
        /**
         * 获取框架容器
         *
         * @readonly
         * @type {egret.DisplayObjectContainer}
         * @memberof EgretBridge
         */
        get: function () {
            return this._frameLayer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EgretBridge.prototype, "panelLayer", {
        /**
         * 获取弹窗容器
         *
         * @readonly
         * @type {egret.DisplayObjectContainer}
         * @memberof EgretBridge
         */
        get: function () {
            return this._panelLayer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EgretBridge.prototype, "maskLayer", {
        /**
         * 获取遮罩容器
         *
         * @readonly
         * @type {egret.DisplayObjectContainer}
         * @memberof EgretBridge
         */
        get: function () {
            return this._maskLayer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EgretBridge.prototype, "topLayer", {
        /**
         * 获取顶级容器
         *
         * @readonly
         * @type {egret.DisplayObjectContainer}
         * @memberof EgretBridge
         */
        get: function () {
            return this._topLayer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EgretBridge.prototype, "promptClass", {
        /**
         * 获取通用提示框
         *
         * @readonly
         * @type {IPromptPanelConstructor}
         * @memberof EgretBridge
         */
        get: function () {
            return this._initParams.promptClass;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EgretBridge.prototype, "maskEntity", {
        /**
         * 获取遮罩实体
         *
         * @readonly
         * @type {IMaskEntity}
         * @memberof EgretBridge
         */
        get: function () {
            return new MaskEntity(this._initParams.maskData);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 初始化表现层桥
     * @param {()=>void} complete 初始化完毕后的回调
     * @memberof EgretBridge
     */
    EgretBridge.prototype.init = function (complete) {
        // 生成html和body的样式节点
        var style = document.createElement("style");
        style.textContent = "\n            html, body {\n                -ms-touch-action: none;\n                background: " + egret.toColorString(this._initParams.backgroundColor || 0) + ";\n                padding: 0;\n                border: 0;\n                margin: 0;\n                height: 100%;\n            }\n        ";
        document.head.appendChild(style);
        // 统一容器
        if (typeof this._initParams.container == "string") {
            this._initParams.container = document.querySelector(this._initParams.container);
        }
        if (!this._initParams.container) {
            this._initParams.container = document.createElement("div");
            document.body.appendChild(this._initParams.container);
        }
        var container = this._initParams.container;
        // 构建容器参数
        container.style.margin = "auto";
        container.style.width = "100%";
        container.style.height = "100%";
        container.className = "egret-player";
        container.setAttribute("data-entry-class", "__EgretRoot__");
        container.setAttribute("data-orientation", "auto");
        container.setAttribute("data-scale-mode", this._initParams.scaleMode || egret.StageScaleMode.FIXED_NARROW);
        container.setAttribute("data-frame-rate", (this._initParams.frameRate || 60) + "");
        container.setAttribute("data-content-width", this._initParams.width + "");
        container.setAttribute("data-content-height", this._initParams.height + "");
        container.setAttribute("data-show-paint-rect", (this._initParams.showPaintRect || false) + "");
        container.setAttribute("data-multi-fingered", (this._initParams.multiFingered || 2) + "");
        container.setAttribute("data-show-fps", (this._initParams.showFPS || false) + "");
        container.setAttribute("data-show-fps-style", this._initParams.showFPSStyle || "x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.9");
        container.setAttribute("data-show-log", (this._initParams.showLog || false) + "");
        // 构建__EgretRoot__类，使得Egret引擎可以通过window寻址的方式找到该类，同时又可以让其将控制权转交给Application
        var self = this;
        window["__EgretRoot__"] = function () {
            eui.UILayer.call(this);
            this.touchEnabled = false;
        };
        window["__EgretRoot__"].prototype = new eui.UILayer();
        window["__EgretRoot__"].prototype.$onAddToStage = function (stage, nestLevel) {
            // 调用父类方法
            eui.UILayer.prototype.$onAddToStage.call(this, stage, nestLevel);
            // 移除引用
            delete window["__EgretRoot__"];
            // 将控制权移交给Application对象
            onRootInitialized(this);
        };
        // 根据渲染模式初始化Egret引擎
        switch (this._initParams.renderMode) {
            case RenderMode.WEBGL:
                initEgret("webgl");
                break;
            case RenderMode.CANVAS:
            default:
                initEgret("canvas");
                break;
        }
        function initEgret(renderMode) {
            // 启动Egret引擎
            egret.runEgret({
                renderMode: renderMode,
                audioType: 0
            });
        }
        function onRootInitialized(root) {
            self._root = root;
            self._stage = root.stage;
            // 创建背景显示层
            self._bgLayer = new eui.UILayer();
            self._bgLayer.touchEnabled = false;
            root.addChild(self._bgLayer);
            // 创建场景显示层
            self._sceneLayer = new eui.UILayer();
            self._sceneLayer.touchEnabled = false;
            root.addChild(self._sceneLayer);
            // 创建框架显示层
            self._frameLayer = new eui.UILayer();
            self._frameLayer.touchEnabled = false;
            root.addChild(self._frameLayer);
            // 创建弹出层
            self._panelLayer = new eui.UILayer();
            self._panelLayer.touchEnabled = false;
            root.addChild(self._panelLayer);
            // 创建遮罩层
            self._maskLayer = new eui.UILayer();
            self._maskLayer.touchEnabled = false;
            root.addChild(self._maskLayer);
            // 创建顶级显示层
            self._topLayer = new eui.UILayer();
            self._topLayer.touchEnabled = false;
            root.addChild(self._topLayer);
            // 设置资源和主题适配器
            egret.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
            egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter(self._initParams));
            // 加载资源配置
            RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, onConfigComplete, self);
            RES.loadConfig(self._initParams.pathPrefix + "resource/default.res.json", self._initParams.pathPrefix + "resource/");
        }
        function onConfigComplete(evt) {
            RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, onConfigComplete, self);
            // 加载主题配置
            var theme = new eui.Theme(this._initParams.pathPrefix + "resource/default.thm.json", self._root.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, onThemeLoadComplete, self);
        }
        function onThemeLoadComplete(evt) {
            evt.target.removeEventListener(eui.UIEvent.COMPLETE, onThemeLoadComplete, self);
            // 加载预加载资源组
            var preloadGroups = this._initParams.preloadGroups;
            self.loadAssets(preloadGroups, null, function (err) { return complete(self); });
        }
    };
    /**
     * 判断皮肤是否是Egret显示对象
     *
     * @param {*} skin 皮肤对象
     * @returns {boolean} 是否是Egret显示对象
     * @memberof EgretBridge
     */
    EgretBridge.prototype.isMySkin = function (skin) {
        return (skin instanceof egret.DisplayObject);
    };
    /**
     * 创建一个空的显示对象
     *
     * @returns {egret.Sprite}
     * @memberof EgretBridge
     */
    EgretBridge.prototype.createEmptyDisplay = function () {
        return new egret.Sprite();
    };
    /**
     * 添加显示
     *
     * @param {egret.DisplayObjectContainer} parent 要添加到的父容器
     * @param {egret.DisplayObject} target 被添加的显示对象
     * @return {egret.DisplayObject} 返回被添加的显示对象
     * @memberof EgretBridge
     */
    EgretBridge.prototype.addChild = function (parent, target) {
        if (parent && target)
            return parent.addChild(target);
        else
            return target;
    };
    /**
     * 按索引添加显示
     *
     * @param {egret.DisplayObjectContainer} parent 要添加到的父容器
     * @param {egret.DisplayObject} target 被添加的显示对象
     * @param {number} index 要添加到的父级索引
     * @return {egret.DisplayObject} 返回被添加的显示对象
     * @memberof EgretBridge
     */
    EgretBridge.prototype.addChildAt = function (parent, target, index) {
        if (parent && target)
            return parent.addChildAt(target, index);
        else
            return target;
    };
    /**
     * 移除显示对象
     *
     * @param {egret.DisplayObjectContainer} parent 父容器
     * @param {egret.DisplayObject} target 被移除的显示对象
     * @return {egret.DisplayObject} 返回被移除的显示对象
     * @memberof EgretBridge
     */
    EgretBridge.prototype.removeChild = function (parent, target) {
        if (parent && target && target.parent === parent)
            return parent.removeChild(target);
        else
            return target;
    };
    /**
     * 按索引移除显示
     *
     * @param {egret.DisplayObjectContainer} parent 父容器
     * @param {number} index 索引
     * @return {egret.DisplayObject} 返回被移除的显示对象
     * @memberof EgretBridge
     */
    EgretBridge.prototype.removeChildAt = function (parent, index) {
        if (parent && index >= 0)
            return parent.removeChildAt(index);
        else
            return null;
    };
    /**
     * 移除所有显示对象
     *
     * @param {egret.DisplayObjectContainer} parent 父容器
     * @memberof EgretBridge
     */
    EgretBridge.prototype.removeChildren = function (parent) {
        if (parent)
            parent.removeChildren();
    };
    /**
     * 获取父容器
     *
     * @param {egret.DisplayObject} target 目标对象
     * @returns {egret.DisplayObjectContainer} 父容器
     * @memberof EgretBridge
     */
    EgretBridge.prototype.getParent = function (target) {
        return target.parent;
    };
    /**
     * 获取指定索引处的显示对象
     *
     * @param {egret.DisplayObjectContainer} parent 父容器
     * @param {number} index 指定父级索引
     * @return {egret.DisplayObject} 索引处的显示对象
     * @memberof EgretBridge
     */
    EgretBridge.prototype.getChildAt = function (parent, index) {
        return parent.getChildAt(index);
    };
    /**
     * 获取显示索引
     *
     * @param {egret.DisplayObjectContainer} parent 父容器
     * @param {egret.DisplayObject} target 子显示对象
     * @return {number} target在parent中的索引
     * @memberof EgretBridge
     */
    EgretBridge.prototype.getChildIndex = function (parent, target) {
        return parent.getChildIndex(target);
    };
    /**
     * 通过名称获取显示对象
     *
     * @param {egret.DisplayObjectContainer} parent 父容器
     * @param {string} name 对象名称
     * @return {egret.DisplayObject} 显示对象
     * @memberof EgretBridge
     */
    EgretBridge.prototype.getChildByName = function (parent, name) {
        return parent.getChildByName(name);
    };
    /**
     * 获取子显示对象数量
     *
     * @param {egret.DisplayObjectContainer} parent 父容器
     * @return {number} 子显示对象数量
     * @memberof EgretBridge
     */
    EgretBridge.prototype.getChildCount = function (parent) {
        return parent.numChildren;
    };
    /**
     * 加载资源
     *
     * @param {string[]} assets 资源数组
     * @param {IMediator} mediator 资源列表
     * @param {(err?:Error)=>void} handler 回调函数
     * @memberof EgretBridge
     */
    EgretBridge.prototype.loadAssets = function (assets, mediator, handler) {
        var loader = new AssetsLoader({
            oneError: function (evt) {
                // 调用回调
                handler(new Error("资源加载失败"));
                // 派发加载错误事件
                core.dispatch(ModuleMessage.MODULE_LOAD_ASSETS_ERROR, evt);
            },
            complete: function (dict) {
                // 调用回调
                handler();
            }
        });
        loader.loadGroups(assets);
    };
    /**
     * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
     *
     * @param {egret.EventDispatcher} target 事件目标对象
     * @param {string} type 事件类型
     * @param {Function} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof EgretBridge
     */
    EgretBridge.prototype.mapListener = function (target, type, handler, thisArg) {
        target.addEventListener(type, handler, thisArg);
    };
    /**
     * 注销监听事件
     *
     * @param {egret.EventDispatcher} target 事件目标对象
     * @param {string} type 事件类型
     * @param {Function} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof EgretBridge
     */
    EgretBridge.prototype.unmapListener = function (target, type, handler, thisArg) {
        target.removeEventListener(type, handler, thisArg);
    };
    /**
     * 为绑定的列表显示对象包装一个渲染器创建回调
     *
     * @param {eui.DataGroup} target BindFor指令指向的显示对象
     * @param {(key?:any, value?:any, renderer?:eui.IItemRenderer)=>void} rendererHandler 渲染器创建回调
     * @returns {*} 返回一个备忘录对象，会在赋值时提供
     * @memberof IBridge
     */
    EgretBridge.prototype.wrapBindFor = function (target, rendererHandler) {
        var memento = {};
        wrapEUIList(target, function (data, renderer) {
            // 取出key
            var key;
            var datas = memento.datas;
            // 遍历memento的datas属性（在valuateBindFor时被赋值）
            for (var i in datas) {
                if (datas[i] == data) {
                    // 这就是我们要找的key
                    key = i;
                    break;
                }
            }
            // 调用回调
            rendererHandler(key, data, renderer);
        });
        return memento;
    };
    /**
     * 为列表显示对象赋值
     *
     * @param {eui.DataGroup} target BindFor指令指向的显示对象
     * @param {*} datas 数据集合
     * @param {*} memento wrapBindFor返回的备忘录对象
     * @memberof IBridge
     */
    EgretBridge.prototype.valuateBindFor = function (target, datas, memento) {
        var provider;
        if (datas instanceof Array) {
            provider = new eui.ArrayCollection(datas);
        }
        else {
            // 是字典，将其变为数组
            var list = [];
            for (var key in datas) {
                list.push(datas[key]);
            }
            provider = new eui.ArrayCollection(list);
        }
        // 设置memento
        memento.datas = datas;
        // 赋值
        target.dataProvider = provider;
    };
    /** 提供静态类型常量 */
    EgretBridge.TYPE = "Egret";
    return EgretBridge;
}());
export default EgretBridge;
var AssetAdapter = /** @class */ (function () {
    function AssetAdapter() {
    }
    /**
     * @language zh_CN
     * 解析素材
     * @param source 待解析的新素材标识符
     * @param compFunc 解析完成回调函数，示例：callBack(content:any,source:string):void;
     * @param thisObject callBack的 this 引用
     */
    AssetAdapter.prototype.getAsset = function (source, compFunc, thisObject) {
        if (RES.hasRes(source)) {
            var data = RES.getRes(source);
            if (data)
                onGetRes(data);
            else
                RES.getResAsync(source, onGetRes, this);
        }
        else {
            RES.getResByUrl(source, onGetRes, this, RES.ResourceItem.TYPE_IMAGE);
        }
        function onGetRes(data) {
            compFunc.call(thisObject, data, source);
        }
    };
    return AssetAdapter;
}());
var ThemeAdapter = /** @class */ (function () {
    function ThemeAdapter(initParams) {
        this._initParams = initParams;
    }
    /**
     * 解析主题
     * @param url 待解析的主题url
     * @param compFunc 解析完成回调函数，示例：compFunc(e:egret.Event):void;
     * @param errorFunc 解析失败回调函数，示例：errorFunc():void;
     * @param thisObject 回调的this引用
     */
    ThemeAdapter.prototype.getTheme = function (url, compFunc, errorFunc, thisObject) {
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onError, null);
        RES.getResByUrl(url, onGetRes, this, RES.ResourceItem.TYPE_TEXT);
        function onGetRes(e) {
            try {
                // 需要为所有主题资源添加路径前缀
                var data = JSON.parse(e);
                for (var key in data.skins)
                    data.skins[key] = this._initParams.pathPrefix + data.skins[key];
                for (var key in data.exmls) {
                    // 如果只是URL则直接添加前缀，否则是内容集成方式，需要单独修改path属性
                    var exml = data.exmls[key];
                    if (typeof exml == "string")
                        data.exmls[key] = this._initParams.pathPrefix + exml;
                    else
                        exml.path = this._initParams.pathPrefix + exml.path;
                }
                e = JSON.stringify(data);
            }
            catch (err) { }
            compFunc.call(thisObject, e);
        }
        function onError(e) {
            if (e.resItem.url == url) {
                RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onError, null);
                errorFunc.call(thisObject);
            }
        }
    };
    return ThemeAdapter;
}());