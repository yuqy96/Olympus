import { Easing, Tween } from "@tweenjs/tween.js";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-22
 * @modify date 2017-09-22
 *
 * 回弹效果
*/
var BackPanelPolicy = /** @class */ (function () {
    function BackPanelPolicy() {
        this._reg = /(\w*)(\d+)(\w*)/;
    }
    /**
     * 显示时调用
     * @param panel 弹出框对象
     * @param callback 完成回调，必须调用
     * @param from 动画起始点
     */
    BackPanelPolicy.prototype.pop = function (panel, callback, from) {
        var entity = panel.skin;
        // scale变换如果加在父容器上会导致子对象宽高获取错误，所以要尽可能加在子对象上
        var subEntity = entity.childElementCount > 1 ? entity : entity.children[0];
        var tween = new Tween(entity).end().stop();
        entity.style.position = "absolute";
        entity.style.left = "50%";
        entity.style.top = "50%";
        subEntity.style.transform = "scale(0)";
        // 开始缓动
        var key = "__tween__step__";
        entity[key] = 0;
        var props = {};
        props[key] = 1;
        tween.to(props, 300).easing(Easing.Back.Out).onUpdate(function () {
            subEntity.style.transform = "scale(" + entity[key] + ")";
        }).onComplete(function () {
            delete entity[key];
            subEntity.style.transform = "";
            callback();
        }).start();
    };
    /**
     * 关闭时调用
     * @param popup 弹出框对象
     * @param callback 完成回调，必须调用
     * @param to 动画完结点
     */
    BackPanelPolicy.prototype.drop = function (panel, callback, to) {
        var entity = panel.skin;
        // scale变换如果加在父容器上会导致子对象宽高获取错误，所以要尽可能加在子对象上
        var subEntity = entity.childElementCount > 1 ? entity : entity.children[0];
        var tween = new Tween(entity).end().stop();
        subEntity.style.transform = "scale(1)";
        // 开始缓动
        var key = "__tween__step__";
        entity[key] = 1;
        var props = {};
        props[key] = 0;
        tween.to(props, 300).easing(Easing.Back.In).onUpdate(function () {
            subEntity.style.transform = "scale(" + entity[key] + ")";
        }).onComplete(function () {
            delete entity[key];
            subEntity.style.transform = "";
            callback();
        }).start();
    };
    return BackPanelPolicy;
}());
export default BackPanelPolicy;
