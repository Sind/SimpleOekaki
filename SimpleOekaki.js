var VERSION = "0.0.9";

var MIN_BRUSH_SIZE = 1;
var MAX_BRUSH_SIZE = 31;
var DEFAULT_BRUSH_SIZE = 1;

var DEFAULT_BACKGROUND_COLOR = [1, 1, 1];
var DEFAULT_LAYER_COLOR = [0, 0, 0];

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
	var fragmentSizeUniform;
	var fragmentLineUniform;
	var fragmentBackgroundColorUniform;
	var fragmentLayerOrderUniform;
	var fragmentLayerColorsUniform;
	var fragmentLayerVisibilityUniform;

	//html
	var holder;
	var canvas;
	var size_slider;
	var dec_size_button;
	var inc_size_button;

	//drawing state
	var diameter = DEFAULT_BRUSH_SIZE;
	var backgroundColor = DEFAULT_BACKGROUND_COLOR;
	var currentLayer = 0;
	var layerOrder = [0, 1, 2];
	var layerColors = [DEFAULT_LAYER_COLOR, DEFAULT_LAYER_COLOR, DEFAULT_LAYER_COLOR];
	var layerVisibility = [1, 1, 1];

	var paintLine = function(x0, y0, x1, y1){
		gl.useProgram(shaderProgram);
		gl.bindFramebuffer(gl.FRAMEBUFFER, canvasFBO);
		gl.uniform4f(fragmentLineUniform, Math.round(x0)+.5,800-Math.round(y0)+.5,Math.round(x1)+.5,800-Math.round(y1)+.5);
		gl.uniform1f(fragmentSizeUniform, diameter);
		gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
	}

	var paintGL = function(){
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.useProgram(shaderProgram2);
		gl.clearColor(backgroundColor[0], backgroundColor[1], backgroundColor[3], 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.uniform3fv(fragmentBackgroundColorUniform, backgroundColor)
		gl.uniform3iv(fragmentLayerOrderUniform, layerOrder);
		gl.uniform3fv(fragmentLayerVisibilityUniform, layerVisibility);
		gl.uniformMatrix3fv(fragmentLayerColorsUniform, false, layerColors[0].concat(layerColors[1],layerColors[2]));
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
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( [
		                     -1, -1,
		                      1, -1,
		                      -1, 1,
		                      1, 1]), gl.STATIC_DRAW);
		gl.vertexAttribPointer(vertexPositionAttribute2,2,gl.FLOAT,false,0,0);
		gl.vertexAttribPointer(vertexPositionAttribute,2,gl.FLOAT,false,0,0);

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

		gl.clearColor(0,0,0,1)
		gl.clear(gl.COLOR_BUFFER_BIT);

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}

	var initShaders = function(){
	
		var v_sh = "attribute vec2 position; \n\
void main(void) { \n\
  gl_Position = vec4(position, 0.0, 1.0); \n\
}";

	var f_sh = "precision mediump float;\n\
\n\
uniform vec4 line;\n\
uniform float size;\n\
\n\
void main(void){\n\
  float x = gl_FragCoord.x;\n\
  float y = gl_FragCoord.y;\n\
  \n\
  float x1 = line[0];\n\
  float y1 = line[1];\n\
  float x2 = line[2];\n\
  float y2 = line[3];\n\
\n\
  float A = x - x1;\n\
  float B = y - y1;\n\
  float C = x2 - x1;\n\
  float D = y2 - y1;\n\
  \n\
  float dot = A * C + B * D;\n\
  float len_sq = C * C + D * D;\n\
  float param = -1.0;\n\
  if (len_sq != 0.0) //in case of 0 length line\n\
      param = dot / len_sq;\n\
  \n\
  float xx, yy;\n\
  \n\
  if (param < 0.0){\n\
    xx = x1;\n\
    yy = y1;\n\
  } else if(param > 1.0){\n\
    xx = x2;\n\
    yy = y2;\n\
  } else if(abs(C) > abs(D)){\n\
    xx = floor(x1 + param * C) + 0.5;\n\
    yy = floor(y1 + (xx - x1) / C * D) + 0.5;\n\
  }else{\n\
    yy = floor(y1 + param * D) + 0.5;\n\
    xx = floor(x1 + (yy - y1) / D * C) +0.5;\n\
  }\n\
  float d = distance(vec2(x,y),vec2(xx,yy));\n\
\n\
  if(d > size/2.0) discard;\n\
\n\
  gl_FragColor = vec4(1.0,1.0,1.0,1.0);\n\
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

		// vertexScreenResolutionUniform = gl.getUniformLocation(shaderProgram,"screenResolution");
		// vertexMousePositionUniform= gl.getUniformLocation(shaderProgram,"mousePosition");
		fragmentLineUniform = gl.getUniformLocation(shaderProgram,"line");
		fragmentSizeUniform = gl.getUniformLocation(shaderProgram,"size");

		var v_sh2 = "attribute vec2 position; \n\
varying vec2 Texcoord; \n\
void main(void) { \n\
  Texcoord = (position+1.0) / 2.0; \n\
  gl_Position = vec4(position, 0.0, 1.0); \n\
}";

		var f_sh2 = "precision mediump float;\n\
\n\
varying vec2 Texcoord; \n\
uniform vec3 backgroundColor; \n\
uniform sampler2D imageTex; \n\
\n\
uniform ivec3 layerOrder; \n\
uniform vec3 layerVisibility; \n\
uniform mat3 layerColors; \n\
\n\
void main(void){ \n\
  vec4 texColor = texture2D(imageTex,Texcoord); \n\
\n\
  vec3 outputColor = backgroundColor; \n\
\n\
  for(int i = 0; i < 3; i++){ \n\
    int currentLayer = layerOrder[i]; \n\
\n\
	if(currentLayer == 0){ \n\
      vec3 currentColor = layerColors[0]; \n\
      float currentSet = texColor[0]; \n\
      currentSet = currentSet * layerVisibility[0]; \n\
      outputColor = currentSet * currentColor + outputColor * (1.0-currentSet); \n\
    } else if(currentLayer == 1){ \n\
      vec3 currentColor = layerColors[1];\n\
      float currentSet = texColor[1];\n\
      currentSet = currentSet * layerVisibility[1]; \n\
      outputColor = currentSet * currentColor + outputColor * (1.0-currentSet);\n\
    } else { \n\
      vec3 currentColor = layerColors[2];\n\
      float currentSet = texColor[2];\n\
      currentSet = currentSet * layerVisibility[2]; \n\
      outputColor = currentSet * currentColor + outputColor * (1.0-currentSet);\n\
    } \n\
  } \n\
  gl_FragColor = vec4(outputColor,1.0);\n\
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

		fragmentBackgroundColorUniform = gl.getUniformLocation(shaderProgram2, "backgroundColor");
		fragmentLayerOrderUniform = gl.getUniformLocation(shaderProgram2, "layerOrder");
		fragmentLayerColorsUniform = gl.getUniformLocation(shaderProgram2, "layerColors");
		fragmentLayerVisibilityUniform = gl.getUniformLocation(shaderProgram2, "layerVisibility");
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

		var isDown;
		var getMouse = function(e) {
		  var bbox = canvas.getBoundingClientRect();
		  var mx = e.clientX - bbox.left * (canvas.width / bbox.width);
		  var my = e.clientY - bbox.top * (canvas.height / bbox.height);
		  return {x:mx, y:my}
		}

		canvas.addEventListener('mousedown', function (startEvent) {
			currentMousePos = getMouse(startEvent);
			paintLine(currentMousePos.x,currentMousePos.y,currentMousePos.x,currentMousePos.y);
			isDown = true;

		});
		document.addEventListener('mouseup', function(stopEvent){
			isDown = false;
		});
		document.addEventListener('mousemove', function (moveEvent) {
			if(!isDown) return
			nextPos = getMouse(moveEvent);
			paintLine(currentMousePos.x,currentMousePos.y,nextPos.x,nextPos.y);
			currentMousePos = nextPos;
			moveEvent.preventDefault();
		});

		canvas.addEventListener('touchstart', function(startEvent){
			currentMousePos = getMouse(startEvent.targetTouches[0]);
			paintLine(currentMousePos.x,currentMousePos.y,currentMousePos.x,currentMousePos.y);
			isDown = true;

		});
		document.addEventListener('touchend', function(stopEvent){
			isDown = false;
		});
		canvas.addEventListener('touchmove', function(moveEvent){
			if(!isDown) return
			moveEvent.preventDefault();

			nextPos = getMouse(moveEvent.targetTouches[0]);

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