var TicTacToe;
(function (TicTacToe) {
    var stateMenu = (function () {
        function stateMenu() {
            this.username = "";
            this.code = "";
            this.saveCode = false;
        }
        stateMenu.prototype.onInit = function (app) {
            var _this = this;
            this.app = app;
            this.menu = lighttool.htmlui.panelMgr.instance().createPanel("tictactoe", 240, 160);
            this.menu.setTitle("TicTacToe", "res/O.png");
            this.menu.canDock = false;
            this.menu.canDrag = false;
            this.menu.canScale = false;
            this.menu.toCenter();
            var gui = new lighttool.htmlui.gui(this.menu.divContent);
            gui.onchange = function () { _this.onGUI(gui); };
            gui.update();
        };
        stateMenu.prototype.onGUI = function (gui) {
            gui.add_Space();
            gui.beginLayout_H();
            {
                gui.add_Space();
                this.app.data.playerFirst = gui.add_Checkbox("O玩家先手", this.app.data.playerFirst);
                gui.add_Space();
                this.app.data.playerFirst = !gui.add_Checkbox("X电脑先手", !this.app.data.playerFirst);
                this.app.data.playerStep = this.app.data.playerFirst;
            }
            gui.endLayout();
            gui.add_Space(32, 32);
            gui.beginLayout_H();
            {
                gui.add_Space(80);
                if (gui.add_Button("开始游戏", "", { "width": "80px" })) {
                    this.app.changeState(new TicTacToe.stateGame());
                }
            }
            gui.endLayout();
        };
        stateMenu.prototype.onExit = function () {
            lighttool.htmlui.panelMgr.instance().removePanel(this.menu);
        };
        return stateMenu;
    }());
    TicTacToe.stateMenu = stateMenu;
})(TicTacToe || (TicTacToe = {}));
//# sourceMappingURL=state_menu.js.map