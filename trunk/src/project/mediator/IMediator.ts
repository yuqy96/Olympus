import IComponent from '../../kernel/interfaces/IComponent';
import ResponseData from "../net/ResponseData";
import IMediatorBasicPart from "./IMediatorBasicPart";
import IMediatorModulePart from "./IMediatorModulePart";
import IBridgeExt from '../bridge/IBridgeExt';

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-04
 * @modify date 2017-09-04
 * 
 * 界面中介者接口
*/
export default interface IMediator extends IComponent, IMediatorBasicPart, IMediatorModulePart
{
    /**
     * 中介者拥有的桥是扩展桥
     *
     * @type {IBridgeExt}
     * @memberof IMediator
     */
    bridge:IBridgeExt;
    
    /**
     * 当所需资源加载完毕后调用
     * 
     * @param {Error} [err] 加载出错会给出错误对象，没错则不给
     * @memberof IMediator
     */
    onLoadAssets(err?:Error):void;
    
    /**
     * 当所需CSS加载完毕后调用
     * 
     * @param {Error} [err] 加载出错会给出错误对象，没错则不给
     * @memberof IMediator
     */
    onLoadStyleFiles(err?:Error):void;
    
    /**
     * 当所需js加载完毕后调用
     * 
     * @param {Error} [err] 加载出错会给出错误对象，没错则不给
     * @memberof IMediator
     */
    onLoadJsFiles(err?:Error):void;
    
    /**
     * 当所需资源加载完毕后调用
     * 
     * @param {Error} [err] 加载出错会给出错误对象，没错则不给
     * @memberof IMediator
     */
    onSendInitRequests(err?:Error):void;

    /**
     * 当获取到所有初始化请求返回时调用，可以通过返回一个true来阻止模块的打开
     * 
     * @param {ResponseData[]} responses 返回结构数组
     * @returns {boolean} 返回true则表示停止模块打开
     * @memberof IMediator
     */
    onGetResponses(responses:ResponseData[]):boolean;
    
    /**
     * 其他模块被关闭回到当前模块时调用
     * 
     * @param {(IMediator|undefined)} from 从哪个模块回到当前模块
     * @param {*} [data] 可能的参数传递
     * @memberof IMediator
     */
    onWakeUp(from:IMediator|undefined, data?:any):void;

    /**
     * 模块切换到前台时调用（与onWakeUp的区别是open时onActivate会触发，但onWakeUp不会）
     * 
     * @param {(IMediator|undefined)} from 从哪个模块来到当前模块
     * @param {*} [data] 可能的参数传递
     * @memberof IMediator
     */
    onActivate(from:IMediator|undefined, data?:any):void;

    /**
     * 模块切换到后台时调用（close之后或者其他模块打开时）
     * 
     * @param {(IMediator|undefined)} to 将要去往哪个模块
     * @param {*} [data] 可能的参数传递
     * @memberof IMediator
     */
    onDeactivate(to:IMediator|undefined, data?:any):void;
}