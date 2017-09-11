import Mediator from "../component/Mediator"
import IBridge from "../../view/bridge/IBridge"
import IPopup from "./IPopup"
import IPopupPolicy from "./IPopupPolicy"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 * 
 * 实现了IPopup接口的弹窗中介者基类
*/
export default abstract class PopupMediator extends Mediator implements IPopup
{
    public constructor(bridge:IBridge, skin?:any, policy?:IPopupPolicy)
    {
        super(bridge, skin);
        this.setPolicy(policy);
    }

    private _policy:IPopupPolicy;
    /**
     * 获取弹出策略
     * 
     * @returns {IPopupPolicy} 弹出策略
     * @memberof PopupMediator
     */
    public getPolicy():IPopupPolicy
    {
        return this._policy;
    }
    /**
     * 设置弹出策略
     * 
     * @param {IPopupPolicy} policy 设置弹出策略
     * @memberof PopupMediator
     */
    public setPolicy(policy:IPopupPolicy):void
    {
        this._policy = policy;
    }

    /**
     * 在弹出前调用的方法
     * 
     * @memberof PopupMediator
     */
    public onBeforeOpen():void
    {
        // 子类可以重写该方法
    }

    /**
     * 在弹出后调用的方法
     * 
     * @memberof PopupMediator
     */
    public onAfterOpen():void
    {
        // 子类可以重写该方法
    }

    /**
     * 在关闭前调用的方法
     * 
     * @memberof PopupMediator
     */
    public onBeforeClose():void
    {
        // 子类可以重写该方法
    }

    /**
     * 在关闭后调用的方法
     * 
     * @memberof PopupMediator
     */
    public onAfterClose():void
    {
        // 子类可以重写该方法
    }
}