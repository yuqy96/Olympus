import Module from "engine/module/Module";
import ResponseData from "engine/net/ResponseData";
import { ModuleClass } from "Injector";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-18
 * @modify date 2017-09-18
 * 
 * 测试第二个模块
*/
@ModuleClass
export default class SecondModule extends Module
{
    public onOpen(data?:any):void
    {
        console.log("second module open");
    }

    public onGetResponses(responses:ResponseData[]):void
    {
        console.log("second module gotResponse");
    }

    public onActivate(from:any, data?:any):void
    {
        console.log("second module activate");
    }
}