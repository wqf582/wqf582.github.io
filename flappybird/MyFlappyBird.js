var MyFlappyBird = (function () {
    function MyFlappyBird() {
        this.bgMat = [];
        this.pipeDown = [];
        this.pipeUp = [];
        this.pipeMat = [];
        this.birdMat = [];
        this.buttons = [];
        this.numberMat = [];
        this.number = [];
    }
    MyFlappyBird.prototype.init = function () {
        var _this = this;
        this.initData();
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, -window.innerHeight / 2, 1, 1000);
        this.camera.position.z = 100;
        this.camera.lookAt(new THREE.Vector3());
        this.renderer = new THREE.WebGLRenderer({ antialias: false });
        this.renderer.setClearColor(0x000000);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        this.raycaster = new THREE.Raycaster();
        {
            var bgGeo = new THREE.PlaneGeometry(288 * this.localScale, 512 * this.localScale);
            var bgTex1 = THREE.ImageUtils.loadTexture('res/bg_day.png');
            bgTex1.magFilter = THREE.NearestFilter;
            bgTex1.minFilter = THREE.NearestFilter;
            var bgMat1 = new THREE.MeshBasicMaterial({ map: bgTex1, color: 0xffffff });
            this.bgMat.push(bgMat1);
            var bgTex2 = THREE.ImageUtils.loadTexture('res/bg_night.png');
            bgTex2.magFilter = THREE.NearestFilter;
            bgTex2.minFilter = THREE.NearestFilter;
            var bgMat2 = new THREE.MeshBasicMaterial({ map: bgTex2, color: 0xffffff });
            this.bgMat.push(bgMat2);
            this.bg = new THREE.Mesh(bgGeo, this.bgMat[Math.floor(Math.random() * 2)]);
            this.bg.name = "bg";
            this.scene.add(this.bg);
        }
        {
            var maskGeo = new THREE.PlaneGeometry(512 * this.localScale, 512 * this.localScale);
            var maskMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
            var mask1 = new THREE.Mesh(maskGeo, maskMat);
            mask1.position.x = -400 * this.localScale;
            mask1.position.z = 10;
            this.scene.add(mask1);
            var mask2 = new THREE.Mesh(maskGeo, maskMat);
            mask2.position.x = 400 * this.localScale;
            mask2.position.z = 10;
            this.scene.add(mask2);
        }
        {
            var landGeo = new THREE.PlaneGeometry(336 * this.localScale, 112 * this.localScale);
            var landTex = THREE.ImageUtils.loadTexture('res/land.png');
            landTex.magFilter = THREE.NearestFilter;
            landTex.minFilter = THREE.NearestFilter;
            var landMat = new THREE.MeshBasicMaterial({ map: landTex, color: 0xffffff, transparent: true });
            this.land = new THREE.Mesh(landGeo, landMat);
            this.land.position.y = -200 * this.localScale;
            this.land.position.z = 5;
            this.scene.add(this.land);
        }
        {
            this.pipeGeo = new THREE.PlaneGeometry(52 * this.localScale, 320 * this.localScale);
            var pipeTex1 = THREE.ImageUtils.loadTexture('res/pipe_down.png');
            pipeTex1.magFilter = THREE.NearestFilter;
            pipeTex1.minFilter = THREE.NearestFilter;
            var pipeMat1 = new THREE.MeshBasicMaterial({ map: pipeTex1, color: 0xffffff, transparent: true });
            this.pipeMat.push(pipeMat1);
            var pipeTex2 = THREE.ImageUtils.loadTexture('res/pipe_up.png');
            pipeTex2.magFilter = THREE.NearestFilter;
            pipeTex2.minFilter = THREE.NearestFilter;
            var pipeMat2 = new THREE.MeshBasicMaterial({ map: pipeTex2, color: 0xffffff, transparent: true });
            this.pipeMat.push(pipeMat2);
        }
        {
            var readyGeo = new THREE.PlaneGeometry(192 * this.localScale, 62 * this.localScale);
            var readyTex = THREE.ImageUtils.loadTexture('res/text_ready.png');
            readyTex.magFilter = THREE.NearestFilter;
            readyTex.minFilter = THREE.NearestFilter;
            var readyMat = new THREE.MeshBasicMaterial({ map: readyTex, color: 0xffffff, transparent: true });
            this.ready = new THREE.Mesh(readyGeo, readyMat);
            this.ready.position.y = 50 * this.localScale;
            this.scene.add(this.ready);
        }
        {
            var gameOverGeo = new THREE.PlaneGeometry(204 * this.localScale, 54 * this.localScale);
            var gameOverTex = THREE.ImageUtils.loadTexture('res/text_game_over.png');
            gameOverTex.magFilter = THREE.NearestFilter;
            gameOverTex.minFilter = THREE.NearestFilter;
            var gameOverMat = new THREE.MeshBasicMaterial({ map: gameOverTex, color: 0xffffff, transparent: true });
            this.gameOver = new THREE.Mesh(gameOverGeo, gameOverMat);
            this.gameOver.position.y = 50 * this.localScale;
            this.gameOver.position.z = 5;
            this.gameOver.visible = false;
            this.scene.add(this.gameOver);
        }
        {
            var tutorialGeo = new THREE.PlaneGeometry(114 * this.localScale, 98 * this.localScale);
            var tutorialTex = THREE.ImageUtils.loadTexture('res/tutorial.png');
            tutorialTex.magFilter = THREE.NearestFilter;
            tutorialTex.minFilter = THREE.NearestFilter;
            var tutorialMat = new THREE.MeshBasicMaterial({ map: tutorialTex, color: 0xffffff, transparent: true });
            this.tutorial = new THREE.Mesh(tutorialGeo, tutorialMat);
            this.tutorial.position.y = -38 * this.localScale;
            this.scene.add(this.tutorial);
        }
        {
            this.numberGeo = new THREE.PlaneGeometry(24 * this.localScale, 44 * this.localScale);
            for (var i = 0; i < 10; i++) {
                var numTex = THREE.ImageUtils.loadTexture('res/font_0' + (48 + i) + '.png');
                numTex.magFilter = THREE.NearestFilter;
                numTex.minFilter = THREE.NearestFilter;
                var numMat = new THREE.MeshBasicMaterial({ map: numTex, color: 0xffffff, transparent: true });
                this.numberMat.push(numMat);
            }
        }
        {
            var birdGeometry = new THREE.PlaneGeometry(48 * this.localScale, 48 * this.localScale);
            this.birdMatIndex = 1;
            var rand = Math.floor(Math.random() * 3);
            for (var i = 0; i < 3; i++) {
                var tex = THREE.ImageUtils.loadTexture('res/bird' + rand + '_' + i + '.png');
                tex.magFilter = THREE.NearestFilter;
                tex.minFilter = THREE.NearestFilter;
                var mat = new THREE.MeshBasicMaterial({ map: tex, color: 0xffffff, transparent: true });
                this.birdMat.push(mat);
            }
            this.bird = new THREE.Mesh(birdGeometry, this.birdMat[this.birdMatIndex]);
            this.bird.position.x = -50 * this.localScale;
            this.bird.position.z = 2;
            this.scene.add(this.bird);
        }
        document.addEventListener('mousedown', function (event) { _this.onMouseDown(event); }, false);
        document.addEventListener('touchstart', function (event) { _this.onTouchStart(event); }, false);
        window.addEventListener('resize', function (event) { _this.onWindowResized(event); }, false);
        this.onWindowResized(null);
        this.render();
    };
    MyFlappyBird.prototype.initData = function () {
        this.localScale = Math.min(window.innerHeight / 512, window.innerWidth / 288);
        this.isRunning = false;
        this.isGameOver = false;
        this.isLanded = false;
        this.range = 205;
        this.score = 0;
        this.checkPipePos = 1000;
        this.speed = -2 * this.localScale;
        this.upVelocityY = 5.4 * this.localScale;
        this.maxVelocityY = -15 * this.localScale;
        this.accelerationY = -0.32 * this.localScale;
        this.minAngularZ = -0.5 * Math.PI;
        this.maxAngularZ = 0.18 * Math.PI;
        this.upAngularZ = 0.05 * Math.PI;
        this.downAngularZ = -0.03 * Math.PI;
    };
    MyFlappyBird.prototype.genPipe = function (x) {
        var pos = -44 + 25 * Math.floor(Math.random() * 9);
        var down = new THREE.Mesh(this.pipeGeo, this.pipeMat[0]);
        down.position.x = x * this.localScale;
        down.position.y = (pos + this.range) * this.localScale;
        down.position.z = 1;
        this.scene.add(down);
        this.pipeDown.push(down);
        var up = new THREE.Mesh(this.pipeGeo, this.pipeMat[1]);
        up.position.x = x * this.localScale;
        up.position.y = (pos - this.range) * this.localScale;
        up.position.z = 1;
        this.scene.add(up);
        this.pipeUp.push(up);
    };
    MyFlappyBird.prototype.start = function () {
        if (!this.isRunning) {
            this.ready.visible = false;
            this.tutorial.visible = false;
            this.printScore();
            for (var i = 0; i < 4; i++) {
                this.genPipe(200 + i * 180);
            }
            this.timer = 0;
            this.lastTime = Date.now();
            this.isRunning = true;
        }
    };
    MyFlappyBird.prototype.restart = function () {
        this.initData();
        this.gameOver.visible = false;
        this.ready.visible = true;
        this.tutorial.visible = true;
        this.bird.position.y = 0;
        this.bird.rotation.z = 0;
        while (this.pipeDown.length > 0) {
            this.scene.remove(this.pipeDown.pop());
        }
        while (this.pipeUp.length > 0) {
            this.scene.remove(this.pipeUp.pop());
        }
        while (this.number.length > 0) {
            this.scene.remove(this.number.pop());
        }
    };
    MyFlappyBird.prototype.render = function () {
        var _this = this;
        if (this.isRunning) {
            var deltaTime = Date.now() - this.lastTime;
            this.lastTime = Date.now();
            this.timer += deltaTime;
            if (!this.isGameOver) {
                this.landMove();
                this.checkAddScore();
                this.isGameOver = this.collisionDetection();
                if (this.isGameOver) {
                    this.gameOver.visible = true;
                }
            }
            this.birdControl();
            this.birdLanded();
        }
        requestAnimationFrame(function () { _this.render(); });
        this.renderer.render(this.scene, this.camera);
    };
    MyFlappyBird.prototype.birdControl = function () {
        if (this.velocityY > this.maxVelocityY) {
            this.velocityY += this.accelerationY;
        }
        this.bird.position.y += this.velocityY;
        if (this.timer >= 100) {
            this.birdMatIndex = (this.birdMatIndex + 1) % 3;
            this.bird.material = this.birdMat[this.birdMatIndex];
            this.timer = 0;
        }
        if (this.velocityY > 0) {
            this.angularZ = this.upAngularZ;
            if (this.bird.rotation.z < this.maxAngularZ) {
                this.bird.rotateZ(this.angularZ);
            }
        }
        else {
            this.angularZ = this.downAngularZ;
            if (this.bird.rotation.z > this.minAngularZ) {
                this.bird.rotateZ(this.angularZ);
            }
            else {
                this.bird.rotation.z = this.minAngularZ;
            }
        }
    };
    MyFlappyBird.prototype.landMove = function () {
        this.land.translateX(this.speed);
        if (this.land.position.x <= -24 * this.localScale) {
            this.land.position.x = 24 * this.localScale;
        }
        for (var i = 0; i < 4; i++) {
            this.pipeDown[i].translateX(this.speed);
            this.pipeUp[i].translateX(this.speed);
        }
        if (this.pipeDown[0].position.x <= -200 * this.localScale) {
            this.scene.remove(this.pipeDown.shift());
            this.scene.remove(this.pipeUp.shift());
            this.genPipe(520);
        }
    };
    MyFlappyBird.prototype.collisionDetection = function () {
        for (var i = 0; i < 4; i++) {
            if (this.bird.position.y > this.pipeDown[i].position.y - 172 * this.localScale &&
                this.bird.position.x > this.pipeDown[i].position.x - 36 * this.localScale &&
                this.bird.position.x < this.pipeDown[i].position.x + 33 * this.localScale) {
                return true;
            }
            if (this.bird.position.y < this.pipeUp[i].position.y + 174 * this.localScale &&
                this.bird.position.x > this.pipeUp[i].position.x - 36 * this.localScale &&
                this.bird.position.x < this.pipeUp[i].position.x + 33 * this.localScale) {
                return true;
            }
        }
        return false;
    };
    MyFlappyBird.prototype.birdLanded = function () {
        if (this.bird.position.y < -130 * this.localScale) {
            this.bird.position.y = -130 * this.localScale;
            this.bird.rotation.z = this.minAngularZ;
            this.isRunning = false;
            this.isLanded = true;
            if (!this.isGameOver) {
                this.isGameOver = true;
                this.gameOver.visible = true;
            }
        }
    };
    MyFlappyBird.prototype.checkAddScore = function () {
        var dis = 1000;
        var pos;
        for (var i = 0; i < 4; i++) {
            if (Math.abs(this.bird.position.x - this.pipeDown[i].position.x) < dis) {
                dis = Math.abs(this.bird.position.x - this.pipeDown[i].position.x);
                pos = this.pipeDown[i].position.x;
            }
        }
        if (this.checkPipePos >= this.bird.position.x && pos < this.bird.position.x) {
            this.score++;
            this.printScore();
        }
        this.checkPipePos = pos;
    };
    MyFlappyBird.prototype.printScore = function () {
        while (this.number.length > 0) {
            this.scene.remove(this.number.pop());
        }
        var s = this.score;
        var len = s.toString().length;
        var pos;
        if (len % 2 == 0) {
            pos = (len / 2) * 24 - 12;
        }
        else {
            pos = ((len - 1) / 2) * 24;
        }
        for (var i = 0; i < len; i++) {
            var tex = new THREE.Mesh(this.numberGeo, this.numberMat[s % 10]);
            tex.position.x = (pos - i * 26) * this.localScale;
            tex.position.y = 180 * this.localScale;
            tex.position.z = 5;
            this.scene.add(tex);
            this.number.push(tex);
            s = Math.round(s / 10);
        }
    };
    MyFlappyBird.prototype.onWindowResized = function (event) {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.updateProjectionMatrix();
    };
    MyFlappyBird.prototype.onMouseDown = function (event) {
        event.preventDefault();
        if (!this.isGameOver) {
            if (!this.isRunning) {
                this.start();
            }
            this.velocityY = this.upVelocityY;
        }
        if (this.isLanded) {
            this.restart();
        }
        var mouse = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
        this.raycaster.setFromCamera(mouse, this.camera);
        var intersects = this.raycaster.intersectObjects(this.scene.children);
        if (intersects.length > 0) {
        }
    };
    MyFlappyBird.prototype.onTouchStart = function (event) {
        event.preventDefault();
        if (!this.isGameOver) {
            if (!this.isRunning) {
                this.start();
            }
            this.velocityY = this.upVelocityY;
        }
        if (this.isLanded) {
            this.restart();
        }
    };
    return MyFlappyBird;
}());
//# sourceMappingURL=MyFlappyBird.js.map