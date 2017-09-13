/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 *
 * 这个文件的存在是为了让装饰器功能可以正常使用，装饰器要求方法必须从window上可访问，因此不能定义在模块里
*/
interface IConstructor extends Function {
    new (...args: any[]): any;
}
interface IInjectableParams {
    type: IConstructor;
}
/**
 * 注入一个类型的实例
 *
 * @param {IConstructor} cls 类型构造器
 * @returns {PropertyDecorator}
 */
declare function Inject(cls: IConstructor): PropertyDecorator;
/**
 * 生成一个类型的实例并注册到框架注入器中，默认注册到自身类型构造器上
 *
 * @param {IConstructor} cls 类型构造器
 */
declare function Injectable(cls: IConstructor): void;
/**
 * 生成一个类型的实例并注册到框架注入器中，注册到指定的类型构造器上
 *
 * @param {IInjectableParams} params 指定要注册到到的类型构造器
 * @returns {ClassDecorator}
 */
declare function Injectable(params: IInjectableParams): ClassDecorator;
/**
 * 消息处理函数的装饰器方法
 *
 * @param {string} type 监听的消息类型
 * @returns {MethodDecorator}
 */
declare function Handler(type: string): MethodDecorator;
declare module "core/message/IMessage" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-01
     * @modify date 2017-09-01
     *
     * 框架内核消息接口
    */
    export default interface IMessage {
        /**
         * 获取消息类型
         *
         * @returns {string} 消息类型
         * @memberof IMessage
         */
        getType(): string;
    }
}
declare module "core/message/Message" {
    import IMessage from "core/message/IMessage";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-01
     * @modify date 2017-09-01
     *
     * 框架内核消息基类
    */
    export default class Message implements IMessage {
        private _type;
        /**
         * 获取消息类型字符串
         *
         * @returns {string} 消息类型字符串
         * @memberof Message
         */
        getType(): string;
        /**
         * 消息参数列表
         *
         * @type {any[]}
         * @memberof Message
         */
        params: any[];
        /**
         * Creates an instance of Message.
         * @param {string} type 消息类型
         * @param {...any[]} params 可能的消息参数列表
         * @memberof Message
         */
        constructor(type: string, ...params: any[]);
    }
}
declare module "core/message/CoreMessage" {
    import IMessage from "core/message/IMessage";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-13
     * @modify date 2017-09-13
     *
     * 核心事件类型
    */
    export default class CoreMessage implements IMessage {
        /**
         * 任何消息派发到框架后都会派发这个消息
         *
         * @static
         * @type {string}
         * @memberof CoreMessage
         */
        static MESSAGE_DISPATCHED: string;
        private _type;
        /**
         * 获取事件类型
         *
         * @returns {string}
         * @memberof CoreMessage
         */
        getType(): string;
        private _message;
        /**
         * 获取发送到框架内核的消息体
         *
         * @returns {IMessage}
         * @memberof CoreMessage
         */
        getMessage(): IMessage;
        constructor(type: string, message: IMessage);
    }
}
declare module "core/command/Command" {
    import IMessage from "core/message/IMessage";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-01
     * @modify date 2017-09-01
     *
     * 内核命令类，内核命令在注册了消息后可以在消息派发时被执行
    */
    export default abstract class Command {
        /**
         * 触发该Command运行的Message实例
         *
         * @type {IMessage}
         * @memberof Command
         */
        msg: IMessage;
        constructor(msg: IMessage);
        /**
         * 子类必须实现该方法
         *
         * @abstract
         * @memberof Command
         */
        abstract exec(): void;
    }
}
declare module "core/command/ICommandConstructor" {
    import IMessage from "core/message/IMessage";
    import Command from "core/command/Command";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-01
     * @modify date 2017-09-01
     *
     * 内核命令接口
    */
    export default interface ICommandConstructor {
        new (msg: IMessage): Command;
    }
}
declare module "core/Core" {
    import IMessage from "core/message/IMessage";
    import ICommandConstructor from "core/command/ICommandConstructor";
    export interface IConstructor extends Function {
        new (...args: any[]): any;
    }
    export interface IInjectableParams {
        type: IConstructor;
    }
    /**
     * 核心上下文对象，负责内核消息消息转发、对象注入等核心功能的实现
     *
     * @export
     * @class Core
     */
    export default class Core {
        private static _instance;
        constructor();
        /*********************** 下面是内核消息系统 ***********************/
        private _listenerDict;
        private handleMessages(msg);
        private doDispatch(msg);
        /**
         * 派发内核消息
         *
         * @param {IMessage} msg 内核消息实例
         * @memberof Core
         */
        dispatch(msg: IMessage): void;
        /**
         * 派发内核消息，消息会转变为Message类型对象
         *
         * @param {string} type 消息类型
         * @param {...any[]} params 消息参数列表
         * @memberof Core
         */
        dispatch(type: string, ...params: any[]): void;
        /**
         * 监听内核消息
         *
         * @param {string} type 消息类型
         * @param {(msg:IMessage)=>void} handler 消息处理函数
         * @param {*} [thisArg] 消息this指向
         * @memberof Core
         */
        listen(type: string, handler: (msg: IMessage) => void, thisArg?: any): void;
        /**
         * 移除内核消息监听
         *
         * @param {string} type 消息类型
         * @param {(msg:IMessage)=>void} handler 消息处理函数
         * @param {*} [thisArg] 消息this指向
         * @memberof Core
         */
        unlisten(type: string, handler: (msg: IMessage) => void, thisArg?: any): void;
        /*********************** 下面是依赖注入系统 ***********************/
        private _injectDict;
        /**
         * 添加一个类型注入，会立即生成一个实例并注入到框架内核中
         *
         * @param {IConstructor} target 要注入的类型（注意不是实例）
         * @param {IConstructor} [type] 如果提供该参数，则使用该类型代替注入类型的key，否则使用注入类型自身作为key
         * @memberof Core
         */
        mapInject(target: IConstructor, type?: IConstructor): void;
        /**
         * 注入一个对象实例
         *
         * @param {*} value 要注入的对象实例
         * @param {IConstructor} [type] 如果提供该参数，则使用该类型代替注入类型的key，否则使用注入实例的构造函数作为key
         * @memberof Core
         */
        mapInjectValue(value: any, type?: IConstructor): void;
        /**
         * 移除类型注入
         *
         * @param {IConstructor} target 要移除注入的类型
         * @memberof Core
         */
        unmapInject(target: IConstructor): void;
        /**
         * 获取注入的对象实例
         *
         * @param {(IConstructor)} type 注入对象的类型
         * @returns {*} 注入的对象实例
         * @memberof Core
         */
        getInject(type: IConstructor): any;
        /*********************** 下面是内核命令系统 ***********************/
        private _commandDict;
        private handleCommands(msg);
        /**
         * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
         *
         * @param {string} type 要注册的消息类型
         * @param {(ICommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
         * @memberof Core
         */
        mapCommand(type: string, cmd: ICommandConstructor): void;
        /**
         * 注销命令
         *
         * @param {string} type 要注销的消息类型
         * @param {(ICommandConstructor)} cmd 命令处理器
         * @returns {void}
         * @memberof Core
         */
        unmapCommand(type: string, cmd: ICommandConstructor): void;
        /*********************** 下面是界面中介者系统 ***********************/
        private _mediatorList;
        /**
         * 获取中介者数组
         *
         * @returns {any[]} 中介者数组
         * @memberof Core
         */
        getMediators(): any[];
        /**
         * 注册界面中介者
         *
         * @param {any} mediator 要注册的界面中介者实例
         * @memberof Core
         */
        mapMediator(mediator: any): void;
        /**
         * 注销界面中介者
         *
         * @param {any} mediator 要注销的界面中介者实例
         * @memberof Core
         */
        unmapMediator(mediator: any): void;
    }
    /** 再额外导出一个单例 */
    export const core: Core;
}
declare module "engine/system/System" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * 用来记录程序运行时间，并且提供延迟回调或频率回调功能
    */
    export default class System {
        private _nextFrameList;
        private _timer;
        /**
         * 获取从程序运行到当前所经过的毫秒数
         *
         * @returns {number} 毫秒数
         * @memberof System
         */
        getTimer(): number;
        constructor();
        private tick();
        /**
         * 在下一帧执行某个方法
         *
         * @param {Function} handler 希望在下一帧执行的某个方法
         * @param {*} [thisArg] this指向
         * @param {...any[]} args 方法参数列表
         * @returns {ICancelable} 可取消的句柄
         * @memberof System
         */
        nextFrame(handler: Function, thisArg?: any, ...args: any[]): ICancelable;
        /**
         * 设置延迟回调
         *
         * @param {number} duration 延迟毫秒值
         * @param {Function} handler 回调函数
         * @param {*} [thisArg] this指向
         * @param {...any[]} args 要传递的参数
         * @returns {ICancelable} 可取消的句柄
         * @memberof System
         */
        setTimeout(duration: number, handler: Function, thisArg?: any, ...args: any[]): ICancelable;
        /**
         * 设置延时间隔
         *
         * @param {number} duration 延迟毫秒值
         * @param {Function} handler 回调函数
         * @param {*} [thisArg] this指向
         * @param {...any[]} args 要传递的参数
         * @returns {ICancelable} 可取消的句柄
         * @memberof System
         */
        setInterval(duration: number, handler: Function, thisArg?: any, ...args: any[]): ICancelable;
    }
    export interface ICancelable {
        cancel(): void;
    }
    /** 再额外导出一个单例 */
    export const system: System;
}
declare module "view/bridge/IBridge" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-08-31
     * @modify date 2017-08-31
     *
     * 这是表现层桥接口，不同渲染引擎的表现层都需要实现该接口以接入Olympus框架
    */
    export default interface IBridge {
        /**
         * 获取表现层类型名称
         * @return {string} 一个字符串，代表表现层类型名称
         * @memberof IBridge
         */
        getType(): string;
        /**
         * 获取表现层HTML包装器，可以对其样式进行自定义调整
         * @return {HTMLElement} 表现层的HTML包装器，通常会是一个<div/>标签
         * @memberof IBridge
         */
        getHTMLWrapper(): HTMLElement;
        /**
         * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
         *
         * @param {*} target 事件目标对象
         * @param {string} type 事件类型
         * @param {Function} handler 事件处理函数
         * @param {*} [thisArg] this指向对象
         * @memberof IBridge
         */
        mapListener(target: any, type: string, handler: Function, thisArg?: any): void;
        /**
         * 注销监听事件
         *
         * @param {*} target 事件目标对象
         * @param {string} type 事件类型
         * @param {Function} handler 事件处理函数
         * @param {*} [thisArg] this指向对象
         * @memberof IBridge
         */
        unmapListener(target: any, type: string, handler: Function, thisArg?: any): void;
        /**
         * 初始化表现层，可以没有该方法，没有该方法则表示该表现层无需初始化
         * @param {()=>void} complete 初始化完毕后的回调
         * @memberof IBridge
         */
        initView?(complete: () => void): void;
    }
}
declare module "view/bridge/IHasBridge" {
    import IBridge from "view/bridge/IBridge";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-08
     * @modify date 2017-09-08
     *
     * 标识拥有表现层桥的接口
    */
    export default interface IHasMediatorBridge {
        /**
         * 获取表现层桥
         */
        getBridge(): IBridge;
    }
}
declare module "core/interfaces/IDisposable" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-01
     * @modify date 2017-09-01
     *
     * 可回收接口
    */
    export default interface IDisposable {
        dispose(): void;
    }
}
declare module "view/mediator/IMediator" {
    import IHasBridge from "view/bridge/IHasBridge";
    import IDisposable from "core/interfaces/IDisposable";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-04
     * @modify date 2017-09-04
     *
     * 界面中介者接口
    */
    export default interface IMediator extends IHasBridge, IDisposable {
        /**
         * 获取中介者是否已被销毁
         *
         * @returns {boolean} 是否已被销毁
         * @memberof IMediator
         */
        isDisposed(): boolean;
        /**
         * 获取皮肤
         *
         * @returns {*} 皮肤引用
         * @memberof IMediator
         */
        getSkin(): any;
        /**
         * 设置皮肤
         *
         * @param {*} value 皮肤引用
         * @memberof IMediator
         */
        setSkin(value: any): void;
        /**
         * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
         *
         * @param {*} target 事件目标对象
         * @param {string} type 事件类型
         * @param {Function} handler 事件处理函数
         * @param {*} [thisArg] this指向对象
         * @memberof IMediator
         */
        mapListener(target: any, type: string, handler: Function, thisArg?: any): void;
        /**
         * 注销监听事件
         *
         * @param {*} target 事件目标对象
         * @param {string} type 事件类型
         * @param {Function} handler 事件处理函数
         * @param {*} [thisArg] this指向对象
         * @memberof IMediator
         */
        unmapListener(target: any, type: string, handler: Function, thisArg?: any): void;
        /**
         * 注销所有注册在当前中介者上的事件监听
         *
         * @memberof IMediator
         */
        unmapAllListeners(): void;
    }
}
declare module "engine/component/Mediator" {
    import IMediator from "view/mediator/IMediator";
    import IBridge from "view/bridge/IBridge";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-04
     * @modify date 2017-09-04
     *
     * 组件界面中介者基类
    */
    export default abstract class Mediator implements IMediator {
        constructor(bridge: IBridge, skin?: any);
        private _bridge;
        /**
         * 获取表现层桥
         *
         * @returns {IBridge} 表现层桥
         * @memberof Mediator
         */
        getBridge(): IBridge;
        private _isDestroyed;
        /**
         * 获取中介者是否已被销毁
         *
         * @returns {boolean} 是否已被销毁
         * @memberof Mediator
         */
        isDisposed(): boolean;
        private _skin;
        /**
         * 获取皮肤
         *
         * @returns {*} 皮肤引用
         * @memberof Mediator
         */
        getSkin(): any;
        /**
         * 设置皮肤
         *
         * @param {*} value 皮肤引用
         * @memberof Mediator
         */
        setSkin(value: any): void;
        private _listeners;
        /**
         * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
         *
         * @param {*} target 事件目标对象
         * @param {string} type 事件类型
         * @param {Function} handler 事件处理函数
         * @param {*} [thisArg] this指向对象
         * @memberof Mediator
         */
        mapListener(target: any, type: string, handler: Function, thisArg?: any): void;
        /**
         * 注销监听事件
         *
         * @param {*} target 事件目标对象
         * @param {string} type 事件类型
         * @param {Function} handler 事件处理函数
         * @param {*} [thisArg] this指向对象
         * @memberof Mediator
         */
        unmapListener(target: any, type: string, handler: Function, thisArg?: any): void;
        /**
         * 注销所有注册在当前中介者上的事件监听
         *
         * @memberof Mediator
         */
        unmapAllListeners(): void;
        /**
         * 销毁中介者
         *
         * @memberof Mediator
         */
        dispose(): void;
    }
}
declare module "core/interfaces/IConstructor" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-01
     * @modify date 2017-09-01
     *
     * 任意构造器接口
    */
    export default interface IConstructor extends Function {
        new (...args: any[]): any;
    }
}
declare module "engine/popup/IPopupPolicy" {
    import IPopup from "engine/popup/IPopup";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * 弹窗动画策略，负责将弹窗动画与弹窗实体解耦
    */
    export default interface IPopupPolicy {
        /**
         * 显示时调用
         * @param popup 弹出框对象
         * @param callback 完成回调，必须调用
         * @param from 动画起始点
         */
        open(popup: IPopup, callback: () => void, from?: {
            x: number;
            y: number;
        }): void;
        /**
         * 关闭时调用
         * @param popup 弹出框对象
         * @param callback 完成回调，必须调用
         * @param to 动画完结点
         */
        close(popup: IPopup, callback: () => void, to?: {
            x: number;
            y: number;
        }): void;
    }
}
declare module "engine/popup/IPopup" {
    import IHasBridge from "view/bridge/IHasBridge";
    import IPopupPolicy from "engine/popup/IPopupPolicy";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * 弹窗接口
    */
    export default interface IPopup extends IHasBridge {
        /** 获取弹出策略 */
        getPolicy(): IPopupPolicy;
        /** 设置切换策略 */
        setPolicy(policy: IPopupPolicy): void;
        /** 在弹出前调用的方法 */
        onBeforeOpen?(isModel?: boolean, from?: {
            x: number;
            y: number;
        }): void;
        /** 在弹出后调用的方法 */
        onAfterOpen?(isModel?: boolean, from?: {
            x: number;
            y: number;
        }): void;
        /** 在关闭前调用的方法 */
        onBeforeClose?(to?: {
            x: number;
            y: number;
        }): void;
        /** 在关闭后调用的方法 */
        onAfterClose?(to?: {
            x: number;
            y: number;
        }): void;
    }
}
declare module "engine/popup/NonePopupPolicy" {
    import IPopup from "engine/popup/IPopup";
    import IPopupPolicy from "engine/popup/IPopupPolicy";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * 无任何动画的弹出策略，可应用于任何显示层实现
    */
    export class NonePopupPolicy implements IPopupPolicy {
        open(popup: IPopup, callback: () => void, from?: {
            x: number;
            y: number;
        }): void;
        close(popup: IPopup, callback: () => void, from?: {
            x: number;
            y: number;
        }): void;
    }
    const _default: NonePopupPolicy;
    export default _default;
}
declare module "engine/popup/PopupMessage" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * 弹窗相关的消息
    */
    export default class PopupMessage {
        /**
         * 打开弹窗前的消息
         *
         * @static
         * @type {string}
         * @memberof PopupMessage
         */
        static POPUP_BEFORE_OPEN: string;
        /**
         * 打开弹窗后的消息
         *
         * @static
         * @type {string}
         * @memberof PopupMessage
         */
        static POPUP_AFTER_OPEN: string;
        /**
         * 关闭弹窗前的消息
         *
         * @static
         * @type {string}
         * @memberof PopupMessage
         */
        static POPUP_BEFORE_CLOSE: string;
        /**
         * 关闭弹窗后的消息
         *
         * @static
         * @type {string}
         * @memberof PopupMessage
         */
        static POPUP_AFTER_CLOSE: string;
    }
}
declare module "engine/popup/PopupManager" {
    import IConstructor from "core/interfaces/IConstructor";
    import IPopup from "engine/popup/IPopup";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * 弹窗管理器，包含弹出弹窗、关闭弹窗、弹窗管理等功能
    */
    export default class PopupManager {
        private _popups;
        /**
         * 获取当前显示的弹窗数组（副本）
         *
         * @param {IConstructor} [cls] 弹窗类型，如果传递该参数则只返回该类型的已打开弹窗，否则将返回所有已打开的弹窗
         * @returns {IPopup[]} 已打开弹窗数组
         * @memberof PopupManager
         */
        getOpened(cls?: IConstructor): IPopup[];
        /**
         * 打开一个弹窗
         *
         * @param {IPopup} popup 要打开的弹窗
         * @param {boolean} [isModel=true] 是否模态弹出
         * @param {{x:number, y:number}} [from] 弹出起点位置
         * @returns {IPopup} 返回弹窗对象
         * @memberof PopupManager
         */
        open(popup: IPopup, isModel?: boolean, from?: {
            x: number;
            y: number;
        }): IPopup;
        /**
         * 关闭一个弹窗
         *
         * @param {IPopup} popup 要关闭的弹窗
         * @param {{x:number, y:number}} [to] 关闭终点位置
         * @returns {IPopup} 返回弹窗对象
         * @memberof PopupManager
         */
        close(popup: IPopup, to?: {
            x: number;
            y: number;
        }): IPopup;
    }
    /** 再额外导出一个单例 */
    export const popupManager: PopupManager;
}
declare module "engine/popup/PopupMediator" {
    import Mediator from "engine/component/Mediator";
    import IBridge from "view/bridge/IBridge";
    import IPopup from "engine/popup/IPopup";
    import IPopupPolicy from "engine/popup/IPopupPolicy";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * 实现了IPopup接口的弹窗中介者基类
    */
    export default abstract class PopupMediator extends Mediator implements IPopup {
        constructor(bridge: IBridge, skin?: any, policy?: IPopupPolicy);
        private _policy;
        /**
         * 获取弹出策略
         *
         * @returns {IPopupPolicy} 弹出策略
         * @memberof PopupMediator
         */
        getPolicy(): IPopupPolicy;
        /**
         * 设置弹出策略
         *
         * @param {IPopupPolicy} policy 设置弹出策略
         * @memberof PopupMediator
         */
        setPolicy(policy: IPopupPolicy): void;
    }
}
declare module "engine/scene/IScenePolicy" {
    import IScene from "engine/scene/IScene";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-08
     * @modify date 2017-09-08
     *
     * 场景动画策略，负责将场景动画与场景实体解耦
    */
    export default interface IScenePolicy {
        /**
         * 准备切换场景时调度
         * @param from 切出的场景
         * @param to 切入的场景
         */
        prepareSwitch(from: IScene, to: IScene): void;
        /**
         * 切换场景时调度
         * @param from 切出的场景
         * @param to 切入的场景
         * @param callback 切换完毕的回调方法
         */
        switch(from: IScene, to: IScene, callback: () => void): void;
        /**
         * 准备Push场景时调度，如果没有定义该方法则套用PrepareSwitch
         * @param from 切出的场景
         * @param to 切入的场景
         */
        preparePush?(from: IScene, to: IScene): void;
        /**
         * Push场景时调度，如果没有定义该方法则套用switch
         * @param from 切出的场景
         * @param to 切入的场景
         * @param callback 切换完毕的回调方法
         */
        push?(from: IScene, to: IScene, callback: () => void): void;
        /**
         * 准备Pop场景时调度，如果没有定义该方法则套用PrepareSwitch
         * @param from 切出的场景
         * @param to 切入的场景
         */
        preparePop?(from: IScene, to: IScene): void;
        /**
         * Pop场景时调度，如果没有定义该方法则套用switch
         * @param from 切出的场景
         * @param to 切入的场景
         * @param callback 切换完毕的回调方法
         */
        pop?(from: IScene, to: IScene, callback: () => void): void;
    }
}
declare module "engine/scene/IScene" {
    import IHasBridge from "view/bridge/IHasBridge";
    import IScenePolicy from "engine/scene/IScenePolicy";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-08
     * @modify date 2017-09-08
     *
     * 场景接口
    */
    export default interface IScene extends IHasBridge {
        /** 获取切换策略 */
        getPolicy(): IScenePolicy;
        /** 设置切换策略 */
        setPolicy(policy: IScenePolicy): void;
        /**
         * 切入场景开始前调用
         * @param fromScene 从哪个场景切入
         * @param data 切场景时可能的参数
         */
        onBeforeIn?(fromScene: IScene, data?: any): void;
        /**
         * 切入场景开始后调用
         * @param fromScene 从哪个场景切入
         * @param data 切场景时可能的参数
         */
        onAfterIn?(fromScene: IScene, data?: any): void;
        /**
         * 切出场景开始前调用
         * @param toScene 要切入到哪个场景
         * @param data 切场景时可能的参数
         */
        onBeforeOut?(toScene: IScene, data?: any): void;
        /**
         * 切出场景开始后调用
         * @param toScene 要切入到哪个场景
         * @param data 切场景时可能的参数
         */
        onAfterOut?(toScene: IScene, data?: any): void;
    }
}
declare module "engine/scene/NoneScenePolicy" {
    import IScene from "engine/scene/IScene";
    import IScenePolicy from "engine/scene/IScenePolicy";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-08
     * @modify date 2017-09-08
     *
     * 无任何动画的场景策略，可应用于任何显示层实现
    */
    export class NoneScenePolicy implements IScenePolicy {
        /**
         * 准备切换场景时调度
         * @param from 切出的场景
         * @param to 切入的场景
         */
        prepareSwitch(from: IScene, to: IScene): void;
        /**
         * 切换场景时调度
         * @param from 切出的场景
         * @param to 切入的场景
         * @param callback 切换完毕的回调方法
         */
        switch(from: IScene, to: IScene, callback: () => void): void;
    }
    const _default: NoneScenePolicy;
    export default _default;
}
declare module "engine/scene/SceneMessage" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-08
     * @modify date 2017-09-08
     *
     * 场景相关的消息
    */
    export default class SceneMessage {
        /**
         * 切换场景前的消息
         *
         * @static
         * @type {string}
         * @memberof SceneMessage
         */
        static SCENE_BEFORE_CHANGE: string;
        /**
         * 切换场景后的消息
         *
         * @static
         * @type {string}
         * @memberof SceneMessage
         */
        static SCENE_AFTER_CHANGE: string;
    }
}
declare module "utils/SyncUtil" {
    /**
     * 判断是否正在进行操作
     *
     * @export
     * @param {Function} fn 要执行的方法
     * @returns {boolean} 队列是否正在操作
     */
    export function isOperating(fn: Function): boolean;
    /**
     * 开始同步操作，所有传递了相同name的操作会被以队列方式顺序执行
     *
     * @export
     * @param name 一个队列的名字
     * @param {Function} fn 要执行的方法
     * @param {*} [thisArg] 方法this对象
     * @param {...any[]} [args] 方法参数
     */
    export function wait(name: string, fn: Function, thisArg?: any, ...args: any[]): void;
    /**
     * 完成一步操作并唤醒后续操作
     *
     * @export
     * @param {string} name 队列名字
     * @returns {void}
     */
    export function notify(name: string): void;
}
declare module "engine/scene/SceneManager" {
    import IScene from "engine/scene/IScene";
    export default class SceneManager {
        private _sceneStack;
        /**
         * 获取当前场景
         *
         * @returns {IScene} 当前场景
         * @memberof SceneManager
         */
        getCurScene(): IScene;
        /**
         * 获取活动场景个数
         *
         * @returns {number} 活动场景个数
         * @memberof SceneManager
         */
        getActiveCount(): number;
        /**
         * 切换场景，替换当前场景，当前场景会被销毁
         *
         * @param {IScene} scene 要切换到的场景
         * @param {*} [data] 要携带给下一个场景的数据
         * @memberof SceneManager
         */
        switchScene(scene: IScene, data?: any): void;
        /**
         * 推入场景，当前场景不会销毁，而是进入场景栈保存，以后可以通过popScene重新展现
         *
         * @param {IScene} scene 要推入的场景
         * @param {*} [data] 要携带给下一个场景的数据
         * @memberof SceneManager
         */
        pushScene(scene: IScene, data?: any): void;
        /**
         * 弹出场景，当前场景会被销毁，当前位于栈顶的场景会重新显示
         *
         * @param {IScene} scene 要切换出的场景，仅做验证用，如果当前场景不是传入的场景则不会进行切换弹出操作
         * @param {*} [data] 要携带给下一个场景的数据
         * @memberof SceneManager
         */
        popScene(scene: IScene, data?: any): void;
        private doPopScene(scene, data);
        private doChangeScene(from, to, data, policy, type, complete);
    }
    /** 再额外导出一个单例 */
    export const sceneManager: SceneManager;
}
declare module "engine/scene/SceneMediator" {
    import Mediator from "engine/component/Mediator";
    import IBridge from "view/bridge/IBridge";
    import IScene from "engine/scene/IScene";
    import IScenePolicy from "engine/scene/IScenePolicy";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-08
     * @modify date 2017-09-08
     *
     * 实现了IScene接口的场景中介者基类
    */
    export default abstract class SceneMediator extends Mediator implements IScene {
        constructor(bridge: IBridge, skin?: any, policy?: IScenePolicy);
        private _policy;
        /**
         * 获取弹出策略
         *
         * @returns {IScenePolicy} 弹出策略
         * @memberof SceneMediator
         */
        getPolicy(): IScenePolicy;
        /**
         * 设置弹出策略
         *
         * @param {IScenePolicy} policy 弹出策略
         * @memberof SceneMediator
         */
        setPolicy(policy: IScenePolicy): void;
    }
}
declare module "engine/env/Explorer" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-05
     * @modify date 2017-09-05
     *
     * Explorer类记录浏览器相关数据
    */
    /**
     * 浏览器类型枚举
     *
     * @enum {number}
     */
    export enum ExplorerType {
        IE = 0,
        EDGE = 1,
        OPERA = 2,
        FIREFOX = 3,
        SAFARI = 4,
        CHROME = 5,
        OTHERS = 6,
    }
    export default class Explorer {
        private _type;
        /**
         * 获取浏览器类型枚举值
         *
         * @returns {ExplorerType} 浏览器类型枚举值
         * @memberof Explorer
         */
        getType(): ExplorerType;
        private _typeStr;
        /**
         * 获取浏览器类型字符串
         *
         * @returns {string} 浏览器类型字符串
         * @memberof Explorer
         */
        getTypeStr(): string;
        private _version;
        /**
         * 获取浏览器版本
         *
         * @returns {string} 浏览器版本
         * @memberof Explorer
         */
        getVersion(): string;
        private _bigVersion;
        /**
         * 获取浏览器大版本
         *
         * @returns {string} 浏览器大版本
         * @memberof Explorer
         */
        getBigVersion(): string;
        constructor();
    }
    /** 再额外导出一个单例 */
    export const explorer: Explorer;
}
declare module "engine/env/External" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-05
     * @modify date 2017-09-05
     *
     * External类为window.external参数字典包装类
    */
    export default class External {
        private _params;
        constructor();
        /**
         * 获取window.external中的参数
         *
         * @param {string} key 参数名
         * @returns {*} 参数值
         * @memberof External
         */
        getParam(key: string): any;
    }
    /** 再额外导出一个单例 */
    export const external: External;
}
declare module "engine/env/Hash" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * Hash类是地址路由（网页哈希）管理器，规定哈希格式为：#[模块名]?[参数名]=[参数值]&[参数名]=[参数值]&...
    */
    export default class Hash {
        private _hash;
        /**
         * 获取原始的哈希字符串
         *
         * @returns {string}
         * @memberof Hash
         */
        getHash(): string;
        private _moduleName;
        /**
         * 获取模块名
         *
         * @returns {string} 模块名
         * @memberof Hash
         */
        getModuleName(): string;
        private _params;
        /**
         * 获取传递给模块的参数
         *
         * @returns {{[key:string]:string}} 模块参数
         * @memberof Hash
         */
        getParams(): {
            [key: string]: string;
        };
        private _direct;
        /**
         * 获取是否直接跳转模块
         *
         * @returns {boolean} 是否直接跳转模块
         * @memberof Hash
         */
        getDirect(): boolean;
        private _keepHash;
        /**
         * 获取是否保持哈希值
         *
         * @returns {boolean} 是否保持哈希值
         * @memberof Hash
         */
        getKeepHash(): boolean;
        constructor();
        /**
         * 获取指定哈希参数
         *
         * @param {string} key 参数名
         * @returns {string} 参数值
         * @memberof Hash
         */
        getParam(key: string): string;
    }
    /** 再额外导出一个单例 */
    export const hash: Hash;
}
declare module "engine/env/Query" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-05
     * @modify date 2017-09-05
     *
     * Query类记录通过GET参数传递给框架的参数字典
    */
    export default class Query {
        private _params;
        constructor();
        /**
         * 获取GET参数
         *
         * @param {string} key 参数key
         * @returns {string} 参数值
         * @memberof Query
         */
        getParam(key: string): string;
    }
    /** 再额外导出一个单例 */
    export const query: Query;
}
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-13
 * @modify date 2017-09-13
 *
 * 这个文件的存在是为了让装饰器功能可以正常使用，装饰器要求方法必须从window上可访问，因此不能定义在模块里
