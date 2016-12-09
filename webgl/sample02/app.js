var glRenderer = (function () {
    function glRenderer() {
        this.vertices = [];
        this.colors = [];
        this.indices = [];
        this.textureCoords = [];
        this.normals = [];
        this.imgSource = [];
        this.imgIndex = 0;
        this.lastTime = 0;
    }
    glRenderer.prototype.start = function () {
        var _this = this;
        //获取WebGL对象
        this.canvas = document.getElementById("glcanvas");
        this.canvas.width = 1024;
        this.canvas.height = 1024;
        this.gl = this.canvas.getContext("webgl", { antialias: true }) || this.canvas.getContext("experimental-webgl", { antialias: true });
        if (!this.gl) {
            alert("Unable to initialize WebGL. Your browser may not support it.");
            return;
        }
        this.imgSource.push("uv_grid_512.jpg");
        this.imgSource.push("grid.jpg");
        document.getElementById("changeTexture").onclick = function (event) { return _this.onClick(event); };
        document.getElementById("download").onclick = function (event) { return _this.download(event); };
        //this.createSquare();
        this.createCylinder();
        this.render();
    };
    glRenderer.prototype.render = function () {
        var _this = this;
        var deltaTime = Date.now() - this.lastTime;
        this.lastTime = Date.now();
        //this.drawSquare(deltaTime);
        this.drawCylinder(deltaTime);
        requestAnimationFrame(function () { _this.render(); });
    };
    glRenderer.prototype.onClick = function (event) {
        this.imgIndex = (this.imgIndex + 1) % this.imgSource.length;
        this.initTexture(this.imgSource[this.imgIndex]);
    };
    glRenderer.prototype.download = function (event) {
        this.objData = "mtllib cylinder.mtl\n";
        for (var i = 0; i < this.vertices.length; i += 3) {
            this.objData += "v " + this.vertices[i].toFixed(6) + " " + this.vertices[i + 1].toFixed(6) + " " + this.vertices[i + 2].toFixed(6) + "\n";
        }
        for (var i = 0; i < this.textureCoords.length; i += 2) {
            this.objData += "vt " + this.textureCoords[i].toFixed(6) + " " + this.textureCoords[i + 1].toFixed(6) + "\n";
        }
        for (var i = 0; i < this.normals.length; i += 3) {
            this.objData += "vn " + this.normals[i].toFixed(6) + " " + this.normals[i + 1].toFixed(6) + " " + this.normals[i + 2].toFixed(6) + "\n";
        }
        this.objData += "usemtl mat1SG\n";
        for (var i = 0; i < this.indices.length; i += 3) {
            this.objData += "f " + (this.indices[i] + 1) + "/" + (this.indices[i] + 1) + "/" + (this.indices[i] + 1) +
                " " + (this.indices[i + 1] + 1) + "/" + (this.indices[i + 1] + 1) + "/" + (this.indices[i + 1] + 1) +
                " " + (this.indices[i + 2] + 1) + "/" + (this.indices[i + 2] + 1) + "/" + (this.indices[i + 2] + 1) + "\n";
        }
        this.mtlData = "newmtl mat1SG\n" +
            "illum 4\n" +
            "Kd 0.00 0.00 0.00\n" +
            "Ka 0.00 0.00 0.00\n" +
            "Tf 1.00 1.00 1.00\n" +
            "map_Kd " + this.imgSource[this.imgIndex] + "\n" +
            "Ni 1.00\n";
        FileHelper.SaveStringFile("cylinder.obj", this.objData);
        FileHelper.SaveStringFile("cylinder.mtl", this.mtlData);
        FileHelper.SaveFile(this.imgSource[this.imgIndex], "res/" + this.imgSource[this.imgIndex]);
    };
    glRenderer.prototype.initTexture = function (source) {
        var _this = this;
        var img = new Image();
        img.src = "res/" + source;
        img.onload = function () {
            var texture = _this.gl.createTexture();
            _this.gl.activeTexture(_this.gl.TEXTURE0);
            _this.gl.bindTexture(_this.gl.TEXTURE_2D, texture);
            _this.gl.texImage2D(_this.gl.TEXTURE_2D, 0, _this.gl.RGBA, _this.gl.RGBA, _this.gl.UNSIGNED_BYTE, img);
            _this.gl.texParameteri(_this.gl.TEXTURE_2D, _this.gl.TEXTURE_MIN_FILTER, _this.gl.LINEAR);
            _this.gl.generateMipmap(_this.gl.TEXTURE_2D);
            _this.gl.pixelStorei(_this.gl.UNPACK_FLIP_Y_WEBGL, 1);
            _this.gl.uniform1i(_this.uniTexture, 0);
        };
    };
    glRenderer.prototype.createSquare = function () {
        //制作着色器程序
        var vertShader = this.getShader("shader-vs");
        var fragShader = this.getShader("shader-fs");
        var shaderProgram = this.gl.createProgram();
        this.gl.attachShader(shaderProgram, vertShader);
        this.gl.attachShader(shaderProgram, fragShader);
        this.gl.linkProgram(shaderProgram);
        this.gl.useProgram(shaderProgram);
        //获取接口位置，并开启数组模式
        this.attPosition = this.gl.getAttribLocation(shaderProgram, "position");
        this.attTexture = this.gl.getAttribLocation(shaderProgram, "textureCoord");
        this.attColor = this.gl.getAttribLocation(shaderProgram, "color");
        this.attNormal = this.gl.getAttribLocation(shaderProgram, "normal");
        this.gl.enableVertexAttribArray(this.attPosition);
        this.gl.enableVertexAttribArray(this.attTexture);
        this.gl.enableVertexAttribArray(this.attColor);
        this.gl.enableVertexAttribArray(this.attNormal);
        //指定顶点坐标的数据源
        this.vertices = [
            -1, -1, -1, 1, -1, -1, -1, 1, -1, 1, 1, -1,
            -1, -1, 1, 1, -1, 1, -1, 1, 1, 1, 1, 1,
            -1, -1, -1, -1, 1, -1, -1, -1, 1, -1, 1, 1,
            1, -1, -1, 1, 1, -1, 1, -1, 1, 1, 1, 1,
            -1, -1, -1, 1, -1, -1, -1, -1, 1, 1, -1, 1,
            -1, 1, -1, 1, 1, -1, -1, 1, 1, 1, 1, 1
        ];
        this.vertex_buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertex_buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.attPosition, 3, this.gl.FLOAT, false, 0, 0);
        //指定顶点颜色数据源
        this.colors = [];
        for (var i = 0; i < this.vertices.length / 3; i++) {
            this.colors.push(1, 1, 1);
        }
        this.color_buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.color_buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.attColor, 3, this.gl.FLOAT, false, 0, 0);
        //指定顶点法线数据源
        this.normals = [];
        var tmp = [[0, 0, -1], [0, 0, 1], [-1, 0, 0], [1, 0, 0], [0, -1, 0], [0, 1, 0]];
        for (var i = 0; i < tmp.length; i++) {
            for (var j = 0; j < 4; j++) {
                this.normals.push.apply(this.normals, tmp[i]);
            }
        }
        this.normal_buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normal_buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.normals), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.attNormal, 3, this.gl.FLOAT, false, 0, 0);
        //指定贴图位置数据源
        this.textureCoords = [
            0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0,
            0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0,
            0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0,
            0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0,
            0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0,
            0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0
        ];
        this.texture_buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texture_buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.textureCoords), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.attTexture, 2, this.gl.FLOAT, false, 0, 0);
        //构造索引
        this.indices = [];
        for (var i = 0; i < 24; i += 4) {
            this.indices.push(i + 0, i + 1, i + 2, i + 3, i + 2, i + 1);
        }
        this.index_buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.STATIC_DRAW);
        //设置投射矩阵
        this.proj_matrix = this.getProjection(40, this.canvas.width / this.canvas.height, 1, 100);
        this.mov_matrix = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
        this.view_matrix = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
        this.view_matrix[14] = this.view_matrix[14] - 6;
        //获取uniform们的句柄
        this.Pmatrix = this.gl.getUniformLocation(shaderProgram, "Pmatrix");
        this.Vmatrix = this.gl.getUniformLocation(shaderProgram, "Vmatrix");
        this.Mmatrix = this.gl.getUniformLocation(shaderProgram, "Mmatrix");
        this.uniTexture = this.gl.getUniformLocation(shaderProgram, "texture");
        this.lightColor = this.gl.getUniformLocation(shaderProgram, "lightColor");
        this.lightDirection = this.gl.getUniformLocation(shaderProgram, "lightDirection");
        this.lightEnvironment = this.gl.getUniformLocation(shaderProgram, "lightEnvironment");
        this.gl.uniformMatrix4fv(this.Pmatrix, false, this.proj_matrix);
        this.gl.uniformMatrix4fv(this.Vmatrix, false, this.view_matrix);
        this.gl.uniformMatrix4fv(this.Mmatrix, false, this.mov_matrix);
        this.gl.uniform3fv(this.lightColor, new Float32Array([0.9, 0.9, 0.9]));
        this.gl.uniform3fv(this.lightDirection, new Float32Array([0, 0, -1]));
        this.gl.uniform3fv(this.lightEnvironment, new Float32Array([0.1, 0.1, 0.1]));
        //深度测试
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        //设置图片数据
        this.initTexture(this.imgSource[this.imgIndex]);
    };
    glRenderer.prototype.drawSquare = function (deltaTime) {
        this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
        this.gl.clearDepth(1.0);
        this.gl.viewport(0.0, 0.0, this.canvas.width, this.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.rotateX(this.mov_matrix, deltaTime * 0.001);
        this.rotateY(this.mov_matrix, deltaTime * 0.001);
        this.gl.uniformMatrix4fv(this.Mmatrix, false, this.mov_matrix);
        this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT, 0);
    };
    glRenderer.prototype.getCylinderData = function (radius, height, n) {
        this.vertices = [];
        this.textureCoords = [];
        this.normals = [];
        this.indices = [];
        //上底面
        this.vertices.push(0, height, 0);
        this.textureCoords.push(0.5, 0.5);
        this.normals.push(0, 1, 0);
        for (var i = 0; i < n; i++) {
            var r = Math.PI * 2 * i / n;
            var x = Math.sin(r) * radius;
            var y = height;
            var z = Math.cos(r) * radius;
            this.vertices.push(x, y, z);
            this.textureCoords.push(0.5 + x / 2 / radius, 0.5 - z / 2 / radius);
            this.normals.push(0, 1, 0);
        }
        for (var i = 0; i < n; i++) {
            this.indices.push(0, 1 + i, 1 + (i + 1) % n);
        }
        //下底面
        this.vertices.push(0, 0, 0);
        this.textureCoords.push(0.5, 0.5);
        this.normals.push(0, -1, 0);
        for (var i = 0; i < n; i++) {
            var r = Math.PI * 2 * i / n;
            var x = Math.sin(r) * radius;
            var y = 0;
            var z = Math.cos(r) * radius;
            this.vertices.push(x, y, z);
            this.textureCoords.push(0.5 + x / 2 / radius, 0.5 + z / 2 / radius);
            this.normals.push(0, -1, 0);
        }
        for (var i = 0; i < n; i++) {
            this.indices.push(n + 1, n + 2 + i, n + 2 + (i + 1) % n);
        }
        //侧面
        for (var i = 0; i <= n; i++) {
            var r = Math.PI * 2 * i / n;
            var x = Math.sin(r) * radius;
            var y1 = height;
            var y2 = 0;
            var z = Math.cos(r) * radius;
            this.vertices.push(x, y1, z);
            this.textureCoords.push(i / n, 1);
            this.normals.push(x, 0, z);
            this.vertices.push(x, y2, z);
            this.textureCoords.push(i / n, 0);
            this.normals.push(x, 0, z);
        }
        for (var i = 0; i < n; i++) {
            var ii = i * 2;
            this.indices.push(n * 2 + 2 + ii, n * 2 + 2 + ii + 1, n * 2 + 2 + ii + 2);
            this.indices.push(n * 2 + 2 + ii + 3, n * 2 + 2 + ii + 2, n * 2 + 2 + ii + 1);
        }
    };
    glRenderer.prototype.createCylinder = function () {
        //制作着色器程序
        var vertShader = this.getShader("shader-vs");
        var fragShader = this.getShader("shader-fs");
        var shaderProgram = this.gl.createProgram();
        this.gl.attachShader(shaderProgram, vertShader);
        this.gl.attachShader(shaderProgram, fragShader);
        this.gl.linkProgram(shaderProgram);
        this.gl.useProgram(shaderProgram);
        //获取接口位置，并开启数组模式
        this.attPosition = this.gl.getAttribLocation(shaderProgram, "position");
        this.attTexture = this.gl.getAttribLocation(shaderProgram, "textureCoord");
        this.attColor = this.gl.getAttribLocation(shaderProgram, "color");
        this.attNormal = this.gl.getAttribLocation(shaderProgram, "normal");
        this.gl.enableVertexAttribArray(this.attPosition);
        this.gl.enableVertexAttribArray(this.attTexture);
        this.gl.enableVertexAttribArray(this.attColor);
        this.gl.enableVertexAttribArray(this.attNormal);
        //指定顶点坐标的数据源、指定贴图位置数据源、指定顶点法线数据源
        //this.vertices = [];
        //this.normals = [];
        //this.textureCoords = [];
        //for (var i = 0; i < n; i++)
        //{
        //    var r1 = Math.PI * 2 * i / n;
        //    var x1 = Math.sin(r1) * radius;
        //    var y1 = height / 2;
        //    var z1 = Math.cos(r1) * radius;
        //    var r2 = Math.PI * 2 * (i + 1) / n;
        //    var x2 = Math.sin(r2) * radius;
        //    var y2 = height / 2;
        //    var z2 = Math.cos(r2) * radius;
        //    this.vertices.push(0, y1, 0, x1, y1, z1, x2, y2, z2);
        //    this.vertices.push(0, -y1, 0, x1, -y1, z1, x2, -y2, z2);
        //    this.vertices.push(x1, y1, z1, x2, y2, z2, x1, -y1, z1);
        //    this.vertices.push(x1, -y1, z1, x2, -y2, z2, x2, y2, z2);
        //    this.normals.push(0, 1, 0, 0, 1, 0, 0, 1, 0);
        //    this.normals.push(0, -1, 0, 0, -1, 0, 0, -1, 0);
        //    this.normals.push(x1, 0, z1, x2, 0, z2, x1, 0, z1);
        //    this.normals.push(x1, 0, z1, x2, 0, z2, x2, 0, z2);
        //    this.textureCoords.push(0.5, 0.5, 0.5 + x1 / 2 / radius, 0.5 + z1 / 2 / radius, 0.5 + x2 / 2 / radius, 0.5 + z2 / 2 / radius);
        //    this.textureCoords.push(0.5, 0.5, 0.5 + x1 / 2 / radius, 0.5 - z1 / 2 / radius, 0.5 + x2 / 2 / radius, 0.5 - z2 / 2 / radius);
        //    this.textureCoords.push(i / n, 0, (i + 1) / n, 0, i / n, 1);
        //    this.textureCoords.push(i / n, 1, (i + 1) / n, 1, (i + 1) / n, 0);
        //}
        this.getCylinderData(1, 4, 32);
        this.vertex_buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertex_buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.attPosition, 3, this.gl.FLOAT, false, 0, 0);
        this.normal_buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normal_buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.normals), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.attNormal, 3, this.gl.FLOAT, false, 0, 0);
        this.texture_buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texture_buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.textureCoords), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.attTexture, 2, this.gl.FLOAT, false, 0, 0);
        this.index_buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.STATIC_DRAW);
        //指定顶点颜色数据源
        this.colors = [];
        for (var i = 0; i < this.vertices.length / 3; i++) {
            this.colors.push(1, 1, 1);
        }
        //for (var i = 0; i < this.vertices.length / 36; i++)
        //{
        //    this.colors.push(0, 1, 0, 1, 0, 0, 1, 0, 0);
        //    this.colors.push(0, 1, 0, 0, 0, 1, 0, 0, 1);
        //    this.colors.push(1, 0, 0, 1, 0, 0, 0, 0, 1);
        //    this.colors.push(0, 0, 1, 0, 0, 1, 1, 0, 0);
        //}
        this.color_buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.color_buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.attColor, 3, this.gl.FLOAT, false, 0, 0);
        //设置投射矩阵
        this.proj_matrix = this.getProjection(40, this.canvas.width / this.canvas.height, 1, 100);
        this.mov_matrix = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
        this.view_matrix = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
        this.view_matrix[14] = this.view_matrix[14] - 6;
        //获取uniform们的句柄
        this.Pmatrix = this.gl.getUniformLocation(shaderProgram, "Pmatrix");
        this.Vmatrix = this.gl.getUniformLocation(shaderProgram, "Vmatrix");
        this.Mmatrix = this.gl.getUniformLocation(shaderProgram, "Mmatrix");
        this.uniTexture = this.gl.getUniformLocation(shaderProgram, "texture");
        this.lightColor = this.gl.getUniformLocation(shaderProgram, "lightColor");
        this.lightDirection = this.gl.getUniformLocation(shaderProgram, "lightDirection");
        this.lightEnvironment = this.gl.getUniformLocation(shaderProgram, "lightEnvironment");
        this.gl.uniformMatrix4fv(this.Pmatrix, false, this.proj_matrix);
        this.gl.uniformMatrix4fv(this.Vmatrix, false, this.view_matrix);
        this.gl.uniformMatrix4fv(this.Mmatrix, false, this.mov_matrix);
        this.gl.uniform3fv(this.lightColor, new Float32Array([0.8, 0.8, 0.8]));
        this.gl.uniform3fv(this.lightDirection, new Float32Array([0, -1, -1]));
        this.gl.uniform3fv(this.lightEnvironment, new Float32Array([0.2, 0.2, 0.2]));
        //深度测试
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        //设置图片数据
        this.initTexture(this.imgSource[this.imgIndex]);
    };
    glRenderer.prototype.drawCylinder = function (deltaTime) {
        this.gl.clearColor(0.2, 0.2, 0.2, 1.0);
        this.gl.clearDepth(1.0);
        this.gl.viewport(0.0, 0.0, this.canvas.width, this.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.rotateX(this.mov_matrix, deltaTime * 0.0001);
        this.gl.uniformMatrix4fv(this.Mmatrix, false, this.mov_matrix);
        this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT, 0);
        //this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertices.length / 3);
    };
    glRenderer.prototype.getShader = function (id) {
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }
        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }
        var shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        }
        else if (shaderScript.type == "x-shader/x-vertex") {
            shader = this.gl.createShader(this.gl.VERTEX_SHADER);
        }
        else {
            return null;
        }
        this.gl.shaderSource(shader, str);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            alert("compile" + this.gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    };
    glRenderer.prototype.getProjection = function (angle, a, zMin, zMax) {
        var ang = Math.tan((angle * 0.5) * Math.PI / 180);
        return new Float32Array([
            0.5 / ang, 0, 0, 0,
            0, 0.5 * a / ang, 0, 0,
            0, 0, -(zMax + zMin) / (zMax - zMin), -1,
            0, 0, (-2 * zMax * zMin) / (zMax - zMin), 0
        ]);
    };
    glRenderer.prototype.rotateX = function (m, angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var mv1 = m[1], mv5 = m[5], mv9 = m[9];
        m[1] = m[1] * c - m[2] * s;
        m[5] = m[5] * c - m[6] * s;
        m[9] = m[9] * c - m[10] * s;
        m[2] = m[2] * c + mv1 * s;
        m[6] = m[6] * c + mv5 * s;
        m[10] = m[10] * c + mv9 * s;
    };
    glRenderer.prototype.rotateY = function (m, angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var mv0 = m[0], mv4 = m[4], mv8 = m[8];
        m[0] = c * m[0] + s * m[2];
        m[4] = c * m[4] + s * m[6];
        m[8] = c * m[8] + s * m[10];
        m[2] = c * m[2] - s * mv0;
        m[6] = c * m[6] - s * mv4;
        m[10] = c * m[10] - s * mv8;
    };
    glRenderer.prototype.rotateZ = function (m, angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var mv0 = m[0], mv4 = m[4], mv8 = m[8];
        m[0] = c * m[0] - s * m[1];
        m[4] = c * m[4] - s * m[5];
        m[8] = c * m[8] - s * m[9];
        m[1] = c * m[1] + s * mv0;
        m[5] = c * m[5] + s * mv4;
        m[9] = c * m[9] + s * mv8;
    };
    return glRenderer;
}());
window.onload = function () {
    var renderer = new glRenderer();
    renderer.start();
};
//# sourceMappingURL=app.js.map