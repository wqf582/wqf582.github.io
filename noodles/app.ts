class Game
{
    constructor() { }

    renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
    stageLevel: PIXI.Container;
    stageGame: PIXI.Container;
    textureList1: { [id: string]: PIXI.Texture } = {};
    rectTexture: string[] = [];
    polyTexture: string[] = [];
    blockMap: { [id: string]: PIXI.Sprite } = {};
    blockPair: string[] = [];
    blockList: string[] = [];
    answer: string[] = [];
    walked: string[] = [];
    startBlock: string;
    mapWidth: number;
    mapHeight: number;
    minStep: number;
    steps: number;
    switchStage: boolean = false;
    completed: boolean = false;
    buttonBack: PIXI.Sprite;
    starText: PIXI.Text;
    stepText: PIXI.Text;

    start()
    {
        this.renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, { backgroundColor: 0x333333 });
        document.body.appendChild(this.renderer.view);

        this.rectTexture[0b1000] = '0_0';
        this.rectTexture[0b0100] = '0_1';
        this.rectTexture[0b0010] = '0_2';
        this.rectTexture[0b0001] = '0_3';
        this.rectTexture[0b1100] = '1_0';
        this.rectTexture[0b0110] = '1_1';
        this.rectTexture[0b0011] = '1_2';
        this.rectTexture[0b1001] = '1_3';
        this.rectTexture[0b1010] = '2_0';
        this.rectTexture[0b0101] = '2_1';
        this.rectTexture[0b1110] = '3_0';
        this.rectTexture[0b0111] = '3_1';
        this.rectTexture[0b1011] = '3_2';
        this.rectTexture[0b1101] = '3_3';

        for (var i = 0; i < 4; i++)
        {
            this.textureList1['s' + i] = PIXI.Texture.fromImage('res/s' + i + '.png');
        }
        for (var i = 0; i < 4; i++)
        {
            this.textureList1['n' + i] = PIXI.Texture.fromImage('res/n' + i + '.png');
        }

        this.showLevel();

        document.addEventListener('mousedown', (event) => { this.onMouseDown(event); }, false);
        document.addEventListener('touchstart', (event) => { this.onTouchStart(event); }, false);
        window.onkeydown = (event) => { this.onKeyDown(event); };
        
        this.render();
    }

    showLevel()
    {
        this.stageLevel = new PIXI.Container();
        {
            var text = PIXI.Sprite.fromImage('res/5_5.png');
            text.name = '5_5';
            text.anchor.set(0.5, 0.5);
            text.position.set(window.innerWidth / 2, 80);
            text.interactive = true;
            text.on('click', (event) => { this.chooseLevel(event); });
            text.on('tap', (event) => { this.chooseLevel(event); });
            this.stageLevel.addChild(text);
        }
        {
            var text = PIXI.Sprite.fromImage('res/6_6.png');
            text.name = '6_6';
            text.anchor.set(0.5, 0.5);
            text.position.set(window.innerWidth / 2, 240);
            text.interactive = true;
            text.on('click', (event) => { this.chooseLevel(event); });
            text.on('tap', (event) => { this.chooseLevel(event); });
            this.stageLevel.addChild(text);
        }
        {
            var text = PIXI.Sprite.fromImage('res/7_7.png');
            text.name = '7_7';
            text.anchor.set(0.5, 0.5);
            text.position.set(window.innerWidth / 2, 400);
            text.interactive = true;
            text.on('click', (event) => { this.chooseLevel(event); });
            text.on('tap', (event) => { this.chooseLevel(event); });
            this.stageLevel.addChild(text);
        }
        {
            var text = PIXI.Sprite.fromImage('res/7_10.png');
            text.name = '7_10';
            text.anchor.set(0.5, 0.5);
            text.position.set(window.innerWidth / 2, 560);
            text.interactive = true;
            text.on('click', (event) => { this.chooseLevel(event); });
            text.on('tap', (event) => { this.chooseLevel(event); });
            this.stageLevel.addChild(text);
        }
    }

    initLevel()
    {
        this.blockMap = {};
        this.blockPair = [];
        this.blockList = [];
        this.steps = 0;
        this.completed = false;
    }

    startGame()
    {
        this.initLevel();
        this.stageGame = new PIXI.Container();

        {
            this.buttonBack = PIXI.Sprite.fromImage('res/back.png');
            this.buttonBack.name = 'back';
            this.buttonBack.position.set(0, 0);
            this.buttonBack.interactive = true;
            this.buttonBack.on('click', (event) => { this.backToStageLevel(event); });
            this.buttonBack.on('tap', (event) => { this.backToStageLevel(event); });
            this.stageGame.addChild(this.buttonBack);
        }
        {
            this.starText = new PIXI.Text('');
            this.starText.name = 'stars';
            this.starText.anchor.set(0.5, 0.5);
            this.starText.position.set(window.innerWidth / 2, 40);
            this.starText.style.fontFamily = 'Arial';
            this.starText.style.fontWeight = 'lighter';
            this.starText.style.fontSize = 50;
            this.starText.style.fill = '#ffffff';
            this.stageGame.addChild(this.starText);
        }
        {
            this.stepText = new PIXI.Text('');
            this.stepText.name = 'steps';
            this.stepText.anchor.set(1, 0.5);
            this.stepText.position.set(window.innerWidth - 10, 40);
            this.stepText.style.fontFamily = 'Arial';
            this.stepText.style.fontWeight = 'lighter';
            this.stepText.style.fontSize = 40;
            this.stepText.style.fill = '#ffffff';
            this.stageGame.addChild(this.stepText);
        }

        var scale = Math.min(1, window.innerWidth / (128 * this.mapWidth), (window.innerHeight - 120) / (128 * this.mapHeight));
        var size = Math.floor(128 * scale);
        size += size % 2;

        for (var i = 1; i <= this.mapHeight; i++)
        {
            for (var j = 1; j <= this.mapWidth; j++)
            {
                var tempBlock = PIXI.Sprite.fromImage('res/white.png');
                tempBlock.name = i + '_' + j;
                tempBlock.alpha = 0.5;
                tempBlock.anchor.set(0.5, 0.5);
                tempBlock.scale.set(scale, scale);
                tempBlock.rotation = Math.PI * 0.5 * Math.floor(Math.random() * 4);
                tempBlock.position.set(window.innerWidth / 2 + (j - (this.mapWidth / 2 + 0.5)) * size, 100 + (i - 0.5) * size);
                tempBlock.interactive = true;
                tempBlock.on('click', (event) => { this.blockClicked(event); });
                tempBlock.on('tap', (event) => { this.blockClicked(event); });
                this.blockMap[tempBlock.name] = tempBlock;
                this.stageGame.addChild(tempBlock);
            }
        }

        this.switchStage = true;
    }

    render()
    {
        requestAnimationFrame(() => { this.render(); });

        if (!this.switchStage)
        {
            this.renderer.render(this.stageLevel);
        }
        else
        {
            this.renderer.render(this.stageGame);
        }
    }

    onMouseDown(event: MouseEvent)
    {
        if (this.completed)
        {
            this.switchStage = false;
        }
    }

    onTouchStart(event: TouchEvent)
    {
        if (this.completed)
        {
            this.switchStage = false;
        }
    }

    chooseLevel(event: PIXI.interaction.InteractionEvent)
    {
        var str: string = event.target.name;
        this.mapWidth = parseInt(str.split('_')[0]);
        this.mapHeight = parseInt(str.split('_')[1]);
        this.startGame();
        this.createMap();
    }

    backToStageLevel(event: PIXI.interaction.InteractionEvent)
    {
        this.switchStage = false;
    }

    checkAnswer(): boolean
    {
        for (var i = 1; i <= this.mapHeight; i++)
        {
            for (var j = 1; j <= this.mapWidth; j++)
            {
                if (this.blockList[i + '_' + j] != this.answer[i + '_' + j])
                {
                    return false;
                }
            }
        }
        return true;
    }

    blockClicked(event: PIXI.interaction.InteractionEvent)
    {
        if (!this.completed)
        {
            var block: string = event.target.name;

            var img = this.blockList[block].split('_')[0];
            var rot = parseInt(this.blockList[block].split('_')[1]);
            var newRot = 0;

            if (img == '2')
            {
                newRot = (rot + 1) % 2;
            }
            else
            {
                newRot = (rot + 1) % 4;
            }
            this.blockMap[block].rotation = Math.PI * 0.5 * newRot;
            this.blockList[block] = img + '_' + newRot;

            this.steps++;

            if (this.checkAnswer())
            {
                this.completed = true;
                if (this.steps <= this.minStep + 6)
                {
                    this.starText.text = '★★★★★';
                }
                else if (this.steps <= this.minStep + 12)
                {
                    this.starText.text = '★★★★☆';
                }
                else if (this.steps <= this.minStep + 18)
                {
                    this.starText.text = '★★★☆☆';
                }
                else if (this.steps <= this.minStep + 24)
                {
                    this.starText.text = '★★☆☆☆';
                }
                else
                {
                    this.starText.text = '★☆☆☆☆';
                }
                this.stepText.text = this.steps.toString() + ' steps';
            }
        }
    }

    onKeyDown(event: KeyboardEvent)
    {
        if (event.keyCode == 32)//SPACEBAR
        {
            this.switchStage = false;
        }
    }

    createMap()
    {
        while (true)
        {
            var x1 = Math.floor(Math.random() * this.mapHeight) + 1;
            var y1 = Math.floor(Math.random() * this.mapWidth) + 1;
            var x2 = x1;
            var y2 = y1;
            var rand = Math.floor(Math.random() * 4);
            if (rand == 0)
            {
                x2--;
            }
            else if (rand == 1)
            {
                y2++;
            }
            else if (rand == 2)
            {
                x2++;
            }
            else
            {
                y2--;
            }
            if (x2 > 0 && x2 <= this.mapHeight && y2 > 0 && y2 <= this.mapWidth)
            {
                if (this.testBlock(x1 + '_' + y1) && this.testBlock(x2 + '_' + y2))
                {
                    if (this.blockPair.indexOf(x1 + '_' + y1 + '|' + x2 + '_' + y2) == -1 || this.blockPair.indexOf(x2 + '_' + y2 + '|' + x1 + '_' + y1) == -1)
                    {
                        this.blockPair.push(x1 + '_' + y1 + '|' + x2 + '_' + y2);
                        if (this.checkCircuit())
                        {
                            this.blockPair.pop();
                        }
                    }
                }
            }
            if (this.blockPair.length >= this.mapWidth * this.mapHeight - 1)
            {
                break;
            }
        }

        this.startBlock = (Math.floor(Math.random() * this.mapHeight) + 1) + '_' + (Math.floor(Math.random() * this.mapWidth) + 1);

        this.printBlock();
        this.randBlock();
    }

    testBlock(block: string): boolean
    {
        var count = 0;
        for (var i = 0; i < this.blockPair.length; i++)
        {
            if (this.blockPair[i].split('|')[0] == block || this.blockPair[i].split('|')[1] == block)
            {
                count++;
            }
        }
        return count < 3;
    }

    DFS(father: string, node: string): boolean
    {
        var flag = false;
        this.walked.push(node);
        for (var i = 0; i < this.blockPair.length; i++)
        {
            var a = this.blockPair[i].split('|')[0];
            var b = this.blockPair[i].split('|')[1];
            if (a == node && b != father)
            {
                if (this.walked.indexOf(b) != -1)
                {
                    flag = true;
                }
                else
                {
                    flag = flag || this.DFS(node, b);
                }
            }
            else if (b == node && a != father)
            {
                if (this.walked.indexOf(a) != -1)
                {
                    flag = true;
                }
                else
                {
                    flag = flag || this.DFS(node, a);
                }
            }
        }
        return flag;
    }

    checkCircuit(): boolean
    {
        this.walked = [];
        var flag = false;
        for (var i = 1; i <= this.mapHeight; i++)
        {
            for (var j = 1; j <= this.mapWidth; j++)
            {
                if (this.walked.indexOf(i + '_' + j) == -1)
                {
                    flag = flag || this.DFS('', i + '_' + j);
                }
            }
        }
        return flag;
    }

    printBlock()
    {
        for (var i = 1; i <= this.mapHeight; i++)
        {
            for (var j = 1; j <= this.mapWidth; j++)
            {
                var block = i + '_' + j;
                var num = 0;
                for (var k = 0; k < this.blockPair.length; k++)
                {
                    var x = -1;
                    var y = -1;
                    if (this.blockPair[k].split('|')[0] == block)
                    {
                        x = parseInt(this.blockPair[k].split('|')[1].split('_')[0]);
                        y = parseInt(this.blockPair[k].split('|')[1].split('_')[1]);
                    }
                    else if (this.blockPair[k].split('|')[1] == block)
                    {
                        x = parseInt(this.blockPair[k].split('|')[0].split('_')[0]);
                        y = parseInt(this.blockPair[k].split('|')[0].split('_')[1]);
                    }

                    if (x != -1 && y != -1)
                    {
                        if (i == x + 1)
                        {
                            num += 0b1000;
                        }
                        else if (j == y - 1)
                        {
                            num += 0b0100;
                        }
                        else if (i == x - 1)
                        {
                            num += 0b0010;
                        }
                        else if (j == y + 1)
                        {
                            num += 0b0001;
                        }
                    }
                }
                if (this.blockMap[block] != null)
                {
                    if (this.rectTexture[num] != null)
                    {
                        this.answer[block] = this.rectTexture[num];

                        var img = this.rectTexture[num].split('_')[0];
                        var rot = parseInt(this.rectTexture[num].split('_')[1]);

                        if (block == this.startBlock)
                        {
                            this.blockMap[block].texture = this.textureList1['s' + img];
                        }
                        else
                        {
                            this.blockMap[block].texture = this.textureList1['n' + img];
                        }
                        this.blockMap[block].rotation = Math.PI * 0.5 * rot;
                        this.blockMap[block].alpha = 1;
                    }
                    else
                    {
                        this.blockMap[block].texture = PIXI.Texture.fromImage('res/white.png');
                        this.blockMap[block].alpha = 0.6;
                    }
                }
            }
        }
    }

    randBlock()
    {
        this.minStep = 0;
        for (var i = 1; i <= this.mapHeight; i++)
        {
            for (var j = 1; j <= this.mapWidth; j++)
            {
                var block = i + '_' + j;
                var img = this.answer[block].split('_')[0];
                var rot = parseInt(this.answer[block].split('_')[1]);
                var newRot = 0;

                var rand = Math.floor(Math.random() * 4) + 1;
                if (img == '2')
                {
                    this.minStep += rand % 2;
                    newRot = (rot + rand) % 2;
                }
                else
                {
                    this.minStep += (4 - rand);
                    newRot = (rot + rand) % 4;
                }
                this.blockMap[block].rotation = Math.PI * 0.5 * newRot;
                this.blockList[block] = img + '_' + newRot;
            }
        }
    }

}

window.onload = () =>
{
    var game = new Game();
    game.start();
};
