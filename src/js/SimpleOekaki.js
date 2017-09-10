

// const fs = require('fs');
// const iro = require('iro');
const SOcanvas = require('./SimpleOekakiCanvas.js');
const utils = require('./utils.js');

const VERSION = '0.2.0';

const SimpleOekaki = (div) => {
  if (div == null || div.tagName !== 'DIV') {
    throw 'You must provide a div as input parameter.';
  }
  const instance = {};
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
  const incSizeButton = document.createElement('button');
  const decSizeButton = document.createElement('button');
  incSizeButton.innerHTML = 'increase brush';
  decSizeButton.innerHTML = 'decrease brush';
  const sizeSlider = document.createElement('input');
  sizeSlider.setAttribute('type', 'range');
  sizeSlider.step = 2;
  const backgroundColorSelector = document.createElement('input');
  backgroundColorSelector.setAttribute('type', 'color');
  const canvas = SOcanvas(
    canvasholder,
    { onBrushSizeChange: (brushSize) => { sizeSlider.value = brushSize; } },
  );
  sizeSlider.value = canvas.DEFAULT_BRUSH_SIZE();
  sizeSlider.min = canvas.MIN_BRUSH_SIZE();
  sizeSlider.max = canvas.MAX_BRUSH_SIZE();
  backgroundColorSelector.setAttribute('value', utils.RGBtoHTML(canvas.backgroundColor));

  div.appendChild(maindiv);
  maindiv.appendChild(optionsholder);
  optionsholder.appendChild(toprow);
  optionsholder.appendChild(bottomrow);
  toprow.appendChild(decSizeButton);
  toprow.appendChild(sizeSlider);
  toprow.appendChild(incSizeButton);
  toprow.appendChild(backgroundColorSelector);
  maindiv.appendChild(canvasholder);

  instance.version = () => VERSION;


  const setInputCallbacks = () => {
    decSizeButton.addEventListener('click', () => {
      canvas.decBrushSize();
    });
    incSizeButton.addEventListener('click', () => {
      canvas.incBrushSize();
    });
    sizeSlider.addEventListener('change', () => {
      canvas.setBrushSize(parseInt(sizeSlider.value));
    });

    backgroundColorSelector.addEventListener('input', () => {
      canvas.setBackgroundColor(utils.HTMLtoRGB(backgroundColorSelector.value));
    });
  };
  setInputCallbacks();
  return instance;
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SimpleOekaki;
}

if (window) {
  window.SimpleOekaki = SimpleOekaki;
}
