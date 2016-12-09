var TicTacToe;
(function (TicTacToe) {
    var stateGame = (function () {
        function stateGame() {
            this.mapData = [];
            this.gameOver = false;
            this.result = "";
        }
        stateGame.prototype.onInit = function (app) {
            var _this = this;
            this.app = app;
            while (this.mapData.length > 0) {
                this.mapData.pop();
            }
            for (var i = 0; i < 9; i++) {
                this.mapData.push("");
            }
            this.gameOver = false;
            this.result = "";
            this.game = lighttool.htmlui.panelMgr.instance().createPanel("tictactoe", 482, 512);
            this.game.setTitle("TicTacToe", "res/O.png");
            this.game.canDock = false;
            this.game.canDrag = false;
            this.game.canScale = false;
            this.game.toCenter();
            this.game.btnClose.hidden = false;
            this.game.btnClose.onclick = function (ev) { app.changeState(new TicTacToe.stateMenu()); };
            var gui = new lighttool.htmlui.gui(this.game.divContent);
            gui.onchange = function () { _this.onGUI(gui); };
            gui.update();
        };
        stateGame.prototype.onGUI = function (gui) {
            if (this.app.data.playerStep) {
                gui.beginLayout_H();
                {
                    for (var i = 0; i < 9; i++) {
                        if (gui.add_Button("", "", { "background": "url(res/" + this.mapData[i] + ".png)", "width": "160px", "height": "160px" })) {
                            if (this.gameOver) {
                                this.app.changeState(new TicTacToe.stateMenu());
                            }
                            else if (this.mapData[i] == "") {
                                this.setMap(i, "O");
                                this.app.data.playerStep = false;
                                this.result = this.judge();
                            }
                        }
                    }
                }
                gui.endLayout();
                if (this.result != "") {
                    if (this.result == "O") {
                        gui.add_P("O玩家胜利", "", { "position": "absolute", "left": "100px", "top": "140px", "color": "#FF3333", "font": "normal bold 60px arial, Fantasy" });
                    }
                    else if (this.result == "X") {
                        gui.add_P("X电脑胜利", "", { "position": "absolute", "left": "100px", "top": "140px", "color": "#3333FF", "font": "normal bold 60px arial, Fantasy" });
                    }
                    else {
                        gui.add_P("平局", "", { "position": "absolute", "left": "176px", "top": "140px", "color": "#333333", "font": "normal bold 60px arial, Fantasy" });
                    }
                    this.gameOver = true;
                }
                gui.update();
            }
            else if (!this.app.data.playerStep) {
                if (!this.gameOver) {
                    this.ai();
                }
                gui.beginLayout_H();
                {
                    for (var i = 0; i < 9; i++) {
                        if (gui.add_Button("", "", { "background": "url(res/" + this.mapData[i] + ".png)", "width": "160px", "height": "160px" })) {
                            if (this.gameOver) {
                                this.app.changeState(new TicTacToe.stateMenu());
                            }
                        }
                    }
                }
                if (!this.gameOver) {
                    this.result = this.judge();
                }
                gui.endLayout();
                if (this.result != "") {
                    if (this.result == "O") {
                        gui.add_P("O玩家胜利", "", { "position": "absolute", "left": "100px", "top": "140px", "color": "#FF3333", "font": "normal bold 60px arial, Fantasy" });
                    }
                    else if (this.result == "X") {
                        gui.add_P("X电脑胜利", "", { "position": "absolute", "left": "100px", "top": "140px", "color": "#3333FF", "font": "normal bold 60px arial, Fantasy" });
                    }
                    else {
                        gui.add_P("平局", "", { "position": "absolute", "left": "176px", "top": "140px", "color": "#333333", "font": "normal bold 60px arial, Fantasy" });
                    }
                    this.gameOver = true;
                }
                gui.update();
            }
        };
        stateGame.prototype.judge = function () {
            var str = "over";
            for (var i = 0; i < 9; i++) {
                if (this.mapData[i] == "") {
                    str = "";
                }
            }
            if (this.mapData[0] != "" && this.mapData[0] == this.mapData[1] && this.mapData[1] == this.mapData[2]) {
                str = this.mapData[0];
            }
            else if (this.mapData[3] != "" && this.mapData[3] == this.mapData[4] && this.mapData[4] == this.mapData[5]) {
                str = this.mapData[3];
            }
            else if (this.mapData[6] != "" && this.mapData[6] == this.mapData[7] && this.mapData[7] == this.mapData[8]) {
                str = this.mapData[6];
            }
            else if (this.mapData[0] != "" && this.mapData[0] == this.mapData[3] && this.mapData[3] == this.mapData[6]) {
                str = this.mapData[0];
            }
            else if (this.mapData[1] != "" && this.mapData[1] == this.mapData[4] && this.mapData[4] == this.mapData[7]) {
                str = this.mapData[1];
            }
            else if (this.mapData[2] != "" && this.mapData[2] == this.mapData[5] && this.mapData[5] == this.mapData[8]) {
                str = this.mapData[2];
            }
            else if (this.mapData[0] != "" && this.mapData[0] == this.mapData[4] && this.mapData[4] == this.mapData[8]) {
                str = this.mapData[0];
            }
            else if (this.mapData[2] != "" && this.mapData[2] == this.mapData[4] && this.mapData[4] == this.mapData[6]) {
                str = this.mapData[2];
            }
            return str;
        };
        stateGame.prototype.ai = function () {
            for (var i = 0; i < 9; i++) {
                if (this.mapData[i] == "") {
                    this.setMap(i, "X");
                    if (this.judge() == "X") {
                        this.app.data.playerStep = true;
                        return;
                    }
                    this.setMap(i, "");
                }
            }
            for (var i = 0; i < 9; i++) {
                if (this.mapData[i] == "") {
                    this.setMap(i, "O");
                    if (this.judge() == "O") {
                        this.setMap(i, "X");
                        this.app.data.playerStep = true;
                        return;
                    }
                    this.setMap(i, "");
                }
            }
            var weight = [];
            if (this.app.data.playerFirst) {
                weight = [0, 1, 2, 3, 5, 6, 7, 8];
                weight.sort(function () { return 0.5 - Math.random(); });
                weight.push(4);
                weight.reverse();
                for (var i = 0; i < 9; i++) {
                    if (this.mapData[weight[i]] == "") {
                        this.setMap(weight[i], "X");
                        this.app.data.playerStep = true;
                        return;
                    }
                }
            }
            else {
                weight = [
                    0, 2, 6, 8, 4, 1, 3, 5, 7,
                    8, 6, 2, 0, 4, 1, 3, 5, 7,
                    0, 2, 6, 8, 4, 7, 5, 3, 1,
                    8, 6, 2, 0, 4, 7, 5, 3, 1,
                    2, 6, 0, 8, 4, 3, 5, 1, 7,
                    6, 2, 8, 0, 4, 5, 3, 7, 1
                ];
                var r = Math.floor(Math.random() * 6);
                for (var i = r * 9; i < (r + 1) * 9; i++) {
                    if (this.mapData[weight[i]] == "") {
                        this.setMap(weight[i], "X");
                        this.app.data.playerStep = true;
                        return;
                    }
                }
            }
        };
        stateGame.prototype.setMap = function (index, str) {
            this.mapData[index] = str;
        };
        stateGame.prototype.onExit = function () {
            lighttool.htmlui.panelMgr.instance().removePanel(this.game);
        };
        return stateGame;
    }());
    TicTacToe.stateGame = stateGame;
})(TicTacToe || (TicTacToe = {}));
//# sourceMappingURL=state_game.js.map