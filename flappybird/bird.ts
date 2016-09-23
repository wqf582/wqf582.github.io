class FlappyBird
{
    static Instance: FlappyBird;

    constructor() { }

    renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
    stage: PIXI.Container;
    bg: PIXI.Sprite;
    bgTexture: PIXI.Texture[] = [];
    land: PIXI.Sprite;
    pipeDown: PIXI.Sprite[] = [];
    pipeUp: PIXI.Sprite[] = [];
    pipeTexture: PIXI.Texture[] = [];
    tutorial: PIXI.Sprite;
    ready: PIXI.Sprite;
    gameOver: PIXI.Sprite;
    number: PIXI.Sprite[] = [];
    numberTexture: PIXI.Texture[] = [];
    bird: PIXI.Sprite;
    birdTexture: PIXI.Texture[] = [];
    birdTextureIndex: number;

    localScale: number;
    score: number;
    speed: number;
    lastTime: number;
    timer: number;
    upVelocityY: number;
    velocityY: number;
    maxVelocityY: number;
    accelerationY: number;
    upAngularZ: number;
    downAngularZ: number;
    angularZ: number;
    maxAngularZ: number;
    minAngularZ: number;
    range: number;
    checkPipePos: number;
    isRunning: boolean;
    isGameOver: boolean;
    isLanded: boolean;

    init()
    {
        this.initData();

        this.renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, { backgroundColor: 0x000000 });
        document.body.appendChild(this.renderer.view);

        this.stage = new PIXI.Container();
        
        {//bg
            var bgTex1 = PIXI.Texture.fromImage('image/bg_day.png', false, PIXI.SCALE_MODES.NEAREST);
            this.bgTexture.push(bgTex1);
            var bgTex2 = PIXI.Texture.fromImage('image/bg_night.png', false, PIXI.SCALE_MODES.NEAREST);
            this.bgTexture.push(bgTex2);

            this.bg = new PIXI.Sprite(this.bgTexture[Math.floor(Math.random() * 2)]);
            this.bg.scale.set(this.localScale, this.localScale);
            this.bg.anchor.set(0.5, 0.5);
            this.bg.position.set(window.innerWidth * 0.5, window.innerHeight * 0.5);
            this.stage.addChild(this.bg);
        }
        {//pipe
            var pipeTex1 = PIXI.Texture.fromImage('image/pipe_down.png', false, PIXI.SCALE_MODES.NEAREST);
            this.pipeTexture.push(pipeTex1);
            var pipeTex2 = PIXI.Texture.fromImage('image/pipe_up.png', false, PIXI.SCALE_MODES.NEAREST);
            this.pipeTexture.push(pipeTex2);

            for (var i = 0; i < 4; i++)
            {
                this.genPipe(200 + i * 180);
            }
        }
        {//mask
            var mask = new PIXI.Graphics();
            mask.lineStyle(0);
            mask.beginFill(0xffffff);
            mask.moveTo(window.innerWidth * 0.5 - 144 * this.localScale, 0);
            mask.lineTo(window.innerWidth * 0.5 + 144 * this.localScale, 0);
            mask.lineTo(window.innerWidth * 0.5 + 144 * this.localScale, window.innerHeight);
            mask.lineTo(window.innerWidth * 0.5 - 144 * this.localScale, window.innerHeight);
            mask.lineTo(window.innerWidth * 0.5 - 144 * this.localScale, 0);
            mask.endFill();
            this.stage.mask = mask;
        }
        {//land
            var landTex = PIXI.Texture.fromImage('image/land.png', false, PIXI.SCALE_MODES.NEAREST);
            this.land = new PIXI.Sprite(landTex);
            this.land.scale.set(this.localScale, this.localScale);
            this.land.anchor.set(0.5, 1);
            this.land.position.set(window.innerWidth * 0.5, window.innerHeight);
            this.stage.addChild(this.land);
        }
        {//bird
            this.birdTextureIndex = 1;
            var rand = Math.floor(Math.random() * 3);
            for (var i = 0; i < 3; i++)
            {
                var tex = PIXI.Texture.fromImage('image/bird' + rand + '_' + i + '.png', false, PIXI.SCALE_MODES.NEAREST);
                this.birdTexture.push(tex);
            }
            this.bird = new PIXI.Sprite(this.birdTexture[this.birdTextureIndex]);
            this.bird.scale.set(this.localScale, this.localScale);
            this.bird.anchor.set(0.5, 0.5);
            this.bird.position.set(window.innerWidth * 0.5 - 50 * this.localScale, window.innerHeight * 0.5);
            this.stage.addChild(this.bird);
        }
        {//ready
            var readyTex = PIXI.Texture.fromImage('image/text_ready.png', false, PIXI.SCALE_MODES.NEAREST);
            this.ready = new PIXI.Sprite(readyTex);
            this.ready.scale.set(this.localScale, this.localScale);
            this.ready.anchor.set(0.5, 0.5);
            this.ready.position.set(window.innerWidth * 0.5, window.innerHeight * 0.5 - 50 * this.localScale);
            this.stage.addChild(this.ready);
        }
        {//game_over
            var gameOverTex = PIXI.Texture.fromImage('image/text_game_over.png', false, PIXI.SCALE_MODES.NEAREST);
            this.gameOver = new PIXI.Sprite(gameOverTex);
            this.gameOver.scale.set(this.localScale, this.localScale);
            this.gameOver.anchor.set(0.5, 0.5);
            this.gameOver.position.set(window.innerWidth * 0.5, window.innerHeight * 0.5 - 50 * this.localScale);
            this.stage.addChild(this.gameOver);
            this.gameOver.visible = false;
        }
        {//tutorial
            var tutorialTex = PIXI.Texture.fromImage('image/tutorial.png', false, PIXI.SCALE_MODES.NEAREST);
            this.tutorial = new PIXI.Sprite(tutorialTex);
            this.tutorial.scale.set(this.localScale, this.localScale);
            this.tutorial.anchor.set(0.5, 0.5);
            this.tutorial.position.set(window.innerWidth * 0.5, window.innerHeight * 0.5 + 38 * this.localScale);
            this.stage.addChild(this.tutorial);
        }
        {//number
            for (var i = 0; i < 10; i++)
            {
                var numTex = PIXI.Texture.fromImage('image/font_0' + (48 + i) + '.png', false, PIXI.SCALE_MODES.NEAREST);
                this.numberTexture.push(numTex);
            }
        }
        document.addEventListener('mousedown', (event) => { this.onMouseDown(event); }, false);
        document.addEventListener('touchstart', (event) => { this.onTouchStart(event); }, false);
        window.addEventListener('resize', (event) => { this.onWindowResized(event); }, false);
        
        this.render();
    }

    initData()
    {
        this.localScale = Math.min(window.innerHeight / 512, window.innerWidth / 288);
        this.isRunning = false;
        this.isGameOver = false;
        this.isLanded = false;
        this.range = 205;
        this.score = 0;
        this.checkPipePos = 1000;
        this.speed = -2 * this.localScale;
        this.upVelocityY = -5.4 * this.localScale;
        this.maxVelocityY = 15 * this.localScale;
        this.accelerationY = 0.32 * this.localScale;
        this.minAngularZ = -0.15 * Math.PI;
        this.maxAngularZ = 0.5 * Math.PI;
        this.upAngularZ = -0.05 * Math.PI;
        this.downAngularZ = 0.03 * Math.PI;
    }

    genPipe(x: number)
    {
        var pos = -44 + 25 * Math.floor(Math.random() * 9);
        var down = new PIXI.Sprite(this.pipeTexture[0]);
        down.scale.set(this.localScale, this.localScale);
        down.anchor.set(0.5, 0.5);
        down.position.x = window.innerWidth * 0.5 + x * this.localScale;
        down.position.y = window.innerHeight * 0.5 - (pos + this.range) * this.localScale;
        this.stage.addChild(down);
        this.pipeDown.push(down);
        var up = new PIXI.Sprite(this.pipeTexture[1]);
        up.scale.set(this.localScale, this.localScale);
        up.anchor.set(0.5, 0.5);
        up.position.x = window.innerWidth * 0.5 + x * this.localScale;
        up.position.y = window.innerHeight * 0.5 - (pos - this.range) * this.localScale;
        this.stage.addChild(up);
        this.pipeUp.push(up);
    }

    start()
    {
        if (!this.isRunning)
        {
            this.ready.visible = false;
            this.tutorial.visible = false;

            this.printScore();

            this.timer = 0;
            this.lastTime = Date.now();
            this.isRunning = true;
        }
    }

    restart()
    {
        this.initData();

        this.gameOver.visible = false;
        this.ready.visible = true;
        this.tutorial.visible = true;

        this.bird.position.y = window.innerHeight * 0.5;
        this.bird.rotation = 0;
        for (var i = 0; i < 4; i++)
        {
            var x = 200 + i * 180;
            var pos = -44 + 25 * Math.floor(Math.random() * 9);

            this.pipeDown[i].position.x = window.innerWidth * 0.5 + x * this.localScale;
            this.pipeDown[i].position.y = window.innerHeight * 0.5 - (pos + this.range) * this.localScale;

            this.pipeUp[i].position.x = window.innerWidth * 0.5 + x * this.localScale;
            this.pipeUp[i].position.y = window.innerHeight * 0.5 - (pos - this.range) * this.localScale;
        }
        while (this.number.length > 0)
        {
            this.stage.removeChild(this.number.pop());
        }
    }

    render()
    {
        if (this.isRunning)
        {
            var deltaTime = Date.now() - this.lastTime;
            this.lastTime = Date.now();
            this.timer += deltaTime;

            if (!this.isGameOver)
            {
                this.landMove();
                this.checkAddScore();
                this.isGameOver = this.collisionDetection();
                if (this.isGameOver)
                {
                    this.gameOver.visible = true;
                }
            }
            this.birdControl();
            this.birdLanded();
        }

        requestAnimationFrame(() => { this.render(); });
        this.renderer.render(this.stage);
    }

    birdControl()
    {
        if (this.velocityY < this.maxVelocityY)
        {
            this.velocityY += this.accelerationY;
        }
        this.bird.position.y += this.velocityY;

        if (this.timer >= 100)
        {
            this.birdTextureIndex = (this.birdTextureIndex + 1) % 3;
            this.bird.texture = this.birdTexture[this.birdTextureIndex];
            this.timer = 0;
        }

        if (this.velocityY < 0)
        {
            this.angularZ = this.upAngularZ;
            if (this.bird.rotation > this.minAngularZ)
            {
                this.bird.rotation += this.angularZ;
            }
        }
        else
        {
            this.angularZ = this.downAngularZ;
            if (this.bird.rotation < this.maxAngularZ)
            {
                this.bird.rotation += this.angularZ;
            }
            else
            {
                this.bird.rotation = this.maxAngularZ;
            }
        }
    }

    landMove()
    {
        this.land.position.x += this.speed;
        if (this.land.position.x <= this.bg.position.x - 24 * this.localScale)
        {
            this.land.position.x = this.bg.position.x + 24 * this.localScale;
        }

        for (var i = 0; i < 4; i++)
        {
            this.pipeDown[i].position.x += this.speed;
            this.pipeUp[i].position.x += this.speed;
        }

        if (this.pipeDown[0].position.x <= this.bg.position.x - 200 * this.localScale)
        {
            var x = 520;
            var pos = -44 + 25 * Math.floor(Math.random() * 9);

            var down = this.pipeDown.shift();
            down.position.x = window.innerWidth * 0.5 + x * this.localScale;
            down.position.y = window.innerHeight * 0.5 - (pos + this.range) * this.localScale;
            this.pipeDown.push(down);

            var up = this.pipeUp.shift();
            up.position.x = window.innerWidth * 0.5 + x * this.localScale;
            up.position.y = window.innerHeight * 0.5 - (pos - this.range) * this.localScale;
            this.pipeUp.push(up);
        }
    }

    collisionDetection(): boolean
    {
        for (var i = 0; i < 4; i++)
        {
            if (this.bird.position.y < this.pipeDown[i].position.y + 172 * this.localScale &&
                this.bird.position.x > this.pipeDown[i].position.x - 36 * this.localScale &&
                this.bird.position.x < this.pipeDown[i].position.x + 33 * this.localScale)
            {
                return true;
            }
            if (this.bird.position.y > this.pipeUp[i].position.y - 174 * this.localScale &&
                this.bird.position.x > this.pipeUp[i].position.x - 36 * this.localScale &&
                this.bird.position.x < this.pipeUp[i].position.x + 33 * this.localScale)
            {
                return true;
            }
        }
        return false;
    }

    birdLanded()
    {
        if (this.bird.position.y > window.innerHeight * 0.5 + 130 * this.localScale)
        {
            this.bird.position.y = window.innerHeight * 0.5 + 130 * this.localScale;
            this.bird.rotation = this.maxAngularZ;

            this.isRunning = false;
            this.isLanded = true;
            if (!this.isGameOver)
            {
                this.isGameOver = true;
                this.gameOver.visible = true;
            }
        }
    }

    checkAddScore()
    {
        var dis = 1000;
        var pos;
        for (var i = 0; i < 4; i++)
        {
            if (Math.abs(this.bird.position.x - this.pipeDown[i].position.x) < dis)
            {
                dis = Math.abs(this.bird.position.x - this.pipeDown[i].position.x);
                pos = this.pipeDown[i].position.x;
            }
        }
        if (this.checkPipePos >= this.bird.position.x && pos < this.bird.position.x)
        {
            this.score++;
            this.printScore();
        }
        this.checkPipePos = pos;
    }

    printScore()
    {
        while (this.number.length > 0)
        {
            this.stage.removeChild(this.number.pop());
        }

        var s = this.score;
        var len = s.toString().length;
        var pos;
        if (len % 2 == 0)
        {
            pos = (len / 2) * 24 - 12;
        }
        else
        {
            pos = ((len - 1) / 2) * 24;
        }
        for (var i = 0; i < len; i++)
        {
            var tex = new PIXI.Sprite(this.numberTexture[s % 10]);
            tex.scale.set(this.localScale, this.localScale);
            tex.anchor.set(0.5, 0.5);
            tex.position.x = window.innerWidth * 0.5 + (pos - i * 26) * this.localScale;
            tex.position.y = window.innerHeight * 0.5 - 180 * this.localScale;
            this.stage.addChild(tex);
            this.number.push(tex);
            s = Math.round(s / 10);
        }
    }

    onWindowResized(event)
    {
        this.renderer.resize(window.innerWidth, window.innerHeight);
    }

    onMouseDown(event: MouseEvent)
    {
        event.preventDefault();

        if (!this.isGameOver)
        {
            if (!this.isRunning)
            {
                this.start();
            }
            this.velocityY = this.upVelocityY;
        }
        if (this.isLanded)
        {
            this.restart();
        }

    }

    onTouchStart(event: TouchEvent)
    {
        event.preventDefault();

        if (!this.isGameOver)
        {
            if (!this.isRunning)
            {
                this.start();
            }
            this.velocityY = this.upVelocityY;
        }
        if (this.isLanded)
        {
            this.restart();
        }
    }
    
}