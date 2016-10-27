var Game = (function () {
    function Game() {
        this.textureList1 = {};
        this.rectTexture = [];
        this.polyTexture = [];
        this.blockMap = {};
        this.blockPair = [];
        this.blockList = [];
        this.answer = [];
        this.walked = [];
        this.switchStage = false;
        this.completed = false;
    }
    Game.prototype.start = function () {
        var _this = this;
        this.renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, { backgroundColor: 0x333333 });
        document.body.appendChild(this.renderer.view);
        this.rectTexture[8] = '0_0';
        this.rectTexture[4] = '0_1';
        this.rectTexture[2] = '0_2';
        this.rectTexture[1] = '0_3';
        this.rectTexture[12] = '1_0';
        this.rectTexture[6] = '1_1';
        this.rectTexture[3] = '1_2';
        this.rectTexture[9] = '1_3';
        this.rectTexture[10] = '2_0';
        this.rectTexture[5] = '2_1';
        this.rectTexture[14] = '3_0';
        this.rectTexture[7] = '3_1';
        this.rectTexture[11] = '3_2';
        this.rectTexture[13] = '3_3';
        for (var i = 0; i < 4; i++) {
            this.textureList1['s' + i] = PIXI.Texture.fromImage('res/s' + i + '.png');
        }
        for (var i = 0; i < 4; i++) {
            this.textureList1['n' + i] = PIXI.Texture.fromImage('res/n' + i + '.png');
        }
        this.showLevel();
        document.addEventListener('mousedown', function (event) { _this.onMouseDown(event); }, false);
        document.addEventListener('touchstart', function (event) { _this.onTouchStart(event); }, false);
        window.onkeydown = function (event) { _this.onKeyDown(event); };
        this.render();
    };
    Game.prototype.showLevel = function () {
        var _this = this;
        this.stageLevel = new PIXI.Container();
        {
            var text = new PIXI.Text('5 × 5');
            text.name = '5_5';
            text.anchor.set(0.5, 0.5);
            text.position.set(window.innerWidth / 2, 200);
            text.style.font = 'lighter 100px 微软雅黑';
            text.style.fill = '#dddddd';
            text.interactive = true;
            text.on('click', function (event) { _this.chooseLevel(event); });
            text.on('tap', function (event) { _this.chooseLevel(event); });
            this.stageLevel.addChild(text);
        }
        {
            var text = new PIXI.Text('6 × 6');
            text.name = '6_6';
            text.anchor.set(0.5, 0.5);
            text.position.set(window.innerWidth / 2, 350);
            text.style.font = 'lighter 100px 微软雅黑';
            text.style.fill = '#dddddd';
            text.interactive = true;
            text.on('click', function (event) { _this.chooseLevel(event); });
            text.on('tap', function (event) { _this.chooseLevel(event); });
            this.stageLevel.addChild(text);
        }
        {
            var text = new PIXI.Text('7 × 7');
            text.name = '7_7';
            text.anchor.set(0.5, 0.5);
            text.position.set(window.innerWidth / 2, 500);
            text.style.font = 'lighter 100px 微软雅黑';
            text.style.fill = '#dddddd';
            text.interactive = true;
            text.on('click', function (event) { _this.chooseLevel(event); });
            text.on('tap', function (event) { _this.chooseLevel(event); });
            this.stageLevel.addChild(text);
        }
        {
            var text = new PIXI.Text('7 × 10');
            text.name = '7_10';
            text.anchor.set(0.5, 0.5);
            text.position.set(window.innerWidth / 2, 650);
            text.style.font = 'lighter 100px 微软雅黑';
            text.style.fill = '#dddddd';
            text.interactive = true;
            text.on('click', function (event) { _this.chooseLevel(event); });
            text.on('tap', function (event) { _this.chooseLevel(event); });
            this.stageLevel.addChild(text);
        }
    };
    Game.prototype.initLevel = function () {
        this.blockMap = {};
        this.blockPair = [];
        this.blockList = [];
        this.steps = 0;
        this.completed = false;
    };
    Game.prototype.startGame = function () {
        var _this = this;
        this.initLevel();
        this.stageGame = new PIXI.Container();
        {
            this.buttonBack = new PIXI.Text(' < ');
            this.buttonBack.name = 'back';
            this.buttonBack.position.set(0, 10);
            this.buttonBack.style.font = 'lighter 100px 宋体';
            this.buttonBack.style.fill = '#dddddd';
            this.buttonBack.interactive = true;
            this.buttonBack.on('click', function (event) { _this.backToStageLevel(event); });
            this.buttonBack.on('tap', function (event) { _this.backToStageLevel(event); });
            this.stageGame.addChild(this.buttonBack);
        }
        {
            this.starText = new PIXI.Text('');
            this.starText.name = 'stars';
            this.starText.anchor.set(0.5, 0.5);
            this.starText.position.set(window.innerWidth / 2, 60);
            this.starText.style.font = 'lighter 64px Arial';
            this.starText.style.fill = '#dddddd';
            this.stageGame.addChild(this.starText);
        }
        {
            this.stepText = new PIXI.Text('');
            this.stepText.name = 'steps';
            this.stepText.anchor.set(1, 0.5);
            this.stepText.position.set(window.innerWidth - 50, 60);
            this.stepText.style.font = 'lighter 48px 微软雅黑';
            this.stepText.style.fill = '#dddddd';
            this.stageGame.addChild(this.stepText);
        }
        var scale = Math.min(1, window.innerWidth / (128 * this.mapWidth), (window.innerHeight - 150) / (128 * this.mapHeight));
        var size = Math.floor(128 * scale);
        size += size % 2;
        for (var i = 1; i <= this.mapHeight; i++) {
            for (var j = 1; j <= this.mapWidth; j++) {
                var tempBlock = PIXI.Sprite.fromImage('res/white.png');
                tempBlock.name = i + '_' + j;
                tempBlock.alpha = 0.5;
                tempBlock.anchor.set(0.5, 0.5);
                tempBlock.scale.set(scale, scale);
                tempBlock.rotation = Math.PI * 0.5 * Math.floor(Math.random() * 4);
                tempBlock.position.set(window.innerWidth / 2 + (j - (this.mapWidth / 2 + 0.5)) * size, 120 + (i - 0.5) * size);
                tempBlock.interactive = true;
                tempBlock.on('click', function (event) { _this.blockClicked(event); });
                tempBlock.on('tap', function (event) { _this.blockClicked(event); });
                this.blockMap[tempBlock.name] = tempBlock;
                this.stageGame.addChild(tempBlock);
            }
        }
        this.switchStage = true;
    };
    Game.prototype.render = function () {
        var _this = this;
        requestAnimationFrame(function () { _this.render(); });
        if (!this.switchStage) {
            this.renderer.render(this.stageLevel);
        }
        else {
            this.renderer.render(this.stageGame);
        }
    };
    Game.prototype.onMouseDown = function (event) {
        if (this.completed) {
            this.switchStage = false;
        }
    };
    Game.prototype.onTouchStart = function (event) {
        if (this.completed) {
            this.switchStage = false;
        }
    };
    Game.prototype.chooseLevel = function (event) {
        var str = event.target.name;
        this.mapWidth = parseInt(str.split('_')[0]);
        this.mapHeight = parseInt(str.split('_')[1]);
        this.startGame();
        this.createMap();
    };
    Game.prototype.backToStageLevel = function (event) {
        this.switchStage = false;
    };
    Game.prototype.checkAnswer = function () {
        for (var i = 1; i <= this.mapHeight; i++) {
            for (var j = 1; j <= this.mapWidth; j++) {
                if (this.blockList[i + '_' + j] != this.answer[i + '_' + j]) {
                    return false;
                }
            }
        }
        return true;
    };
    Game.prototype.blockClicked = function (event) {
        if (!this.completed) {
            var block = event.target.name;
            var img = this.blockList[block].split('_')[0];
            var rot = parseInt(this.blockList[block].split('_')[1]);
            var newRot = 0;
            if (img == '2') {
                newRot = (rot + 1) % 2;
            }
            else {
                newRot = (rot + 1) % 4;
            }
            this.blockMap[block].rotation = Math.PI * 0.5 * newRot;
            this.blockList[block] = img + '_' + newRot;
            this.steps++;
            if (this.checkAnswer()) {
                this.completed = true;
                if (this.steps <= this.minStep + 4) {
                    this.starText.text = '★★★★★';
                }
                else if (this.steps <= this.minStep + 8) {
                    this.starText.text = '★★★★☆';
                }
                else if (this.steps <= this.minStep + 12) {
                    this.starText.text = '★★★☆☆';
                }
                else if (this.steps <= this.minStep + 16) {
                    this.starText.text = '★★☆☆☆';
                }
                else {
                    this.starText.text = '★☆☆☆☆';
                }
                this.stepText.text = this.steps + '步';
            }
        }
    };
    Game.prototype.onKeyDown = function (event) {
        if (event.keyCode == 0x20) {
            this.switchStage = false;
        }
    };
    Game.prototype.createMap = function () {
        while (true) {
            var x1 = Math.floor(Math.random() * this.mapHeight) + 1;
            var y1 = Math.floor(Math.random() * this.mapWidth) + 1;
            var x2 = x1;
            var y2 = y1;
            var rand = Math.floor(Math.random() * 4);
            if (rand == 0) {
                x2--;
            }
            else if (rand == 1) {
                y2++;
            }
            else if (rand == 2) {
                x2++;
            }
            else {
                y2--;
            }
            if (x2 > 0 && x2 <= this.mapHeight && y2 > 0 && y2 <= this.mapWidth) {
                if (this.testBlock(x1 + '_' + y1) && this.testBlock(x2 + '_' + y2)) {
                    if (this.blockPair.indexOf(x1 + '_' + y1 + '|' + x2 + '_' + y2) == -1 || this.blockPair.indexOf(x2 + '_' + y2 + '|' + x1 + '_' + y1) == -1) {
                        this.blockPair.push(x1 + '_' + y1 + '|' + x2 + '_' + y2);
                        if (this.checkCircuit()) {
                            this.blockPair.pop();
                        }
                    }
                }
            }
            if (this.blockPair.length >= this.mapWidth * this.mapHeight - 1) {
                break;
            }
        }
        this.startBlock = (Math.floor(Math.random() * this.mapHeight) + 1) + '_' + (Math.floor(Math.random() * this.mapWidth) + 1);
        this.printBlock();
        this.randBlock();
    };
    Game.prototype.testBlock = function (block) {
        var count = 0;
        for (var i = 0; i < this.blockPair.length; i++) {
            if (this.blockPair[i].split('|')[0] == block || this.blockPair[i].split('|')[1] == block) {
                count++;
            }
        }
        return count < 3;
    };
    Game.prototype.DFS = function (father, node) {
        var flag = false;
        this.walked.push(node);
        for (var i = 0; i < this.blockPair.length; i++) {
            var a = this.blockPair[i].split('|')[0];
            var b = this.blockPair[i].split('|')[1];
            if (a == node && b != father) {
                if (this.walked.indexOf(b) != -1) {
                    flag = true;
                }
                else {
                    flag = flag || this.DFS(node, b);
                }
            }
            else if (b == node && a != father) {
                if (this.walked.indexOf(a) != -1) {
                    flag = true;
                }
                else {
                    flag = flag || this.DFS(node, a);
                }
            }
        }
        return flag;
    };
    Game.prototype.checkCircuit = function () {
        this.walked = [];
        var flag = false;
        for (var i = 1; i <= this.mapHeight; i++) {
            for (var j = 1; j <= this.mapWidth; j++) {
                if (this.walked.indexOf(i + '_' + j) == -1) {
                    flag = flag || this.DFS('', i + '_' + j);
                }
            }
        }
        return flag;
    };
    Game.prototype.printBlock = function () {
        for (var i = 1; i <= this.mapHeight; i++) {
            for (var j = 1; j <= this.mapWidth; j++) {
                var block = i + '_' + j;
                var num = 0;
                for (var k = 0; k < this.blockPair.length; k++) {
                    var x = -1;
                    var y = -1;
                    if (this.blockPair[k].split('|')[0] == block) {
                        x = parseInt(this.blockPair[k].split('|')[1].split('_')[0]);
                        y = parseInt(this.blockPair[k].split('|')[1].split('_')[1]);
                    }
                    else if (this.blockPair[k].split('|')[1] == block) {
                        x = parseInt(this.blockPair[k].split('|')[0].split('_')[0]);
                        y = parseInt(this.blockPair[k].split('|')[0].split('_')[1]);
                    }
                    if (x != -1 && y != -1) {
                        if (i == x + 1) {
                            num += 8;
                        }
                        else if (j == y - 1) {
                            num += 4;
                        }
                        else if (i == x - 1) {
                            num += 2;
                        }
                        else if (j == y + 1) {
                            num += 1;
                        }
                    }
                }
                if (this.blockMap[block] != null) {
                    if (this.rectTexture[num] != null) {
                        this.answer[block] = this.rectTexture[num];
                        var img = this.rectTexture[num].split('_')[0];
                        var rot = parseInt(this.rectTexture[num].split('_')[1]);
                        if (block == this.startBlock) {
                            this.blockMap[block].texture = this.textureList1['s' + img];
                        }
                        else {
                            this.blockMap[block].texture = this.textureList1['n' + img];
                        }
                        this.blockMap[block].rotation = Math.PI * 0.5 * rot;
                        this.blockMap[block].alpha = 1;
                    }
                    else {
                        this.blockMap[block].texture = PIXI.Texture.fromImage('res/white.png');
                        this.blockMap[block].alpha = 0.6;
                    }
                }
            }
        }
    };
    Game.prototype.randBlock = function () {
        this.minStep = 0;
        for (var i = 1; i <= this.mapHeight; i++) {
            for (var j = 1; j <= this.mapWidth; j++) {
                var block = i + '_' + j;
                var img = this.answer[block].split('_')[0];
                var rot = parseInt(this.answer[block].split('_')[1]);
                var newRot = 0;
                var rand = Math.floor(Math.random() * 4);
                if (img == '2') {
                    this.minStep += rand % 2;
                    newRot = (rot + rand) % 2;
                }
                else {
                    if (rand == 3) {
                        this.minStep++;
                    }
                    else {
                        this.minStep += rand;
                    }
                    newRot = (rot + rand) % 4;
                }
                this.blockMap[block].rotation = Math.PI * 0.5 * newRot;
                this.blockList[block] = img + '_' + newRot;
            }
        }
    };
    return Game;
}());
window.onload = function () {
    var game = new Game();
    game.start();
};
//# sourceMappingURL=app.js.map