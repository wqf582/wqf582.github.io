var RapidMath = (function () {
    function RapidMath() {
        this.buttons = [];
        this.mapMat = {};
        this.problemCount = 40;
        this.limit = 5000;
        this.running = false;
        this.listTemp = [];
    }
    RapidMath.prototype.init = function () {
        var _this = this;
        this.localScale = Math.min(window.innerHeight / 104, window.innerWidth / 67);
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-window.innerWidth / 2, window.innerWidth / 2, -window.innerHeight / 2, window.innerHeight / 2);
        this.camera.position.z = 100;
        this.camera.lookAt(new THREE.Vector3());
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setClearColor(0x333333);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        var sliderGeometry = new THREE.PlaneGeometry(65 * this.localScale, 1 * this.localScale);
        var sliderMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.slider = new THREE.Mesh(sliderGeometry, sliderMat);
        this.slider.rotation.x = Math.PI;
        this.slider.position.y = -50 * this.localScale;
        this.scene.add(this.slider);
        var displayTex = THREE.ImageUtils.loadTexture('res/display.png');
        displayTex.magFilter = THREE.NearestFilter;
        displayTex.minFilter = THREE.NearestFilter;
        var displayGeometry = new THREE.PlaneGeometry(65 * this.localScale, 27 * this.localScale);
        var displayMat = new THREE.MeshBasicMaterial({ map: displayTex, color: 0xffffff, transparent: true });
        this.display = new THREE.Mesh(displayGeometry, displayMat);
        this.display.rotation.x = Math.PI;
        this.display.position.y = -35 * this.localScale;
        this.scene.add(this.display);
        var buttonTex = THREE.ImageUtils.loadTexture('res/button.png');
        buttonTex.magFilter = THREE.NearestFilter;
        buttonTex.minFilter = THREE.NearestFilter;
        var buttonGeometry = new THREE.PlaneGeometry(21 * this.localScale, 17 * this.localScale);
        var buttonMat = new THREE.MeshBasicMaterial({ map: buttonTex, color: 0xffffff, transparent: true });
        this.numGeo = new THREE.PlaneGeometry(7 * this.localScale, 7 * this.localScale);
        for (var i = 0; i < 10; i++) {
            var num = (i + 1) % 10;
            var x = i % 3;
            var y = Math.floor(i / 3);
            var button = new THREE.Mesh(buttonGeometry, buttonMat);
            button.name = 'button' + num.toString();
            button.rotation.x = Math.PI;
            button.position.x = (-22 + x * 22) * this.localScale;
            button.position.y = (-12 + y * 18) * this.localScale;
            this.buttons.push(button);
            this.scene.add(button);
            var numTex = THREE.ImageUtils.loadTexture('res/' + num + '.png');
            numTex.magFilter = THREE.NearestFilter;
            numTex.minFilter = THREE.NearestFilter;
            var numMat = new THREE.MeshBasicMaterial({ map: numTex, color: 0xffffff, transparent: true });
            this.mapMat[num.toString()] = numMat;
            var number = new THREE.Mesh(this.numGeo, numMat);
            number.name = 'number' + num.toString();
            number.rotation.x = Math.PI;
            number.position.x = (-22 + x * 22) * this.localScale;
            number.position.y = (-12 + y * 18) * this.localScale;
            this.scene.add(number);
        }
        var op = ['a', 's', 'm', 'd', 'e', 'true', 'false'];
        for (var i = 0; i < op.length; i++) {
            var tex = THREE.ImageUtils.loadTexture('res/' + op[i] + '.png');
            tex.magFilter = THREE.NearestFilter;
            tex.minFilter = THREE.NearestFilter;
            var mat = new THREE.MeshBasicMaterial({ map: tex, color: 0xffffff, transparent: true });
            this.mapMat[op[i]] = mat;
        }
        var startTex = THREE.ImageUtils.loadTexture('res/start.png');
        startTex.magFilter = THREE.NearestFilter;
        startTex.minFilter = THREE.NearestFilter;
        var startGeometry = new THREE.PlaneGeometry(43 * this.localScale, 17 * this.localScale);
        var startMat = new THREE.MeshBasicMaterial({ map: startTex, color: 0xffffff, transparent: true });
        var start = new THREE.Mesh(startGeometry, startMat);
        start.name = 'start';
        start.rotation.x = Math.PI;
        start.position.x = 11 * this.localScale;
        start.position.y = 42 * this.localScale;
        this.buttons.push(start);
        this.scene.add(start);
        document.addEventListener('mousedown', function (event) { _this.onMouseDown(event); }, false);
        document.addEventListener('touchstart', function (event) { _this.onTouchStart(event); }, false);
        window.addEventListener('resize', function (event) { _this.onWindowResized(event); }, false);
        this.onWindowResized(null);
        this.render();
    };
    RapidMath.prototype.start = function () {
        this.lastTime = Date.now();
        this.timer = 0;
        this.rightCount = 0;
        this.score = 0;
        this.problemIndex = 0;
        this.problem = [];
        this.answer = [];
        this.part0 = [];
        this.part1 = [];
        this.part2 = [];
        this.genProblem(this.problemCount);
        this.pro0 = '';
        this.pro1 = this.problem[this.problemIndex];
        this.pro2 = this.problem[this.problemIndex + 1];
        this.ans0 = '';
        this.ans1 = '';
        this.judge = '';
        this.running = true;
    };
    RapidMath.prototype.render = function () {
        var _this = this;
        if (this.running) {
            var deltaTime = Date.now() - this.lastTime;
            this.lastTime = Date.now();
            this.timer += deltaTime;
            this.slider.geometry = new THREE.PlaneGeometry((this.limit - this.timer) / this.limit * 65 * this.localScale, 1 * this.localScale);
            this.slider.position.x = (-32.5 + (this.limit - this.timer) / this.limit * 32.5) * this.localScale;
            if (this.timer >= this.limit) {
                this.solve(false);
                this.printProblem();
            }
        }
        requestAnimationFrame(function () { _this.render(); });
        this.renderer.render(this.scene, this.camera);
    };
    RapidMath.prototype.onWindowResized = function (event) {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.updateProjectionMatrix();
    };
    RapidMath.prototype.onMouseDown = function (event) {
        event.preventDefault();
        var mouse = new THREE.Vector2(event.clientX, event.clientY);
        var tag = this.getButton(mouse);
        if (tag == 'start') {
            this.start();
            this.printProblem();
        }
        else if (tag == '') {
        }
        else {
            if (this.running) {
                this.ans1 += tag;
                this.check();
                this.printProblem();
            }
        }
    };
    RapidMath.prototype.onTouchStart = function (event) {
        event.preventDefault();
        var x = event.touches[event.touches.length - 1].clientX;
        var y = event.touches[event.touches.length - 1].clientY;
        var touch = new THREE.Vector2(x, y);
        var tag = this.getButton(touch);
        if (tag == 'start') {
            this.start();
            this.printProblem();
        }
        else if (tag == '') {
        }
        else {
            if (this.running) {
                this.ans1 += tag;
                this.check();
                this.printProblem();
            }
        }
    };
    RapidMath.prototype.getButton = function (mouse) {
        mouse = new THREE.Vector2(mouse.x - window.innerWidth / 2, mouse.y - window.innerHeight / 2);
        for (var i = 0; i < 10; i++) {
            if (mouse.x > this.buttons[i].position.x - 10.5 * this.localScale &&
                mouse.x < this.buttons[i].position.x + 10.5 * this.localScale &&
                mouse.y > this.buttons[i].position.y - 8.5 * this.localScale &&
                mouse.y < this.buttons[i].position.y + 8.5 * this.localScale) {
                return ((i + 1) % 10).toString();
            }
        }
        if (mouse.x > this.buttons[10].position.x - 21.5 * this.localScale &&
            mouse.x < this.buttons[10].position.x + 21.5 * this.localScale &&
            mouse.y > this.buttons[10].position.y - 8.5 * this.localScale &&
            mouse.y < this.buttons[10].position.y + 8.5 * this.localScale) {
            return 'start';
        }
        return '';
    };
    RapidMath.prototype.printProblem = function () {
        this.clearProblem();
        {
            for (var i = 0; i < this.pro0.length; i++) {
                var pro = new THREE.Mesh(this.numGeo, this.mapMat[this.pro0[i]]);
                pro.rotation.x = Math.PI;
                pro.position.x = (1 - this.pro0.length + i) * 6 * this.localScale;
                pro.position.y = -43 * this.localScale;
                this.listTemp.push(pro);
                this.scene.add(pro);
            }
            if (this.pro0 != '') {
                var e = new THREE.Mesh(this.numGeo, this.mapMat['e']);
                e.rotation.x = Math.PI;
                e.position.x = 6 * this.localScale;
                e.position.y = -43 * this.localScale;
                this.listTemp.push(e);
                this.scene.add(e);
            }
            for (var i = 0; i < this.ans0.length; i++) {
                var ans = new THREE.Mesh(this.numGeo, this.mapMat[this.ans0[i]]);
                ans.rotation.x = Math.PI;
                ans.position.x = (2 + i) * 6 * this.localScale;
                ans.position.y = -43 * this.localScale;
                this.listTemp.push(ans);
                this.scene.add(ans);
            }
            if (this.judge != '') {
                var j = new THREE.Mesh(this.numGeo, this.mapMat[this.judge]);
                j.rotation.x = Math.PI;
                j.position.x = 25 * this.localScale;
                j.position.y = -43 * this.localScale;
                this.listTemp.push(j);
                this.scene.add(j);
            }
        }
        {
            for (var i = 0; i < this.pro1.length; i++) {
                var pro = new THREE.Mesh(this.numGeo, this.mapMat[this.pro1[i]]);
                pro.rotation.x = Math.PI;
                pro.position.x = (1 - this.pro1.length + i) * 6 * this.localScale;
                pro.position.y = -35 * this.localScale;
                this.listTemp.push(pro);
                this.scene.add(pro);
            }
            if (this.pro1 != '') {
                var e = new THREE.Mesh(this.numGeo, this.mapMat['e']);
                e.rotation.x = Math.PI;
                e.position.x = 6 * this.localScale;
                e.position.y = -35 * this.localScale;
                this.listTemp.push(e);
                this.scene.add(e);
            }
            for (var i = 0; i < this.ans1.length; i++) {
                var ans = new THREE.Mesh(this.numGeo, this.mapMat[this.ans1[i]]);
                ans.rotation.x = Math.PI;
                ans.position.x = (2 + i) * 6 * this.localScale;
                ans.position.y = -35 * this.localScale;
                this.listTemp.push(ans);
                this.scene.add(ans);
            }
        }
        {
            for (var i = 0; i < this.pro2.length; i++) {
                var pro = new THREE.Mesh(this.numGeo, this.mapMat[this.pro2[i]]);
                pro.rotation.x = Math.PI;
                pro.position.x = (1 - this.pro2.length + i) * 6 * this.localScale;
                pro.position.y = -27 * this.localScale;
                this.listTemp.push(pro);
                this.scene.add(pro);
            }
            if (this.pro2 != '') {
                var e = new THREE.Mesh(this.numGeo, this.mapMat['e']);
                e.rotation.x = Math.PI;
                e.position.x = 6 * this.localScale;
                e.position.y = -27 * this.localScale;
                this.listTemp.push(e);
                this.scene.add(e);
            }
        }
    };
    RapidMath.prototype.clearProblem = function () {
        for (var i = 0; i < this.listTemp.length; i++) {
            this.scene.remove(this.listTemp[i]);
        }
        this.listTemp = [];
    };
    RapidMath.prototype.genProblem = function (count) {
        while (count > 0) {
            var op = Math.floor(Math.random() * 4);
            var pro = '';
            var ans = '';
            if (0 == op) {
                var num1 = Math.floor(Math.random() * 50);
                var num2 = Math.floor(Math.random() * 50);
                pro = num1.toString() + 'a' + num2.toString();
                ans = (num1 + num2).toString();
            }
            else if (1 == op) {
                var num1 = Math.floor(Math.random() * 100);
                var num2 = Math.floor(Math.random() * 100);
                if (num1 < num2) {
                    var temp = num1;
                    num1 = num2;
                    num2 = temp;
                }
                pro = num1.toString() + 's' + num2.toString();
                ans = (num1 - num2).toString();
            }
            else if (2 == op) {
                var num1 = Math.floor(Math.random() * 10);
                var num2 = Math.floor(Math.random() * 10);
                pro = num1.toString() + 'm' + num2.toString();
                ans = (num1 * num2).toString();
            }
            else {
                var num1 = Math.floor(Math.random() * 10) + 1;
                var num2 = Math.floor(Math.random() * 10);
                var num3 = num1 * num2;
                pro = num3.toString() + 'd' + num1.toString();
                ans = num2.toString();
            }
            this.problem.push(pro);
            this.answer.push(ans);
            count--;
        }
    };
    RapidMath.prototype.check = function () {
        if (this.answer[this.problemIndex] == this.ans1) {
            this.solve(true);
        }
        else if (this.answer[this.problemIndex].substr(0, this.ans1.length) != this.ans1) {
            this.solve(false);
        }
    };
    RapidMath.prototype.solve = function (flag) {
        if (flag) {
            this.judge = 'true';
            this.score += this.limit - this.timer;
            this.rightCount++;
        }
        else {
            this.judge = 'false';
        }
        this.timer = 0;
        this.problemIndex++;
        this.ans0 = this.ans1;
        this.ans1 = '';
        this.pro0 = this.pro1;
        this.pro1 = this.pro2;
        if (this.problemIndex + 1 < this.problemCount) {
            this.pro2 = this.problem[this.problemIndex + 1];
        }
        else {
            this.pro2 = '';
        }
        this.printProblem();
        if (this.problemIndex >= this.problemCount) {
            this.stop();
            alert('Accuracy: ' + Math.floor(100 * this.rightCount / this.problemCount) + '%\nScore: ' + Math.floor(this.score));
        }
    };
    RapidMath.prototype.stop = function () {
        this.running = false;
        this.timer = 0;
        this.clearProblem();
        this.slider.geometry = new THREE.PlaneGeometry(65 * this.localScale, 1 * this.localScale);
    };
    return RapidMath;
}());
window.onload = function () {
    RapidMath.Instance = new RapidMath();
    RapidMath.Instance.init();
};
//# sourceMappingURL=app.js.map