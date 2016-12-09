/// <reference path="lighttool/lt_jsloader.d.ts" />
/// <reference path="lighttool/lt_htmlui.d.ts" />
window.onload = function () {
    lighttool.JSLoader.instance().addImportScript("lighttool/lt_htmlui.js");
    lighttool.JSLoader.instance().addImportScript("state_menu.js");
    lighttool.JSLoader.instance().addImportScript("state_game.js");
    lighttool.JSLoader.instance().preload(function () {
        document.getElementById("over").hidden = true;
        var panel = document.getElementById("panel");
        lighttool.htmlui.panelMgr.instance().init(panel);
        lighttool.htmlui.panelMgr.instance().setbackImg("res/back.jpg");
        var tictactoe = new TicTacToe.App();
        tictactoe.changeState(new TicTacToe.stateMenu());
    });
};
var TicTacToe;
(function (TicTacToe) {
    var App = (function () {
        function App() {
            this.curState = null;
            this.data = new AppData();
        }
        App.prototype.changeState = function (s) {
            if (this.curState != null) {
                this.curState.onExit();
            }
            this.curState = s;
            if (this.curState != null) {
                this.curState.onInit(this);
            }
        };
        return App;
    }());
    TicTacToe.App = App;
    var AppData = (function () {
        function AppData() {
            this.playerFirst = true;
            this.playerStep = true;
        }
        return AppData;
    }());
    TicTacToe.AppData = AppData;
})(TicTacToe || (TicTacToe = {}));
//# sourceMappingURL=app.js.map