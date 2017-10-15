

import CANVAS_V_SHADER from '../glsl/canvas.vsh';
import CANVAS_F_SHADER from '../glsl/canvas.fsh';
import LAYER_V_SHADER from '../glsl/layer.vsh';
import LAYER_F_SHADER from '../glsl/layer.fsh';

const VERSION = '0.2.1';
const MIN_BRUSH_SIZE = 1;
const MAX_BRUSH_SIZE = 31;
const DEFAULT_BRUSH_SIZE = 1;

const DEFAULT_BACKGROUND_COLOR = [1, 1, 1];
const DEFAULT_LAYER_COLOR = [0, 0, 0];

class SimpleOekakiCanvas {
  // Constants
  static get VERSION() { return VERSION; }
  static get MIN_BRUSH_SIZE() { return MIN_BRUSH_SIZE; }
  static get MAX_BRUSH_SIZE() { return MAX_BRUSH_SIZE; }
  static get DEFAULT_BRUSH_SIZE() { return DEFAULT_BRUSH_SIZE; }
  static get DEFAULT_BACKGROUND_COLOR() { return DEFAULT_BACKGROUND_COLOR; }
  static get DEFAULT_LAYER_COLOR() { return DEFAULT_LAYER_COLOR; }

  constructor(div) {
    // Drawing state
    this._diameter = DEFAULT_BRUSH_SIZE;
    this._backgroundColor = DEFAULT_BACKGROUND_COLOR;
    this._currentLayer = 2;
    this._layerOrder = [0, 1, 2];
    this._layerColors = [DEFAULT_LAYER_COLOR, DEFAULT_LAYER_COLOR, DEFAULT_LAYER_COLOR];
    this._layerVisibility = [1, 1, 1];

    this._canvas = document.createElement('canvas');
    this._canvas.height = 800;
    this._canvas.width = 800;

    div.appendChild(this._canvas);

    // Initialize the GL context
    this._initializeGL();
    if (!this._gl) {
      throw new Error('could not create webgl context');
    }
    this._setInputCallbacks();
  }
  get backgroundColor() {
    return this._backgroundColor;
  }
  set backgroundColor(colorArray) {
    this._backgroundColor = colorArray;
    console.log('backgroundColor set:', this.backgroundColor);
  }

  get currentLayer() {
    return this._currentLayer;
  }

  set currentLayer(id) {
    if (id === this._currentLayer) return;
    if (id >= 0 && id < 3) {
      this._currentLayer = id;
      if (this._onCurrentLayerChange) this._onCurrentLayerChange(id);
    }
  }

  get brushSize() {
    return this._diameter;
  }

  set brushSize(size) {
    if (size === this._diameter) return;
    this._diameter = size;
    if (this._diameter < MIN_BRUSH_SIZE) {
      this._diameter = MIN_BRUSH_SIZE;
    }
    if (this._diameter > MAX_BRUSH_SIZE) {
      this._diameter = MAX_BRUSH_SIZE;
    }
    console.log('brush size changed to', this._diameter);
    if (this._onBrushSizeChange) this._onBrushSizeChange(this._diameter);
  }

  getLayerColor(id) {
    return this._layerColors[id];
  }

  setLayerColor(id, colors) {
    this._layerColors[id] = colors;
    if (this._onLayerColorChange) this._onLayerColorChange(id, colors);
  }