*/
interface IConstructor extends Function {
    new (...args: any[]): any;
}
/**
 * 通讯消息返回处理函数的装饰器方法
 *
 * @param {(IConstructor|string)} clsOrType 消息返回体构造器或类型字符串
 * @returns {MethodDecorator}
 */
declare function Result(clsOrType: IConstructor | string): MethodDecorator;
declare module "utils/ObjectUtil" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-11
     * @modify date 2017-09-11
     *
     * 对象工具集
    */
    /**
     * populate properties
     * @param target        目标obj
     * @param sources       来源obj
     */
    export function extendObject(target: any, ...sources: any[]): any;
    /**
     * 复制对象
     * @param target 要复制的对象
     * @param deep 是否深表复制，默认浅表复制
     * @returns {any} 复制后的对象
     */
    export function cloneObject(target: any, deep?: boolean): any;
    /**
     * 生成一个随机ID
     */
    export function getGUID(): string;
    /**
     * 生成自增id（从0开始）
     * @param type
     */
    export function getAutoIncId(type: string): string;
    /**
     * 判断对象是否为null或者空对象
     * @param obj 要判断的对象
     * @returns {boolean} 是否为null或者空对象
     */
    export function isEmpty(obj: any): boolean;
    /**
     * 移除data中包含的空引用或未定义
     * @param data 要被移除空引用或未定义的对象
     */
    export function trimData(data: any): any;
}
declare module "engine/net/IRequestPolicy" {
    import RequestData from "engine/net/RequestData";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-11
     * @modify date 2017-09-11
     *
     * 请求策略，根据使用的策略不同，请求的行为也会有所不同，例如使用HTTP或者Socket
    */
    export default interface IRequestPolicy {
        /**
         * 发送请求逻辑
         *
         * @param {RequestData} request 请求
         * @memberof IRequestPolicy
         */
        sendRequest(request: RequestData): void;
    }
}
declare module "engine/net/RequestData" {
    import IMessage from "core/message/IMessage";
    import IRequestPolicy from "engine/net/IRequestPolicy";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-11
     * @modify date 2017-09-11
     *
     * 通讯发送消息基类
    */
    export interface IRequestParams {
        /**
         * 消息名
         *
         * @type {string}
         * @memberof IRequestParams
         */
        type: string;
        /**
         * 消息数据
         *
         * @type {*}
         * @memberof IRequestParams
         */
        data: any;
        /**
         * 协议类型
         *
         * @type {string}
         * @memberof IRequestParams
         */
        protocol: string;
        /**
         * 其他可能需要的参数
         *
         * @type {*}
         * @memberof IRequestParams
         */
        [key: string]: any;
    }
    export default abstract class RequestData implements IMessage {
        /**
         * 用户参数，可以保存任意参数到Message中，该参数中的数据不会被发送
         *
         * @type {*}
         * @memberof RequestData
         */
        __userData: any;
        /**
         * 请求参数，可以运行时修改
         *
         * @type {IRequestParams}
         * @memberof RequestData
         */
        abstract __params: IRequestParams;
        /**
         * 消息发送接收策略
         *
         * @type {IRequestPolicy}
         * @memberof RequestData
         */
        abstract __policy: IRequestPolicy;
        /**
         * 获取请求消息类型字符串
         *
         * @returns {string} 请求消息类型字符串
         * @memberof RequestData
         */
        getType(): string;
    }
    /** 导出公共消息参数对象 */
    export var commonData: any;
}
declare module "engine/net/DataType" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-11
     * @modify date 2017-09-11
     *
     * 请求或返回数据结构体
    */
    export default abstract class DataType {
        private __rawData;
        /**
         * 解析后端返回的JSON对象，生成结构体
         *
         * @param {any} data 后端返回的JSON对象
         * @returns {DataType} 结构体对象
         * @memberof DataType
         */
        parse(data: any): DataType;
        /**
         * 解析逻辑，需要子类实现
         *
         * @protected
         * @abstract
         * @param {*} data JSON对象
         * @memberof DataType
         */
        protected abstract doParse(data: any): void;
        /**
         * 打包数据成为一个Object，需要子类实现
         *
         * @returns {*} 打包后的数据
         * @memberof DataType
         */
        abstract pack(): any;
    }
}
declare module "engine/net/ResponseData" {
    import MessageType from "engine/net/DataType";
    import RequestData from "engine/net/RequestData";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-11
     * @modify date 2017-09-11
     *
     * 通讯返回消息基类
    */
    export interface IResponseParams {
        type: string;
        protocol: string;
        method: null | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH" | "MOVE" | "COPY" | "LINK" | "UNLINK" | "WRAPPED" | "Extension-mothed";
        data: any;
        request?: RequestData;
        error?: Error;
    }
    export default abstract class ResponseData extends MessageType {
        /**
         * 返回参数
         *
         * @abstract
         * @type {IResponseParams}
         * @memberof ResponseType
         */
        abstract __params: IResponseParams;
    }
    export interface IResponseDataConstructor {
        new (): ResponseData;
        getType(): string;
    }
}
declare module "engine/net/NetMessage" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-11
     * @modify date 2017-09-11
     *
     * 通讯相关的消息
    */
    export default class NetMessage {
        /**
         * 发送网络请求消息
         *
         * @static
         * @type {string}
         * @memberof NetMessage
         */
        static NET_REQUEST: string;
        /**
         * 接受网络返回消息
         *
         * @static
         * @type {string}
         * @memberof NetMessage
         */
        static NET_RESPONSE: string;
        /**
         * 网络请求错误消息
         *
         * @static
         * @type {string}
         * @memberof NetMessage
         */
        static NET_ERROR: string;
    }
}
declare module "engine/net/NetManager" {
    import RequestData from "engine/net/RequestData";
    import ResponseData, { IResponseDataConstructor } from "engine/net/ResponseData";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-12
     * @modify date 2017-09-12
     *
     * 网络管理器
    */
    export interface ResponseHandler {
        (response: ResponseData, request?: RequestData): void;
    }
    export default class NetManager {
        private _responseDict;
        /**
         * 注册一个返回结构体
         *
         * @param {string} type 返回类型
         * @param {IResponseDataConstructor} cls 返回结构体构造器
         * @memberof NetManager
         */
        registerResponse(cls: IResponseDataConstructor): void;
        private _responseListeners;
        /**
         * 添加一个通讯返回监听
         *
         * @param {(IResponseDataConstructor|string)} clsOrType 要监听的返回结构构造器或者类型字符串
         * @param {ResponseHandler} handler 回调函数
         * @param {*} [thisArg] this指向
         * @param {boolean} [once=false] 是否一次性监听
         * @memberof NetManager
         */
        listenResponse(clsOrType: IResponseDataConstructor | string, handler: ResponseHandler, thisArg?: any, once?: boolean): void;
        /**
         * 移除一个通讯返回监听
         *
         * @param {(IResponseDataConstructor|string)} clsOrType 要移除监听的返回结构构造器或者类型字符串
         * @param {ResponseHandler} handler 回调函数
         * @param {*} [thisArg] this指向
         * @param {boolean} [once=false] 是否一次性监听
         * @memberof NetManager
         */
        unlistenResponse(clsOrType: IResponseDataConstructor | string, handler: ResponseHandler, thisArg?: any, once?: boolean): void;
        /** 这里导出不希望用户使用的方法，供框架内使用 */
        __onResponse(type: string, result: any, request?: RequestData): void | never;
        __onError(err: Error, request?: RequestData): void;
        private onMsgDispatched(msg);
    }
    /** 再额外导出一个单例 */
    export const netManager: NetManager;
}
declare module "utils/URLUtil" {
    /**
     * 规整url
     * @param url
     */
    export function trimURL(url: string): string;
    /**
     * 检查URL是否是绝对路径（具有协议头）
     * @param url 要判断的URL
     * @returns {any} 是否是绝对路径
     */
    export function isAbsolutePath(url: string): boolean;
    /**
     * 如果url有protocol，使其与当前域名的protocol统一，否则会跨域
     * @param url 要统一protocol的url
     */
    export function validateProtocol(url: string): string;
    /**
     * 替换url中的host
     * @param url       url
     * @param host      要替换的host
     * @param forced    是否强制替换（默认false）
     */
    export function wrapHost(url: string, host: string, forced?: boolean): string;
    /**
     * 将相对于当前页面的相对路径包装成绝对路径
     * @param relativePath 相对于当前页面的相对路径
     * @param host 传递该参数会用该host替换当前host
     */
    export function wrapAbsolutePath(relativePath: string, host?: string): string;
    /**
     * 获取URL的host+pathname部分，即问号(?)以前的部分
     *
     */
    export function getHostAndPathname(url: string): string;
    /**
     * 获取URL路径（文件名前的部分）
     * @param url 要分析的URL
     */
    export function getPath(url: string): string;
    /**
     * 获取URL的文件名
     * @param url 要分析的URL
     */
    export function getName(url: string): string;
    /**
     * 解析URL
     * @param url 要被解析的URL字符串
     * @returns {any} 解析后的URLLocation结构体
     */
    export function parseUrl(url: string): URLLocation;
    /**
     * 解析url查询参数
     * @TODO 添加对jquery编码方式的支持
     * @param url url
     */
    export function getQueryParams(url: string): {
        [key: string]: string;
    };
    /**
     * 将参数连接到指定URL后面
     * @param url url
     * @param params 一个map，包含要连接的参数
     * @return string 连接后的URL地址
     */
    export function joinQueryParams(url: string, params: Object): string;
    /**
     * 将参数链接到URL的hash后面
     * @param url 如果传入的url没有注明hash模块，则不会进行操作
     * @param params 一个map，包含要连接的参数
     */
    export function joinHashParams(url: string, params: Object): string;
    /**
     * 添加-r_XXX形式版本号
     * @param url url
     * @param version 版本号，以数字和小写字母组成
     * @returns {string} 加版本号后的url，如果没有查到版本号则返回原始url
     */
    export function join_r_Version(url: string, version: string): string;
    /**
     * 移除-r_XXX形式版本号
     * @param url url
     * @returns {string} 移除版本号后的url
     */
    export function remove_r_Version(url: string): string;
    export interface URLLocation {
        href: string;
        origin: string;
        protocol: string;
        host: string;
        hostname: string;
        port: string;
        pathname: string;
        search: string;
        hash: string;
    }
}
declare module "engine/net/HTTPMethod" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-12
     * @modify date 2017-09-12
     *
     * 定义HTTP发送接收方式目前支持的method值的枚举
    */
    type HTTPMethod = "GET" | "POST";
    export default HTTPMethod;
}
declare module "engine/net/policies/HTTPRequestPolicy" {
    import IRequestPolicy from "engine/net/IRequestPolicy";
    import RequestData, { IRequestParams } from "engine/net/RequestData";
    import HTTPMethod from "engine/net/HTTPMethod";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-11
     * @modify date 2017-09-11
     *
     * HTTP请求策略
    */
    export interface IHTTPRequestParams extends IRequestParams {
        /**
         * 消息域名
         *
         * @type {string}
         * @memberof HTTPRequestPolicy
         */
        host: string;
        /**
         * 消息地址
         *
         * @type {string}
         * @memberof HTTPRequestPolicy
         */
        path: string;
        /**
         * HTTP方法类型，默认是GET
         *
         * @type {HTTPMethod}
         * @memberof HTTPRequestPolicy
         */
        method?: HTTPMethod;
        /**
         * 失败重试次数，默认重试2次
         *
         * @type {number}
         * @memberof HTTPRequestPolicy
         */
        retryTimes?: number;
        /**
         * 超时时间，毫秒，默认10000，即10秒
         *
         * @type {number}
         * @memberof HTTPRequestPolicy
         */
        timeout?: number;
    }
    export default class HTTPRequestPolicy implements IRequestPolicy {
        /**
         * 发送请求逻辑
         *
         * @param {IHTTPRequestParams} params HTTP请求数据
         * @memberof HTTPRequestPolicy
         */
        sendRequest(request: RequestData): void;
    }
    /** 再额外导出一个实例 */
    export const httpRequestPolicy: HTTPRequestPolicy;
}
declare module "engine/Engine" {
}
declare module "view/message/ViewMessage" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * 表现层消息
    */
    export default class ViewMessage {
        /**
         * 初始化表现层实例前的消息
         *
         * @static
         * @type {string}
         * @memberof ViewMessage
         */
        static VIEW_BEFORE_INIT: string;
        /**
         * 初始化表现层实例后的消息
         *
         * @static
         * @type {string}
         * @memberof ViewMessage
         */
        static VIEW_AFTER_INIT: string;
        /**
         * 所有表现层实例都初始化完毕的消息
         *
         * @static
         * @type {string}
         * @memberof ViewMessage
         */
        static VIEW_ALL_INIT: string;
    }
}
declare module "view/View" {
    import IBridge from "view/bridge/IBridge";
    export default class View {
        private _viewDict;
        /**
         * 注册一个表现层桥实例到框架中
         *
         * @param {IBridge} view
         * @memberof View
         */
        registerBridge(view: IBridge): void;
        private testAllInit();
    }
    /** 再额外导出一个单例 */
    export const view: View;
}
