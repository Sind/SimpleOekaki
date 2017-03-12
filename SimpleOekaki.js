var VERSION = "0.0.2";

var MIN_BRUSH_SIZE = 1;
var MAX_BRUSH_SIZE = 31;
var DEFAULT_BRUSH_SIZE = 3;

function SimpleOekaki(div){

	var instance = this;
	// webgl
	var gl;
	var canvasFBO;
	var canvasTexture;
	var shaderProgram;
	var shaderProgram2;
	var vertexPositionAttribute;
	var vertexPositionAttribute2;
	var vertexScreenResolutionUniform;
	var vertexMousePositionUniform;
	var vertexSizeUniform;

	//html
	var holder;
	var canvas;
	var size_slider;
	var dec_size_button;
	var inc_size_button;

	//drawing state
	var diameter = DEFAULT_BRUSH_SIZE;
	var backgroundColor = [1,1,1];
	var layers = [
		{
			color:[1,0,0],
			glBlend:[1,0,0],
			visible: 1
		},
		{
			color:[0,1,0],
			glBlend:[0,1,0],
			visible: 1
		},
		{
			color:[0,0,1],
			glBlend:[0,1,0],
			visible: 1
		}
	];

	var paintCircle = function(mouseX, mouseY){
		gl.useProgram(shaderProgram);
		gl.bindFramebuffer(gl.FRAMEBUFFER, canvasFBO);
		gl.uniform2f(vertexScreenResolutionUniform, canvas.width,canvas.height);
		gl.uniform2f(vertexMousePositionUniform, mouseX,mouseY);
		gl.uniform1f(vertexSizeUniform, diameter);
		gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
	}

	var paintLine = function(x0, y0, x1, y1){
		var dist = Math.sqrt((x0-x1)*(x0-x1) + (y0-y1)*(y0-y1))
		for (var i = 0.5/dist; i <= 1.0; i+=0.5/dist){
			var x = x0*i + x1*(1-i)
			var y = y0*i + y1*(1-i)
			paintCircle(x,y)
		}
	}
	var paintGL = function(){
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.useProgram(shaderProgram2);
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
	}
	var getShader = function(str, type) {
		var shader = gl.createShader(type);
		gl.shaderSource(shader, str);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.log("JS:Shader compile failed");
			console.log(gl.getShaderInfoLog(shader));
			return null;
		}
		return shader;
	}

	var initBuffers = function(){
		var canvasBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER,canvasBuffer);
		gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([
		                      0, 0,
		                      1, 0,
		                      0, 1,
		                      1, 1
					  ]), gl.STATIC_DRAW);
		gl.vertexAttribPointer(vertexPositionAttribute,2,gl.FLOAT,false,0,0);
		
		var canvasBuffer2 = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER,canvasBuffer2);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( [
		                     -1, -1,
		                      1, -1,
		                      -1, 1,
		                      1, 1]), gl.STATIC_DRAW);
		gl.vertexAttribPointer(vertexPositionAttribute2,2,gl.FLOAT,false,0,0);

		canvasFBO = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, canvasFBO);
		canvasFBO.width = canvas.width;
		canvasFBO.height = canvas.height;
		
		canvasTexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, canvasTexture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvasFBO.width, canvasFBO.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, canvasTexture, 0);

		gl.clearColor(0,1,0,1)
		gl.clear(gl.COLOR_BUFFER_BIT);

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}

	var initShaders = function(){

		var v_sh = "attribute vec2 position;\n\
uniform vec2 screenResolution;\n\
uniform vec2 mousePosition;\n\
uniform float size;\n\
void main(){\n\
  vec2 scaledPosition = position * size - size/2.0;\n\
  vec2 movedPosition = mousePosition + vec2(0.5, 0.5) + scaledPosition;\n\
  vec2 pos = 2.0 * movedPosition / screenResolution - 1.0;\n\
  gl_Position = vec4(pos.x, -pos.y, 0.0, 1.0);\n\
}"
		var f_sh = "uniform highp vec2 screenResolution;\n\
uniform highp vec2 mousePosition;\n\
uniform highp float size;\n\
void main(void)\n\
{\n\
  highp vec2 pos = vec2(gl_FragCoord.x, screenResolution.y - gl_FragCoord.y);\n\
  highp float dist = distance(mousePosition + 0.5, pos);\n\
  if (dist > size/2.0 - 0.2) discard;\n\
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n\
}"
		console.log("vertexshader",gl.VERTEX_SHADER);
		var vertexShader = getShader(v_sh , gl.VERTEX_SHADER);
		var fragmentShader = getShader(f_sh , gl.FRAGMENT_SHADER);
		shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);
		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			console.log("Could not initialise shaders");
			console.log(gl.getProgramInfoLog(shaderProgram));
		}
		gl.useProgram(shaderProgram);
		vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "position");
		gl.enableVertexAttribArray(vertexPositionAttribute);

		vertexScreenResolutionUniform = gl.getUniformLocation(shaderProgram,"screenResolution");
		vertexMousePositionUniform= gl.getUniformLocation(shaderProgram,"mousePosition");
		vertexSizeUniform= gl.getUniformLocation(shaderProgram,"size");

		var v_sh2 = "attribute vec2 position;\n\
varying vec2 Texcoord;\n\
void main(void) {\n\
  Texcoord = (position+1.0) / 2.0;\n\
  gl_Position = vec4(position, 0.0, 1.0);\n\
}";

		var f_sh2 = " varying highp vec2 Texcoord;\n\
uniform highp sampler2D imageTex;\n\
void main(void){\n\
  highp vec4 texColor = texture2D(imageTex,Texcoord);\n\
  gl_FragColor = texColor;\n\
}";
		var vertexShader2 = getShader(v_sh2 , gl.VERTEX_SHADER);
		var fragmentShader2 = getShader(f_sh2 , gl.FRAGMENT_SHADER);
		shaderProgram2 = gl.createProgram();
		gl.attachShader(shaderProgram2, vertexShader2);
		gl.attachShader(shaderProgram2, fragmentShader2);
		gl.linkProgram(shaderProgram2);
		if (!gl.getProgramParameter(shaderProgram2, gl.LINK_STATUS)) {
			console.log("Could not initialise shaders");
			console.log(gl.getProgramInfoLog(shaderProgram2));
		}
		vertexPositionAttribute2 = gl.getAttribLocation(shaderProgram2, "position");
		gl.enableVertexAttribArray(vertexPositionAttribute2);
	}

	var initializeGL = function() {
		gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
		gl.clearColor(0.0, 0.0, 0.0, 1.0);

		gl.viewport(0, 0, canvas.width, canvas.height);

		// Initialize the shader program
		initShaders();
		initBuffers();
		setInterval(paintGL,15)
	}

	this.set_brush_size = function(size){
		if(size == diameter) return;
		diameter = size;
		if(diameter < MIN_BRUSH_SIZE){
			diameter = MIN_BRUSH_SIZE;
		}
		if(diameter > MAX_BRUSH_SIZE){
			diameter = MAX_BRUSH_SIZE;
		}
		console.log("brush size changed to",diameter);
		size_slider.value = diameter;
	}

	this.dec_brush_size = function(){
		instance.set_brush_size(diameter-2);
	}

	this.inc_brush_size = function(){
		instance.set_brush_size(diameter+2);

	}

	var setInputCallbacks = function(){

	    var offset;
	    var isDown;
	    var getOffset = function(el) {
			var rect = el.getBoundingClientRect(),
			scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
			scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
		}


	    canvas.addEventListener('mousedown', function (startEvent) {
			offset  = getOffset(canvas);
			currentMousePos = {
				x: startEvent.pageX - offset.left,
				y: startEvent.pageY - offset.top
			}
			isDown = true;

		});
		document.addEventListener('mouseup', function(startEvent){
			isDown = false;
		});
		document.addEventListener('mousemove', function (moveEvent) {
			if(!isDown) return
			nextPos = {
				x: moveEvent.pageX - offset.left,
				y: moveEvent.pageY - offset.top
			}
			paintLine(currentMousePos.x,currentMousePos.y,nextPos.x,nextPos.y);
			currentMousePos = nextPos;
			moveEvent.preventDefault();
		});

		canvas.addEventListener('touchstart', function(startEvent){
			offset  = getOffset(canvas);
			currentMousePos = {
				x: startEvent.changedTouches[0].pageX - offset.left,
				y: startEvent.changedTouches[0].pageY - offset.top
			}
			isDown = true;

		});
		document.addEventListener('touchend', function(startEvent){
			isDown = false;
		});
		canvas.addEventListener('touchmove', function(moveEvent){
			if(!isDown) return
			moveEvent.preventDefault();
			nextPos = {
				x: moveEvent.changedTouches[0].pageX - offset.left,
				y: moveEvent.changedTouches[0].pageY - offset.top
			}
			paintLine(currentMousePos.x,currentMousePos.y,nextPos.x,nextPos.y);
			currentMousePos = nextPos;
            moveEvent.stopPropagation();
        	moveEvent.cancelBubble = true;

		});
		dec_size_button.addEventListener('click', function(){
			instance.dec_brush_size();
		});
		inc_size_button.addEventListener('click', function(){
			instance.inc_brush_size();
		});
		size_slider.addEventListener('change', function(){
			instance.set_brush_size(parseInt(size_slider.value));
		})
	}

	this.version = function(){
		return VERSION;
	};

	if(div == null || div.tagName != 'DIV'){
		throw "You must provide a div as input parameter."
		return;
	}
	holder = document.createElement('div');
	canvas = document.createElement("canvas");
	inc_size_button = document.createElement('button');
	dec_size_button = document.createElement('button');
	inc_size_button.innerHTML = "increase brush";
	dec_size_button.innerHTML = "decrease brush";
	size_slider = document.createElement("INPUT");
	size_slider.setAttribute("type", "range");
	size_slider.min = MIN_BRUSH_SIZE;
	size_slider.max = MAX_BRUSH_SIZE;
	size_slider.step = 2;
	size_slider.value = DEFAULT_BRUSH_SIZE;

	canvas.height = 800;
	canvas.width = 800;
	div.appendChild(holder);
	holder.appendChild(dec_size_button);
	holder.appendChild(size_slider);
	holder.appendChild(inc_size_button);
	holder.appendChild(canvas);
	// Initialize the GL context
	initializeGL();
	if (!gl) {
		throw "could not create webgl context";
		return;
	}
	setInputCallbacks();

	return this;
}