  paintLine(x0, y0, x1, y1) {
    this._gl.useProgram(this._layerShaderProgram);
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._canvasFBO);
    this._gl.uniform4f(
      this._fragmentLineUniform, Math.round(x0) + 0.5,
      (800 - Math.round(y0)) + 0.5,
      Math.round(x1) + 0.5,
      (800 - Math.round(y1)) + 0.5,
    );
    this._gl.uniform1f(this._fragmentSizeUniform, this._diameter);
    this._gl.drawArrays(this._gl.TRIANGLE_STRIP, 0, 4);
  }
  paintGL() {
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
    this._gl.useProgram(this._canvasShaderProgram);
    this._gl.clearColor(
      this._backgroundColor[0],
      this._backgroundColor[1],
      this._backgroundColor[2],
      1.0,
    );
    this._gl.clear(this._gl.COLOR_BUFFER_BIT);
    this._gl.uniform3fv(this._fragmentBackgroundColorUniform, this._backgroundColor);
    this._gl.uniform3iv(this._fragmentLayerOrderUniform, this._layerOrder);
    this._gl.uniform3fv(this._fragmentLayerVisibilityUniform, this._layerVisibility);
    this._gl.uniformMatrix3fv(
      this._fragmentLayerColorsUniform,
      false,
      this._layerColors[0].concat(this._layerColors[1], this._layerColors[2]),
    );
    this._gl.drawArrays(this._gl.TRIANGLE_STRIP, 0, 4);
  }

  _getShader(str, type) {
    const shader = this._gl.createShader(type);
    this._gl.shaderSource(shader, str);
    this._gl.compileShader(shader);
    if (!this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS)) {
      console.log('JS:Shader compile failed');
      console.log(this._gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }
  _initBuffers() {
    const canvasBuffer = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, canvasBuffer);
    this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      1, 1,
    ]), this._gl.STATIC_DRAW);
    this._gl.vertexAttribPointer(this._vertexPositionAttribute2, 2, this._gl.FLOAT, false, 0, 0);
    this._gl.vertexAttribPointer(this._vertexPositionAttribute, 2, this._gl.FLOAT, false, 0, 0);

    this._canvasFBO = this._gl.createFramebuffer();
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._canvasFBO);
    this._canvasFBO.width = this._canvas.width;
    this._canvasFBO.height = this._canvas.height;

    this._canvasTexture = this._gl.createTexture();
    this._gl.bindTexture(this._gl.TEXTURE_2D, this._canvasTexture);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, this._gl.NEAREST);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.NEAREST);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.CLAMP_TO_EDGE);
    this._gl.texImage2D(
      this._gl.TEXTURE_2D,
      0,
      this._gl.RGBA,
      this._canvasFBO.width,
      this._canvasFBO.height,
      0,
      this._gl.RGBA,
      this._gl.UNSIGNED_BYTE,
      null,
    );
    this._gl.framebufferTexture2D(
      this._gl.FRAMEBUFFER,
      this._gl.COLOR_ATTACHMENT0,
      this._gl.TEXTURE_2D,
      this._canvasTexture,
      0,
    );

    this._gl.clearColor(0, 0, 0, 1);
    this._gl.clear(this._gl.COLOR_BUFFER_BIT);

    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
  }
  _initShaderProgram(fsh, vsh) {
    const vertexShader = this._getShader(vsh, this._gl.VERTEX_SHADER);
    const fragmentShader = this._getShader(fsh, this._gl.FRAGMENT_SHADER);
    const shaderProgram = this._gl.createProgram();
    this._gl.attachShader(shaderProgram, vertexShader);
    this._gl.attachShader(shaderProgram, fragmentShader);
    this._gl.linkProgram(shaderProgram);
    if (!this._gl.getProgramParameter(shaderProgram, this._gl.LINK_STATUS)) {
      console.log('Could not initialise shaders');
      console.log(this._gl.getProgramInfoLog(shaderProgram));
    }
    this._gl.useProgram(shaderProgram);
    const VertexPositionAttribute = this._gl.getAttribLocation(shaderProgram, 'position');
    this._gl.enableVertexAttribArray(VertexPositionAttribute);
    return shaderProgram;
  }
  _initShaders() {
    this._canvasShaderProgram = this._initShaderProgram(CANVAS_F_SHADER, CANVAS_V_SHADER);
    this._fragmentBackgroundColorUniform = this._gl.getUniformLocation(this._canvasShaderProgram, 'backgroundColor');
    this._fragmentLayerOrderUniform = this._gl.getUniformLocation(this._canvasShaderProgram, 'layerOrder');
    this._fragmentLayerColorsUniform = this._gl.getUniformLocation(this._canvasShaderProgram, 'layerColors');
    this._fragmentLayerVisibilityUniform = this._gl.getUniformLocation(this._canvasShaderProgram, 'layerVisibility');

    this._layerShaderProgram = this._initShaderProgram(LAYER_F_SHADER, LAYER_V_SHADER);
    this._fragmentLineUniform = this._gl.getUniformLocation(this._layerShaderProgram, 'line');
    this._fragmentSizeUniform = this._gl.getUniformLocation(this._layerShaderProgram, 'size');
  }
  _setInputCallbacks() {
    let isDown;
    let currentMousePos;
    const getMouse = (e) => {
      const bbox = this._canvas.getBoundingClientRect();
      const mx = e.clientX - (bbox.left * (this._canvas.width / bbox.width));
      const my = e.clientY - (bbox.top * (this._canvas.height / bbox.height));
      return { x: mx, y: my };
    };

    this._canvas.addEventListener('mousedown', (startEvent) => {
      currentMousePos = getMouse(startEvent);
      this.paintLine(currentMousePos.x, currentMousePos.y, currentMousePos.x, currentMousePos.y);
      isDown = true;
    });

    document.addEventListener('mouseup', () => {
      isDown = false;
    });
    document.addEventListener('mousemove', (moveEvent) => {
      if (!isDown) return;
      const nextPos = getMouse(moveEvent);
      this.paintLine(currentMousePos.x, currentMousePos.y, nextPos.x, nextPos.y);
      currentMousePos = nextPos;
      moveEvent.preventDefault();
    });

    this._canvas.addEventListener('touchstart', (startEvent) => {
      currentMousePos = getMouse(startEvent.targetTouches[0]);
      this.paintLine(currentMousePos.x, currentMousePos.y, currentMousePos.x, currentMousePos.y);
      isDown = true;
    });
    document.addEventListener('touchend', () => {
      isDown = false;
    });
    this._canvas.addEventListener('touchmove', (moveEvent) => {
      if (!isDown) return;
      moveEvent.preventDefault();

      const nextPos = getMouse(moveEvent.targetTouches[0]);

      this.paintLine(currentMousePos.x, currentMousePos.y, nextPos.x, nextPos.y);
      currentMousePos = nextPos;
      moveEvent.stopPropagation();
      moveEvent.cancelBubble = true;
    });
  }
  _initializeGL() {
    this._gl = this._canvas.getContext('webgl') || this._canvas.getContext('experimental-webgl');
    this._gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this._gl.viewport(0, 0, this._canvas.width, this._canvas.height);

    // Initialize the shader program
    this._initShaders();
    this._initBuffers();
    const self = this;
    setInterval(() => { self.paintGL(); }, 15);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SimpleOekakiCanvas;
}

if (window) {
  window.SimpleOekakiCanvas = SimpleOekakiCanvas;
}
