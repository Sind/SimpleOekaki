const fs = require('fs');

const MIN_BRUSH_SIZE = 1;
const MAX_BRUSH_SIZE = 31;
const DEFAULT_BRUSH_SIZE = 1;

const DEFAULT_BACKGROUND_COLOR = [1, 1, 1];
const DEFAULT_LAYER_COLOR = [0, 0, 0];

const SimpleOekakiCanvas = (div, options) => {
  const instance = {};
  instance.MIN_BRUSH_SIZE = () => MIN_BRUSH_SIZE;
  instance.MAX_BRUSH_SIZE = () => MAX_BRUSH_SIZE;
  instance.DEFAULT_BRUSH_SIZE = () => DEFAULT_BRUSH_SIZE;
  instance.DEFAULT_BACKGROUND_COLOR = () => DEFAULT_BACKGROUND_COLOR;
  instance.DEFAULT_LAYER_COLOR = () => DEFAULT_LAYER_COLOR;
  // webgl
  let gl;
  let canvasFBO;
  let canvasTexture;
  let shaderProgram;
  let shaderProgram2;
  let vertexPositionAttribute;
  let vertexPositionAttribute2;
  let fragmentSizeUniform;
  let fragmentLineUniform;
  let fragmentBackgroundColorUniform;
  let fragmentLayerOrderUniform;
  let fragmentLayerColorsUniform;
  let fragmentLayerVisibilityUniform;

  // drawing state
  instance.diameter = DEFAULT_BRUSH_SIZE;
  instance.backgroundColor = DEFAULT_BACKGROUND_COLOR;
  let currentLayer = 0;
  let layerOrder = [0, 1, 2];
  let layerColors = [DEFAULT_LAYER_COLOR, DEFAULT_LAYER_COLOR, DEFAULT_LAYER_COLOR];
  let layerVisibility = [1, 1, 1];

  const canvas = document.createElement('canvas');
  canvas.height = 800;
  canvas.width = 800;

  div.appendChild(canvas);


  const paintLine = (x0, y0, x1, y1) => {
    gl.useProgram(shaderProgram);
    gl.bindFramebuffer(gl.FRAMEBUFFER, canvasFBO);
    gl.uniform4f(
      fragmentLineUniform, Math.round(x0) + 0.5,
      (800 - Math.round(y0)) + 0.5,
      Math.round(x1) + 0.5,
      (800 - Math.round(y1)) + 0.5,
    );
    gl.uniform1f(fragmentSizeUniform, instance.diameter);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  const paintGL = () => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.useProgram(shaderProgram2);
    gl.clearColor(instance.backgroundColor[0], instance.backgroundColor[1], instance.backgroundColor[2], 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform3fv(fragmentBackgroundColorUniform, instance.backgroundColor);
    gl.uniform3iv(fragmentLayerOrderUniform, layerOrder);
    gl.uniform3fv(fragmentLayerVisibilityUniform, layerVisibility);
    gl.uniformMatrix3fv(
      fragmentLayerColorsUniform,
      false,
      layerColors[0].concat(layerColors[1], layerColors[2]),
    );
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  const getShader = (str, type) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, str);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.log('JS:Shader compile failed');
      console.log(gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  };

  const initBuffers = () => {
    const canvasBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, canvasBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      1, 1,
    ]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vertexPositionAttribute2, 2, gl.FLOAT, false, 0, 0);
    gl.vertexAttribPointer(vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);

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
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      canvasFBO.width,
      canvasFBO.height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null,
    );
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, canvasTexture, 0);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  };

  const initShaders = () => {
    const VShader = fs.readFileSync('./src/glsl/layer.vsh', 'utf8');

    const FShader = fs.readFileSync('./src/glsl/layer.fsh', 'utf8');

    const vertexShader = getShader(VShader, gl.VERTEX_SHADER);
    const fragmentShader = getShader(FShader, gl.FRAGMENT_SHADER);
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.log('Could not initialise shaders');
      console.log(gl.getProgramInfoLog(shaderProgram));
    }
    gl.useProgram(shaderProgram);
    vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'position');
    gl.enableVertexAttribArray(vertexPositionAttribute);

    // vertexScreenResolutionUniform = gl.getUniformLocation(shaderProgram,"screenResolution");
    // vertexMousePositionUniform= gl.getUniformLocation(shaderProgram,"mousePosition");
    fragmentLineUniform = gl.getUniformLocation(shaderProgram, 'line');
    fragmentSizeUniform = gl.getUniformLocation(shaderProgram, 'size');

    const VShader2 = fs.readFileSync('./src/glsl/canvas.vsh', 'utf8');

    const FShader2 = fs.readFileSync('./src/glsl/canvas.fsh', 'utf8');

    const vertexShader2 = getShader(VShader2, gl.VERTEX_SHADER);
    const fragmentShader2 = getShader(FShader2, gl.FRAGMENT_SHADER);
    shaderProgram2 = gl.createProgram();
    gl.attachShader(shaderProgram2, vertexShader2);
    gl.attachShader(shaderProgram2, fragmentShader2);
    gl.linkProgram(shaderProgram2);
    if (!gl.getProgramParameter(shaderProgram2, gl.LINK_STATUS)) {
      console.log('Could not initialise shaders');
      console.log(gl.getProgramInfoLog(shaderProgram2));
    }
    vertexPositionAttribute2 = gl.getAttribLocation(shaderProgram2, 'position');
    gl.enableVertexAttribArray(vertexPositionAttribute2);

    fragmentBackgroundColorUniform = gl.getUniformLocation(shaderProgram2, 'backgroundColor');
    fragmentLayerOrderUniform = gl.getUniformLocation(shaderProgram2, 'layerOrder');
    fragmentLayerColorsUniform = gl.getUniformLocation(shaderProgram2, 'layerColors');
    fragmentLayerVisibilityUniform = gl.getUniformLocation(shaderProgram2, 'layerVisibility');
  };

  const initializeGL = () => {
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.viewport(0, 0, canvas.width, canvas.height);

    // Initialize the shader program
    initShaders();
    initBuffers();
    setInterval(paintGL, 15);
  };


  instance.setBackgroundColor = (colorArray) => {
    instance.backgroundColor = colorArray;
    console.log('backgroundColor set:', instance.backgroundColor);
  };

  instance.setBrushSize = (size) => {
    if (size === instance.diameter) return;
    instance.diameter = size;
    if (instance.diameter < MIN_BRUSH_SIZE) {
      instance.diameter = MIN_BRUSH_SIZE;
    }
    if (instance.diameter > MAX_BRUSH_SIZE) {
      instance.diameter = MAX_BRUSH_SIZE;
    }
    console.log('brush size changed to', instance.diameter);

    if (options && options.onBrushSizeChange) {
      options.onBrushSizeChange(instance.diameter);
    }
  };

  instance.decBrushSize = () => {
    instance.setBrushSize(instance.diameter - 2);
  };

  instance.incBrushSize = () => {
    instance.setBrushSize(instance.diameter + 2);
  };
  const setInputCallbacks = () => {
    let isDown;
    let currentMousePos;
    const getMouse = (e) => {
      const bbox = canvas.getBoundingClientRect();
      const mx = e.clientX - (bbox.left * (canvas.width / bbox.width));
      const my = e.clientY - (bbox.top * (canvas.height / bbox.height));
      return { x: mx, y: my };
    };

    canvas.addEventListener('mousedown', (startEvent) => {
      currentMousePos = getMouse(startEvent);
      paintLine(currentMousePos.x, currentMousePos.y, currentMousePos.x, currentMousePos.y);
      isDown = true;
    });

    document.addEventListener('mouseup', () => {
      isDown = false;
    });
    document.addEventListener('mousemove', (moveEvent) => {
      if (!isDown) return;
      const nextPos = getMouse(moveEvent);
      paintLine(currentMousePos.x, currentMousePos.y, nextPos.x, nextPos.y);
      currentMousePos = nextPos;
      moveEvent.preventDefault();
    });

    canvas.addEventListener('touchstart', (startEvent) => {
      currentMousePos = getMouse(startEvent.targetTouches[0]);
      paintLine(currentMousePos.x, currentMousePos.y, currentMousePos.x, currentMousePos.y);
      isDown = true;
    });
    document.addEventListener('touchend', () => {
      isDown = false;
    });
    canvas.addEventListener('touchmove', (moveEvent) => {
      if (!isDown) return;
      moveEvent.preventDefault();

      const nextPos = getMouse(moveEvent.targetTouches[0]);

      paintLine(currentMousePos.x, currentMousePos.y, nextPos.x, nextPos.y);
      currentMousePos = nextPos;
      moveEvent.stopPropagation();
      moveEvent.cancelBubble = true;
    });
  };

  // Initialize the GL context
  initializeGL();
  if (!gl) {
    throw 'could not create webgl context';
  }
  setInputCallbacks();
  return instance;
};


if (typeof module !== 'undefined' && module.exports) {
  module.exports = SimpleOekakiCanvas;
}

if (window) {
  window.SimpleOekakiCanvas = SimpleOekakiCanvas;
}
