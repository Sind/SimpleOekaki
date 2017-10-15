

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
    // html
    const maindiv = document.createElement('div');
    div.appendChild(maindiv);
    maindiv.classList.add('SimpleOekaki');
    maindiv.setAttribute('oncontextmenu', 'return false;');

    const optionsholder = document.createElement('div');
    maindiv.appendChild(optionsholder);
    optionsholder.classList.add('optionsholder');

    const canvasholder = document.createElement('div');
    canvasholder.classList.add('canvasholder');
    maindiv.appendChild(canvasholder);

    const toprow = document.createElement('div');
    toprow.classList.add('optionsrow');
    optionsholder.appendChild(toprow);
    
    const bottomrow = document.createElement('div');
    bottomrow.classList.add('optionsrow');
    optionsholder.appendChild(bottomrow);
    
    super(canvasholder);
    
    this._incSizeButton = document.createElement('i');
    toprow.appendChild(this._incSizeButton);
    this._incSizeButton.classList.add('material-icons');
    this._incSizeButton.classList.add('option');
    this._incSizeButton.innerHTML = 'add';

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

    this._layerMenuOpenButton = document.createElement('i');
    toprow.appendChild(this._layerMenuOpenButton);
    this._layerMenuOpenButton.classList.add('material-icons');
    this._layerMenuOpenButton.classList.add('option');
    this._layerMenuOpenButton.innerHTML = 'layers';

    this._backgroundColorSelector = document.createElement('input');
    toprow.appendChild(this._backgroundColorSelector);
    this._backgroundColorSelector.setAttribute('type', 'color');
    this._backgroundColorSelector.setAttribute('value', utils.RGBtoHTML(this.backgroundColor));

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

      const visibilityButton = document.createElement('i');
      options.appendChild(visibilityButton);
      visibilityButton.classList.add('material-icons');
      visibilityButton.classList.add('option');
      visibilityButton.innerHTML = 'visibility';

      const colorSelect = document.createElement('div');
      options.appendChild(colorSelect);
      colorSelect.classList.add('color-select');
      colorSelect.classList.add('option');
      colorSelect.classList.add('grow');

    });

    Sortable.create(this._layerList);

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

    const colorSelect = document.createElement('div');
    options.appendChild(colorSelect);
    colorSelect.classList.add('color-select');
    colorSelect.classList.add('option');
    colorSelect.classList.add('grow');


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
      if (id === layer.getAttribute('data-layer-id')) {
        layer.classList.add('selected');
      } else {
        layer.classList.remove('selected');
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
    this._backgroundColorSelector.addEventListener('input', () => {
      this.backgroundColor = utils.HTMLtoRGB(this._backgroundColorSelector.value);
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

    Array.prototype.forEach.call(document.getElementsByClassName('layer-selector'), (text) => {
      const id = text.parentNode.getAttribute('data-layer-id');
      if (id === -1) return;
      text.addEventListener('click', () => {
        this.currentLayer = id;
      });
    });
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
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SimpleOekaki;
}

if (window) {
  window.SimpleOekaki = SimpleOekaki;
}
