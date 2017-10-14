

// const fs = require('fs');
// const iro = require('iro');
const SimpleOekakiCanvas = require('./SimpleOekakiCanvas.js');
const utils = require('./utils.js');


class SimpleOekaki extends SimpleOekakiCanvas {
  constructor(div) {
    if (div == null || div.tagName !== 'DIV') {
      throw new Error('You must provide a div as input parameter.');
    }
    // html
    const maindiv = document.createElement('div');
    maindiv.classList.add('SimpleOekaki');
    const optionsholder = document.createElement('div');
    optionsholder.classList.add('optionsholder');
    const canvasholder = document.createElement('div');
    canvasholder.classList.add('canvasholder');
    const toprow = document.createElement('div');
    toprow.classList.add('optionsrow');
    const bottomrow = document.createElement('div');
    bottomrow.classList.add('optionsrow');
    super(canvasholder);

    this._incSizeButton = document.createElement('i');
    this._incSizeButton.classList.add('material-icons');
    this._incSizeButton.classList.add('md-light');
    this._incSizeButton.innerHTML = 'add_circle_outline';
    this._decSizeButton = document.createElement('i');
    this._decSizeButton.classList.add('material-icons');
    this._decSizeButton.classList.add('md-light');
    this._decSizeButton.innerHTML = 'remove_circle_outline';

    this._sizeSlider = document.createElement('input');
    this._sizeSlider.setAttribute('type', 'range');
    this._sizeSlider.step = 2;
    this._backgroundColorSelector = document.createElement('input');
    this._backgroundColorSelector.setAttribute('type', 'color');
    this._sizeSlider.value = SimpleOekakiCanvas.DEFAULT_BRUSH_SIZE;
    this._sizeSlider.min = SimpleOekakiCanvas.MIN_BRUSH_SIZE;
    this._sizeSlider.max = SimpleOekakiCanvas.MAX_BRUSH_SIZE;
    this._backgroundColorSelector.setAttribute('value', utils.RGBtoHTML(this.backgroundColor));

    div.appendChild(maindiv);
    maindiv.appendChild(optionsholder);
    optionsholder.appendChild(toprow);
    optionsholder.appendChild(bottomrow);
    toprow.appendChild(this._decSizeButton);
    toprow.appendChild(this._sizeSlider);
    toprow.appendChild(this._incSizeButton);
    toprow.appendChild(this._backgroundColorSelector);
    maindiv.appendChild(canvasholder);

    this.setHTMLInputCallbacks();
  }

  setHTMLInputCallbacks() {
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
  }

  onBrushSizeChange(brushSize) {
    this._sizeSlider.value = brushSize;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SimpleOekaki;
}

if (window) {
  window.SimpleOekaki = SimpleOekaki;
}
