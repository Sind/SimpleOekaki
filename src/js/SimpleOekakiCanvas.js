

import CANVAS_V_SHADER from '../glsl/canvas.vsh';
import CANVAS_F_SHADER from '../glsl/canvas.fsh';
import LAYER_V_SHADER from '../glsl/layer.vsh';
import LAYER_F_SHADER from '../glsl/layer.fsh';

import PATTERN0 from '../png/0.png';
import PATTERN1 from '../png/1.png';
import PATTERN2 from '../png/2.png';
import PATTERN3 from '../png/3.png';
import PATTERN4 from '../png/4.png';
import PATTERN5 from '../png/5.png';
import PATTERN6 from '../png/6.png';
import PATTERN7 from '../png/7.png';
import PATTERN8 from '../png/8.png';
import PATTERN9 from '../png/9.png';
import PATTERN10 from '../png/10.png';

const VERSION = '0.4.1';
const MIN_BRUSH_SIZE = 1;
const MAX_BRUSH_SIZE = 31;
const DEFAULT_BRUSH_SIZE = 3;

const DEFAULT_BACKGROUND_COLOR = [1, 1, 1];
const DEFAULT_LAYER_COLOR = [0, 0, 0];

const PATTERNS = [
  PATTERN0,
  PATTERN1,
  PATTERN2,
  PATTERN3,
  PATTERN4,
  PATTERN5,
  PATTERN6,
  PATTERN7,
  PATTERN8,
  PATTERN9,
  PATTERN10,
];
class SimpleOekakiCanvas {
  // Constants
  static get VERSION() { return VERSION; }
  static get MIN_BRUSH_SIZE() { return MIN_BRUSH_SIZE; }
  static get MAX_BRUSH_SIZE() { return MAX_BRUSH_SIZE; }
  static get DEFAULT_BRUSH_SIZE() { return DEFAULT_BRUSH_SIZE; }
  static get DEFAULT_BACKGROUND_COLOR() { return DEFAULT_BACKGROUND_COLOR; }
  static get DEFAULT_LAYER_COLOR() { return DEFAULT_LAYER_COLOR; }
  static get PATTERNS() { return PATTERNS; }
  static get NUM_PATTERNS() { return PATTERNS.size; }
  static GET_PATTERN(i) { return PATTERNS[i]; }
  constructor(div) {
    // Drawing state
    this._diameter = DEFAULT_BRUSH_SIZE;
    this._backgroundColor = DEFAULT_BACKGROUND_COLOR;
    this._currentLayer = 2;
    this._layerOrder = [0, 1, 2];
    this._layerColors = [DEFAULT_LAYER_COLOR, DEFAULT_LAYER_COLOR, DEFAULT_LAYER_COLOR];
    this._layerVisibility = [1, 1, 1];
    this._currentPattern = 6;

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

  set backgroundColor(color) {
    // console.log(color)
    this._backgroundColor = color;
    if (this._onBackgroundColorChange) this._onBackgroundColorChange(color);
    // console.log('backgroundColor set:', this.backgroundColor);
  }

  get layerOrder() {
    return this._layerOrder;
  }

  set layerOrder(order) {
    this._layerOrder = order;
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

  set currentPattern(id) {
    this._currentPattern = Math.min(PATTERNS.size(), Math.max(0, id));

    if (this._onCurrentPatternChange) this._onCurrentPatternChange(id);
  }

  get currentPattern() {
    return this._currentPattern;
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
    // console.log('brush size changed to', this._diameter);
    if (this._onBrushSizeChange) this._onBrushSizeChange(this._diameter);
  }

  getLayerColor(id) {
    if (id === -1) {
      return this.backgroundColor;
    }
    return this._layerColors[id];
  }

  setLayerColor(id, color) {
    // console.log(id)
    if (id === -1) {
      this.backgroundColor = color;
    } else {
      this._layerColors[id] = color;
      if (this._onLayerColorChange) this._onLayerColorChange(id, color);
    }
  }

  paintLine(x0, y0, x1, y1) {
    console.log(x0, x1, y0, y1);
    const gl = this._gl;
    gl.useProgram(this._layerShaderProgram);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._canvasFBO);
    gl.uniform4f(
      this._fragmentLineUniform, x0 - 0.5,
      (800 - y0) + 0.5,
      x1 - 0.5,
      (800 - y1) + 0.5,
    );
    console.log([
      x0 - 0.5,
      (800 - y0) + 0.5,
      x1 - 0.5,
      (800 - y1) + 0.5,
    ]);
    const size = [
      0.1 + (2 * ((Math.abs(x0 - x1) + (2 * this._diameter)) / this._canvas.width)),
      0.1 + (2 * ((Math.abs(y0 - y1) + (2 * this._diameter)) / this._canvas.height)),
    ];
    const offset = [
      (((x0 + x1) / 2 / this._canvas.width) * 2) - 1,
      ((1 - ((y0 + y1) / 2 / this._canvas.height)) * 2) - 1,
    ];
    gl.uniform1f(this._fragmentThicknessUniform, this._diameter);
    gl.uniform2f(this._fragmentSizeUniform, size[0], size[1]);
    gl.uniform2f(this._fragmentOffsetUniform, offset[0], offset[1]);
    gl.activeTexture(gl.TEXTURE0 + 1);
    // gl.bindTexture(gl.TEXTURE_2D, this._textures[this._currentPattern]);
    // gl.uniform1i(this._fragmentPatternUniform, 1);
    gl.blendColor(
      (this._currentLayer === 0 ? 1 : 0),
      (this._currentLayer === 1 ? 1 : 0),
      (this._currentLayer === 2 ? 1 : 0),
      1,
    );
    gl.blendFunc(gl.CONSTANT_COLOR, gl.ONE_MINUS_CONSTANT_COLOR);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  paintGL() {
    const gl = this._gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.useProgram(this._canvasShaderProgram);
    gl.clearColor(
      this._backgroundColor[0],
      this._backgroundColor[1],
      this._backgroundColor[2],
      1.0,
    );
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform3fv(this._fragmentBackgroundColorUniform, this._backgroundColor);
    gl.uniform3iv(this._fragmentLayerOrderUniform, this._layerOrder);
    gl.uniform3fv(this._fragmentLayerVisibilityUniform, this._layerVisibility);
    gl.uniformMatrix3fv(
      this._fragmentLayerColorsUniform,
      false,
      this._layerColors[0].concat(this._layerColors[1], this._layerColors[2]),
    );
    gl.blendFunc(gl.ONE, gl.ZERO);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  _getShader(str, type) {
    const gl = this._gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, str);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      // console.log('JS:Shader compile failed');
      // console.log(gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }
  _loadTexture(url) {
    const gl = this._gl;
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Because images have to be download over the internet
    // they might take a moment until they are ready.
    // Until then put a single pixel in the texture so we can
    // use it immediately. When the image has finished downloading
    // we'll update the texture with the contents of the image.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 0, 0]);
    gl.texImage2D(
      gl.TEXTURE_2D, level, internalFormat,
      width, height, border, srcFormat, srcType,
      pixel,
    );
    const image = new Image();
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D, level, internalFormat,
        srcFormat, srcType, image,
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    };
    console.log("generating texture " + texture + " from " + url)
    image.src = url;
    return texture;
  }
  _initBuffers() {
    const gl = this._gl;
    const canvasBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, canvasBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      1, 1,
    ]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(this._vertexPositionAttribute2, 2, gl.FLOAT, false, 0, 0);
    gl.vertexAttribPointer(this._vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);

    this._canvasFBO = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._canvasFBO);
    this._canvasFBO.width = this._canvas.width;
    this._canvasFBO.height = this._canvas.height;
    // this._textures = PATTERNS.map(pattern => this._loadTexture(pattern));

    this._canvasTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this._canvasTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      this._canvasFBO.width,
      this._canvasFBO.height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null,
    );
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      this._canvasTexture,
      0,
    );

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
  _initShaderProgram(fsh, vsh) {
    const gl = this._gl;
    const vertexShader = this._getShader(vsh, gl.VERTEX_SHADER);
    const fragmentShader = this._getShader(fsh, gl.FRAGMENT_SHADER);
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      // console.log('Could not initialise shaders');
      // console.log(gl.getProgramInfoLog(shaderProgram));
    }
    gl.useProgram(shaderProgram);
    const VertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'position');
    gl.enableVertexAttribArray(VertexPositionAttribute);
    return shaderProgram;
  }
  _initShaders() {
    const gl = this._gl;
    this._canvasShaderProgram = this._initShaderProgram(CANVAS_F_SHADER, CANVAS_V_SHADER);
    this._fragmentBackgroundColorUniform = gl.getUniformLocation(this._canvasShaderProgram, 'backgroundColor');
    this._fragmentLayerOrderUniform = gl.getUniformLocation(this._canvasShaderProgram, 'layerOrder');
    this._fragmentLayerColorsUniform = gl.getUniformLocation(this._canvasShaderProgram, 'layerColors');
    this._fragmentLayerVisibilityUniform = gl.getUniformLocation(this._canvasShaderProgram, 'layerVisibility');

    this._layerShaderProgram = this._initShaderProgram(LAYER_F_SHADER, LAYER_V_SHADER);
    this._fragmentLineUniform = gl.getUniformLocation(this._layerShaderProgram, 'line');
    this._fragmentThicknessUniform = gl.getUniformLocation(this._layerShaderProgram, 'thickness');
    this._fragmentOffsetUniform = gl.getUniformLocation(this._layerShaderProgram, 'offset');
    this._fragmentSizeUniform = gl.getUniformLocation(this._layerShaderProgram, 'size');
    // this._fragmentPatternUniform = gl.getUniformLocation(this._layerShaderProgram, 'pattern');
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
