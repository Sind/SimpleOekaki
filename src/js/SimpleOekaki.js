

// const fs = require('fs');
import ColorPicker from 'iro.js/src/modules/colorPicker';
import Sortable from 'sortablejs';
import '../css/SimpleOekaki.scss';

const SimpleOekakiCanvas = require('./SimpleOekakiCanvas.js');
const utils = require('./utils.js');

class SimpleOekaki extends SimpleOekakiCanvas {
  constructor(div) {
    if (div == null || div.tagName !== 'DIV') {
      throw new Error('You must provide a div as input parameter.');
    }

    /* HTML */
    /* Main DIV */
    const maindiv = document.createElement('div');
    div.appendChild(maindiv);
    maindiv.classList.add('SimpleOekaki');
    maindiv.setAttribute('oncontextmenu', 'return false;');

    /* Filter for coloring the halftone buttons */
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    maindiv.appendChild(svg);
    svg.classList.add('defs-only');

    /* Options bar at the top */
    const optionsholder = document.createElement('div');
    maindiv.appendChild(optionsholder);
    optionsholder.classList.add('optionsholder');

    /* Canvas holder */
    const canvasholder = document.createElement('div');
    canvasholder.classList.add('canvasholder');
    maindiv.appendChild(canvasholder);

    super(canvasholder);

    const colorFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    svg.appendChild(colorFilter);
    colorFilter.setAttribute('color-interpolation-filters', 'linearRBG');
    colorFilter.id = 'color-filter';

    this._colorMatrix = document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix');
    colorFilter.appendChild(this._colorMatrix);
    this._colorMatrix.setAttribute('type', 'matrix');
    this._colorMatrix.setAttribute('values', [
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0,
      0, 0, 0, 1, 0,
    ]);

    /* First row of options */
    const toprow = document.createElement('div');
    toprow.classList.add('optionsrow');
    optionsholder.appendChild(toprow);

    this._decSizeButton = document.createElement('i');
    toprow.appendChild(this._decSizeButton);
    this._decSizeButton.classList.add('material-icons');
    this._decSizeButton.classList.add('option');
    this._decSizeButton.innerHTML = 'remove';

    this._sizeSlider = document.createElement('input');
    toprow.appendChild(this._sizeSlider);
    this._sizeSlider.setAttribute('type', 'range');
    this._sizeSlider.classList.add('option');
    this._sizeSlider.step = 2;
    this._sizeSlider.value = SimpleOekakiCanvas.DEFAULT_BRUSH_SIZE;
    this._sizeSlider.min = SimpleOekakiCanvas.MIN_BRUSH_SIZE;
    this._sizeSlider.max = SimpleOekakiCanvas.MAX_BRUSH_SIZE;

    this._incSizeButton = document.createElement('i');
    toprow.appendChild(this._incSizeButton);
    this._incSizeButton.classList.add('material-icons');
    this._incSizeButton.classList.add('option');
    this._incSizeButton.innerHTML = 'add';

    this._layerMenuOpenButton = document.createElement('i');
    toprow.appendChild(this._layerMenuOpenButton);
    this._layerMenuOpenButton.classList.add('material-icons');
    this._layerMenuOpenButton.classList.add('option');
    this._layerMenuOpenButton.innerHTML = 'layers';


    /* Second row of options */
    const bottomrow = document.createElement('div');
    bottomrow.classList.add('optionsrow');
    optionsholder.appendChild(bottomrow);

    this._patternButtonHolders = [];
    this._patternButtons = [];

    SimpleOekaki.PATTERNS.forEach((pattern, index) => {
      const patternButtonHolder = document.createElement('div');
      patternButtonHolder.classList.add('option');
      patternButtonHolder.classList.add('pattern-button-holder');
      const patternButton = document.createElement('div');
      patternButtonHolder.appendChild(patternButton);
      bottomrow.appendChild(patternButtonHolder);
      patternButton.classList.add('pattern-button');
      if (index === 0) patternButton.classList.add('active');
      patternButton.style.backgroundImage = `url(${pattern})`;
      this._patternButtonHolders[index] = patternButtonHolder;
      this._patternButtons[index] = patternButton;
    });

    this._invisibleLayerMenuOverlay = document.createElement('div');
    maindiv.appendChild(this._invisibleLayerMenuOverlay);
    this._invisibleLayerMenuOverlay.classList.add('invisible-overlay');
    this._invisibleLayerMenuOverlay.classList.add('hidden');

    this._layerMenu = document.createElement('div');
    maindiv.appendChild(this._layerMenu);
    this._layerMenu.classList.add('layer-menu');
    this._layerMenu.classList.add('hidden');

    const layerMenuOptionsHolder = document.createElement('div');
    this._layerMenu.appendChild(layerMenuOptionsHolder);
    layerMenuOptionsHolder.classList.add('optionsholder');

    const layerMenuOptionsRow = document.createElement('div');
    layerMenuOptionsHolder.appendChild(layerMenuOptionsRow);
    layerMenuOptionsRow.classList.add('optionsrow');
    layerMenuOptionsRow.classList.add('reverse');

    this._layerMenuCloseButton = document.createElement('i');
    layerMenuOptionsRow.appendChild(this._layerMenuCloseButton);
    this._layerMenuCloseButton.classList.add('material-icons');
    this._layerMenuCloseButton.classList.add('option');
    this._layerMenuCloseButton.innerHTML = 'close';

    this._layerList = document.createElement('div');
    this._layerMenu.appendChild(this._layerList);
    this._layerList.classList.add('layer-list');
    this._layerList.classList.add('list-group');

    this._layers = [
      document.createElement('div'),
      document.createElement('div'),
      document.createElement('div'),
    ];
    this._layersColorSelect = [];

    this._layers.forEach((layer, index) => {
      this._layerList.appendChild(layer);
      layer.classList.add('layer');
      layer.classList.add('list-group-item');
      layer.classList.add('optionsholder');
      layer.setAttribute('data-layer-id', 2 - index);
      if (index === 0) layer.classList.add('selected');

      const text = document.createElement('div');
      layer.appendChild(text);
      text.classList.add('optionsrow');
      text.classList.add('layer-selector');

      const label = document.createElement('div');
      text.appendChild(label);
      label.classList.add('option');
      label.classList.add('label');
      label.innerHTML = `Layer ${3 - index}`;

      const options = document.createElement('div');
      layer.appendChild(options);
      options.classList.add('optionsrow');

      // const visibilityButton = document.createElement('i');
      // options.appendChild(visibilityButton);
      // visibilityButton.classList.add('material-icons');
      // visibilityButton.classList.add('option');
      // visibilityButton.innerHTML = 'visibility';

      this._layersColorSelect[2 - index] = document.createElement('div');
      options.appendChild(this._layersColorSelect[2 - index]);
      this._layersColorSelect[2 - index].classList.add('color-select');
      this._layersColorSelect[2 - index].classList.add('option');
      this._layersColorSelect[2 - index].classList.add('grow');
      this._layersColorSelect[2 - index].style.backgroundColor = 'rgb(0,0,0)';
    });

    this._backgroundLayer = document.createElement('div');
    this._layerMenu.appendChild(this._backgroundLayer);
    this._backgroundLayer.classList.add('layer');
    this._backgroundLayer.classList.add('optionsholder');
    this._backgroundLayer.setAttribute('data-layer-id', -1);

    const text = document.createElement('div');
    this._backgroundLayer.appendChild(text);
    text.classList.add('optionsrow');
    text.classList.add('layer-selector');

    const label = document.createElement('div');
    text.appendChild(label);
    label.classList.add('option');
    label.classList.add('label');
    label.innerHTML = 'Background';

    const options = document.createElement('div');
    this._backgroundLayer.appendChild(options);
    options.classList.add('optionsrow');

    this._backgroundColorSelect = document.createElement('div');
    options.appendChild(this._backgroundColorSelect);
    this._backgroundColorSelect.classList.add('color-select');
    this._backgroundColorSelect.classList.add('option');
    this._backgroundColorSelect.classList.add('grow');
    this._backgroundColorSelect.style.backgroundColor = 'rgb(255,255,255)';

    this._invisibleColorMenuOverlay = document.createElement('div');
    maindiv.appendChild(this._invisibleColorMenuOverlay);
    this._invisibleColorMenuOverlay.classList.add('invisible-overlay');
    this._invisibleColorMenuOverlay.classList.add('hidden');

    this._colorMenu = document.createElement('div');
    maindiv.append(this._colorMenu);
    this._colorMenu.classList.add('color-menu');
    this._colorMenu.classList.add('hidden');

    const colorMenuOptionsHolder = document.createElement('div');
    this._colorMenu.appendChild(colorMenuOptionsHolder);
    colorMenuOptionsHolder.classList.add('optionsholder');

    const colorMenuOptionsRow = document.createElement('div');
    colorMenuOptionsHolder.appendChild(colorMenuOptionsRow);
    colorMenuOptionsRow.classList.add('optionsrow');
    colorMenuOptionsRow.classList.add('reverse');

    this._colorMenuCloseButton = document.createElement('i');
    colorMenuOptionsRow.appendChild(this._colorMenuCloseButton);
    this._colorMenuCloseButton.classList.add('material-icons');
    this._colorMenuCloseButton.classList.add('option');
    this._colorMenuCloseButton.innerHTML = 'close';

    const colorMenuPickerRow = document.createElement('div');
    colorMenuOptionsHolder.appendChild(colorMenuPickerRow);
    colorMenuPickerRow.classList.add('optionsrow');
    colorMenuPickerRow.classList.add('center');

    const colorPickerHolder = document.createElement('div');
    colorMenuPickerRow.appendChild(colorPickerHolder);
    colorPickerHolder.classList.add('color-wheel-holder');
    colorPickerHolder.id = 'color-wheel-holder';

    this._colorPicker = new ColorPicker('#color-wheel-holder');

    this._setHTMLInputCallbacks();
  }

