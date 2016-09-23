class Game
{
    constructor() { }

    renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
    stage: PIXI.Container;
    bird: PIXI.Sprite;
    spineBoy: PIXI.spine.Spine;

    start()
    {
        this.renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, { backgroundColor: 0x1099bb });
        document.body.appendChild(this.renderer.view);

        this.stage = new PIXI.Container();

        var texture = PIXI.Texture.fromImage('image/bird0_0.png', false, PIXI.SCALE_MODES.NEAREST);
        this.bird = new PIXI.Sprite(texture);
        this.bird.anchor.set(0.5, 0.5);
        this.bird.position.set(window.innerWidth * 0.5, window.innerHeight * 0.2);
        this.bird.scale.set(4, 4);
        this.bird.interactive = true;
        this.bird.on('mousedown', this.onDown);
        this.bird.on('touchstart', this.onDown);
        this.stage.addChild(this.bird);

        var basicText = new PIXI.Text('Basic text in pixi');
        basicText.anchor.set(0.5, 0.5);
        basicText.position.set(window.innerWidth * 0.6, window.innerHeight * 0.5);
        this.stage.addChild(basicText);

        var richText = new PIXI.Text('Rich text with a lot of options and across multiple lines', {
            font: 'bold 36px Arial',
            fill: 0xf7edca,
            stroke: '#4a1850',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: 0x000000,
            dropShadowAngle: Math.PI * 0.2,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440
        });
        richText.anchor.set(0.5, 0);
        richText.position.set(window.innerWidth * 0.6, window.innerHeight * 0.6);
        this.stage.addChild(richText);

        var graphics = new PIXI.Graphics();

        graphics.lineStyle(4, 0xffd900, 1);
        graphics.beginFill(0xff3300);
        graphics.moveTo(50, 50);
        graphics.lineTo(250, 50);
        graphics.lineTo(100, 100);
        graphics.lineTo(50, 50);
        graphics.endFill();

        graphics.lineStyle(2, 0x0000ff, 1);
        graphics.beginFill(0xff700b, 1);
        graphics.drawRect(50, 250, 120, 120);
        graphics.endFill();

        graphics.lineStyle(2, 0xff00ff, 1);
        graphics.beginFill(0xff00bb, 0.25);
        graphics.drawRoundedRect(240, 200, 300, 100, 16);
        graphics.endFill();

        graphics.lineStyle(0);
        graphics.beginFill(0xffff0b, 0.5);
        graphics.drawCircle(470, 90, 60);
        graphics.endFill();

        graphics.lineStyle(0);
        graphics.beginFill(0xffffff);
        graphics.moveTo(50, 600);
        graphics.lineTo(150, 500);
        graphics.lineTo(200, 550);
        graphics.lineTo(150, 600);
        graphics.lineTo(200, 650);
        graphics.lineTo(100, 750);
        graphics.lineTo(50, 700);
        graphics.lineTo(100, 650);
        graphics.lineTo(50, 600);
        graphics.endFill();

        this.stage.addChild(graphics);

        //PIXI.loader.add('spineboy', 'http://pixijs.github.io/examples/required/assets/spine/spineboy.json').load(this.onAssetsLoaded);

        this.render();
    }

    render()
    {
        requestAnimationFrame(() => { this.render(); });

        this.renderer.render(this.stage);
    }

    onDown(event)
    {
        alert('clicked');
    }

    onAssetsLoaded(loader: PIXI.loaders.Loader, res: any)
    {
        alert('stop');
        this.spineBoy = new PIXI.spine.Spine(res.spineboy.spineData);

        this.spineBoy.position.set(window.innerWidth / 2, window.innerHeight);

        this.spineBoy.stateData.setMixByName('walk', 'jump', 0.2);
        this.spineBoy.stateData.setMixByName('jump', 'walk', 0.4);

        this.spineBoy.state.setAnimationByName(0, 'walk', true);

        this.stage.addChild(this.spineBoy);
    }
}

window.onload = () =>
{
    FlappyBird.Instance = new FlappyBird();
    FlappyBird.Instance.init();
};