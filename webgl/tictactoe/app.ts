/// <reference path="lighttool/lt_jsloader.d.ts" />
/// <reference path="lighttool/lt_htmlui.d.ts" />

window.onload = () =>
{
    lighttool.JSLoader.instance().addImportScript("lighttool/lt_htmlui.js");
    lighttool.JSLoader.instance().addImportScript("state_menu.js");
    lighttool.JSLoader.instance().addImportScript("state_game.js");

    lighttool.JSLoader.instance().preload(() =>
    {
        document.getElementById("over").hidden = true;

        var panel = document.getElementById("panel") as HTMLDivElement;
        lighttool.htmlui.panelMgr.instance().init(panel);
        lighttool.htmlui.panelMgr.instance().setbackImg("res/back.jpg");

        var tictactoe = new TicTacToe.App();
        tictactoe.changeState(new TicTacToe.stateMenu());
    });
};

namespace TicTacToe
{
    export interface IState
    {
        onInit(app: App);
        onExit();
    }
    export class App
    {
        curState: IState = null;
        changeState(s: IState)
        {
            if (this.curState != null)
            {
                this.curState.onExit();
            }
            this.curState = s;
            if (this.curState != null)
            {
                this.curState.onInit(this);
            }
        }
        data: AppData = new AppData();
    }
    export class AppData
    {
        playerFirst: boolean = true;
        playerStep: boolean = true;
    }
    
}