  _onBrushSizeChange(brushSize) {
    this._sizeSlider.value = brushSize;
  }

  _onCurrentLayerChange(id) {
    this._layers.forEach((layer) => {
      if (id === parseInt(layer.getAttribute('data-layer-id'), 10)) {
        layer.classList.add('selected');
      } else {
        layer.classList.remove('selected');
      }
      this._setPatternForegroundColor(id, this.getLayerColor(id));
    });
  }

  _onBackgroundColorChange(color) {
    const colorString = `rgb(${color[0] * 255},${color[1] * 255},${color[2] * 255})`;
    this._backgroundColorSelect.style.backgroundColor = colorString;
    this._setPatternBackgroundColor(color);
  }

  _onLayerColorChange(id, color) {
    const colorString = `rgb(${color[0] * 255},${color[1] * 255},${color[2] * 255})`;
    this._layersColorSelect[id].style.backgroundColor = colorString;
    this._setPatternForegroundColor(id, color);
  }

  _onCurrentPatternChange(id) {
    this._patternButtons.forEach((patternButton, index) => {
      if (id === index) {
        patternButton.classList.add('active');
      } else {
        patternButton.classList.remove('active');
      }
    });
  }

  _setHTMLInputCallbacks() {
    this._decSizeButton.addEventListener('click', () => {
      this.brushSize -= 2;
    });
    this._incSizeButton.addEventListener('click', () => {
      this.brushSize += 2;
    });
    this._sizeSlider.addEventListener('change', () => {
      this.brushSize = parseInt(this._sizeSlider.value, 10);
    });
    this._layerMenuOpenButton.addEventListener('click', () => {
      this.openLayerMenu();
    });
    this._layerMenuCloseButton.addEventListener('click', () => {
      this.closeLayerMenu();
    });
    this._invisibleLayerMenuOverlay.addEventListener('click', () => {
      this.closeLayerMenu();
    });
    this._colorMenuCloseButton.addEventListener('click', () => {
      this.closeColorMenu();
    });
    this._invisibleColorMenuOverlay.addEventListener('click', () => {
      this.closeColorMenu();
    });

    Sortable.create(this._layerList, {
      onUpdate: (event) => {
        // console.log(event.to)
        // console.log(Array.prototype.map.call(event.to.children, (el) => { return el.getAttribute('data-layer-id'); }));
        this.layerOrder = Array.prototype.map.call(event.to.children, el => el.getAttribute('data-layer-id')).reverse();
      },
    });

    this._patternButtons.forEach((patternButton, index) => {
      patternButton.addEventListener('click', () => {
        this.currentPattern = index;
      });
    });

    Array.prototype.forEach.call(document.getElementsByClassName('layer-selector'), (text) => {
      const id = parseInt(text.parentNode.getAttribute('data-layer-id'), 10);
      if (id === -1) return;
      text.addEventListener('click', () => {
        this.currentLayer = id;
      }, this);
    });

    Array.prototype.forEach.call(document.getElementsByClassName('color-select'), (colorfield) => {
      const id = parseInt(colorfield.parentNode.parentNode.getAttribute('data-layer-id'), 10);
      console.log(id)
      colorfield.addEventListener('click', () => {
        this.openColorMenu();
        this._colorPicker.off('color:change');
        this._colorPicker.on('color:change', (color) => {
          this.setLayerColor(id, utils.iRGBtoRGB(color.rgb));
        });
        this._colorPicker.color.rgb = utils.RGBtoiRGB(this.getLayerColor(id));
      });
    }, this);
  }
  openLayerMenu() {
    this._layerMenu.classList.remove('hidden');
    this._invisibleLayerMenuOverlay.classList.remove('hidden');
  }

  closeLayerMenu() {
    this._layerMenu.classList.add('hidden');
    this._invisibleLayerMenuOverlay.classList.add('hidden');
  }

  openColorMenu() {
    this._colorMenu.classList.remove('hidden');
    this._invisibleColorMenuOverlay.classList.remove('hidden');
  }

  closeColorMenu() {
    this._colorMenu.classList.add('hidden');
    this._invisibleColorMenuOverlay.classList.add('hidden');
  }
  _setPatternForegroundColor(id, color) {
    if (this.currentLayer === id) {
      this._colorMatrix.setAttribute('values', [
        color[0], 0, 0, 0, 0,
        0, color[1], 0, 0, 0,
        0, 0, color[2], 0, 0,
        0, 0, 0, 1, 0,
      ]);
    }
  }
  _setPatternBackgroundColor(color) {
    this._patternButtonHolders.forEach((patternButtonHolder) => {
      patternButtonHolder.style.backgroundColor = utils.RGBtoHTML(color);
    });
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SimpleOekaki;
}

if (window) {
  window.SimpleOekaki = SimpleOekaki;
}
