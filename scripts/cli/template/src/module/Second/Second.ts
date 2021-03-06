import { DOMMediatorClass } from "olympus-r-dom/dom/injector/Injector";
import { BindOn, BindValue } from "olympus-r/engine/injector/Injector";
import { moduleManager } from "olympus-r/engine/module/ModuleManager";
import { panelManager } from "olympus-r/engine/panel/PanelManager";
import SceneMediator from "olympus-r/engine/scene/SceneMediator";
import "./Second.css";
import template from "./Second.html";

@DOMMediatorClass("Second", template)
export default class Second extends SceneMediator
{
    @BindValue("textContent", "'这是第二个模块，是个DOM模块'")
    private text:HTMLElement;
    @BindOn("click", function(){
        panelManager.confirm(
            "回到首页？",
            ()=>moduleManager.close(Second)
        );
    })
    private btn:HTMLElement;
}