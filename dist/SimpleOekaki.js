/*!
 * SimpleOekaki.js
 * ----------------
 * Author: Srod Karim (github.com/Sind)
 * Last updated: Sat Oct 14 2017
 */
var SimpleOekaki =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/test";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _iro = __webpack_require__(1);

var _iro2 = _interopRequireDefault(_iro);

var _sortablejs = __webpack_require__(2);

var _sortablejs2 = _interopRequireDefault(_sortablejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// const fs = require('fs');


var SimpleOekakiCanvas = __webpack_require__(3);
var utils = __webpack_require__(8);

var SimpleOekaki = function (_SimpleOekakiCanvas) {
  _inherits(SimpleOekaki, _SimpleOekakiCanvas);

  function SimpleOekaki(div) {
    _classCallCheck(this, SimpleOekaki);

    if (div == null || div.tagName !== 'DIV') {
      throw new Error('You must provide a div as input parameter.');
    }
    // html
    var maindiv = document.createElement('div');
    maindiv.classList.add('SimpleOekaki');
    maindiv.setAttribute('oncontextmenu', 'return false;');
    var optionsholder = document.createElement('div');
    optionsholder.classList.add('optionsholder');
    var canvasholder = document.createElement('div');
    canvasholder.classList.add('canvasholder');
    var toprow = document.createElement('div');
    toprow.classList.add('optionsrow');
    var bottomrow = document.createElement('div');
    bottomrow.classList.add('optionsrow');

    var _this = _possibleConstructorReturn(this, (SimpleOekaki.__proto__ || Object.getPrototypeOf(SimpleOekaki)).call(this, canvasholder));

    _this._incSizeButton = document.createElement('i');
    _this._incSizeButton.classList.add('material-icons');
    _this._incSizeButton.classList.add('option');
    _this._incSizeButton.innerHTML = 'add';

    _this._decSizeButton = document.createElement('i');
    _this._decSizeButton.classList.add('material-icons');
    _this._decSizeButton.classList.add('option');
    _this._decSizeButton.innerHTML = 'remove';

    _this._sizeSlider = document.createElement('input');
    _this._sizeSlider.setAttribute('type', 'range');
    _this._sizeSlider.classList.add('option');
    _this._sizeSlider.step = 2;
    _this._sizeSlider.value = SimpleOekakiCanvas.DEFAULT_BRUSH_SIZE;
    _this._sizeSlider.min = SimpleOekakiCanvas.MIN_BRUSH_SIZE;
    _this._sizeSlider.max = SimpleOekakiCanvas.MAX_BRUSH_SIZE;

    _this._layerMenuOpenButton = document.createElement('i');
    _this._layerMenuOpenButton.classList.add('material-icons');
    _this._layerMenuOpenButton.classList.add('option');
    _this._layerMenuOpenButton.innerHTML = 'layers';

    _this._backgroundColorSelector = document.createElement('input');
    _this._backgroundColorSelector.setAttribute('type', 'color');
    _this._backgroundColorSelector.setAttribute('value', utils.RGBtoHTML(_this.backgroundColor));

    _this._invisibleLayerMenuOverlay = document.createElement('div');
    _this._invisibleLayerMenuOverlay.classList.add('invisible-overlay');
    _this._invisibleLayerMenuOverlay.classList.add('hidden');

    _this._layerMenu = document.createElement('div');
    _this._layerMenu.classList.add('layer-menu');
    _this._layerMenu.classList.add('hidden');

    var layerMenuOptionsHolder = document.createElement('div');
    layerMenuOptionsHolder.classList.add('optionsholder');

    var layerMenuOptionsRow = document.createElement('div');
    layerMenuOptionsRow.classList.add('optionsrow');
    layerMenuOptionsRow.classList.add('reverse');

    _this._layerMenuCloseButton = document.createElement('i');
    _this._layerMenuCloseButton.classList.add('material-icons');
    _this._layerMenuCloseButton.classList.add('option');
    _this._layerMenuCloseButton.innerHTML = 'close';

    _this._layerList = document.createElement('div');
    _this._layerList.classList.add('layer-list');
    _this._layerList.classList.add('list-group');

    _this._layers = [document.createElement('div'), document.createElement('div'), document.createElement('div')];

    _this._layers.forEach(function (layer, index) {
      layer.classList.add('layer');
      layer.classList.add('list-group-item');
      layer.classList.add('optionsholder');
      layer.setAttribute('data-layer-id', 2 - index);
      if (index === 0) layer.classList.add('selected');

      var text = document.createElement('div');
      text.classList.add('optionsrow');
      text.classList.add('layer-selector');

      var label = document.createElement('div');
      label.classList.add('option');
      label.classList.add('label');
      label.innerHTML = 'Layer ' + (3 - index);

      var options = document.createElement('div');
      options.classList.add('optionsrow');

      var visibilityButton = document.createElement('i');
      visibilityButton.classList.add('material-icons');
      visibilityButton.classList.add('option');
      visibilityButton.innerHTML = 'visibility';

      var colorSelect = document.createElement('div');
      colorSelect.classList.add('color-select');
      colorSelect.classList.add('option');
      colorSelect.classList.add('grow');

      text.appendChild(label);
      options.appendChild(visibilityButton);
      options.appendChild(colorSelect);
      layer.appendChild(text);
      layer.appendChild(options);
      _this._layerList.appendChild(layer);
    });

    _sortablejs2.default.create(_this._layerList);

    _this._backgroundLayer = document.createElement('div');
    _this._backgroundLayer.classList.add('layer');
    _this._backgroundLayer.classList.add('optionsholder');
    _this._backgroundLayer.setAttribute('data-layer-id', -1);

    var text = document.createElement('div');
    text.classList.add('optionsrow');
    text.classList.add('layer-selector');

    var label = document.createElement('div');
    label.classList.add('option');
    label.classList.add('label');
    label.innerHTML = 'Background';

    var options = document.createElement('div');
    options.classList.add('optionsrow');

    var colorSelect = document.createElement('div');
    colorSelect.classList.add('color-select');
    colorSelect.classList.add('option');
    colorSelect.classList.add('grow');

    text.appendChild(label);
    _this._backgroundLayer.appendChild(text);
    options.appendChild(colorSelect);
    _this._backgroundLayer.appendChild(options);

    _this._invisibleColorMenuOverlay = document.createElement('div');
    _this._invisibleColorMenuOverlay.classList.add('invisible-overlay');
    _this._invisibleColorMenuOverlay.classList.add('hidden');

    _this._colorMenu = document.createElement('div');
    _this._colorMenu.classList.add('color-menu');
    _this._colorMenu.classList.add('hidden');

    var colorMenuOptionsHolder = document.createElement('div');
    colorMenuOptionsHolder.classList.add('optionsholder');

    var colorMenuOptionsRow = document.createElement('div');
    colorMenuOptionsRow.classList.add('optionsrow');
    colorMenuOptionsRow.classList.add('reverse');

    _this._colorMenuCloseButton = document.createElement('i');
    _this._colorMenuCloseButton.classList.add('material-icons');
    _this._colorMenuCloseButton.classList.add('option');
    _this._colorMenuCloseButton.innerHTML = 'close';

    var colorPickerHolder = document.createElement('div');
    colorPickerHolder.classList.add('color-wheel-holder');
    colorPickerHolder.id = 'color-wheel-holder';

    div.appendChild(maindiv);
    maindiv.appendChild(optionsholder);
    optionsholder.appendChild(toprow);
    optionsholder.appendChild(bottomrow);
    toprow.appendChild(_this._decSizeButton);
    toprow.appendChild(_this._sizeSlider);
    toprow.appendChild(_this._incSizeButton);
    toprow.appendChild(_this._backgroundColorSelector);
    toprow.appendChild(_this._layerMenuOpenButton);
    maindiv.appendChild(canvasholder);

    maindiv.appendChild(_this._invisibleLayerMenuOverlay);
    maindiv.appendChild(_this._layerMenu);
    _this._layerMenu.appendChild(layerMenuOptionsHolder);
    layerMenuOptionsHolder.appendChild(layerMenuOptionsRow);
    layerMenuOptionsRow.appendChild(_this._layerMenuCloseButton);
    _this._layerMenu.appendChild(_this._layerList);
    _this._layerMenu.appendChild(_this._backgroundLayer);

    maindiv.appendChild(_this._invisibleColorMenuOverlay);
    maindiv.append(_this._colorMenu);
    _this._colorMenu.appendChild(colorMenuOptionsHolder);
    colorMenuOptionsHolder.appendChild(colorMenuOptionsRow);
    colorMenuOptionsRow.appendChild(_this._colorMenuCloseButton);
    _this._colorMenu.appendChild(colorPickerHolder);
    _this._colorPicker = new _iro2.default.ColorPicker('#color-wheel-holder');

    _this._setHTMLInputCallbacks();
    return _this;
  }

  _createClass(SimpleOekaki, [{
    key: '_onBrushSizeChange',
    value: function _onBrushSizeChange(brushSize) {
      this._sizeSlider.value = brushSize;
    }
  }, {
    key: '_onCurrentLayerChange',
    value: function _onCurrentLayerChange(id) {
      this._layers.forEach(function (layer) {
        if (id === layer.getAttribute('data-layer-id')) {
          layer.classList.add('selected');
        } else {
          layer.classList.remove('selected');
        }
      });
    }
  }, {
    key: '_setHTMLInputCallbacks',
    value: function _setHTMLInputCallbacks() {
      var _this2 = this;

      this._decSizeButton.addEventListener('click', function () {
        _this2.brushSize -= 2;
      });
      this._incSizeButton.addEventListener('click', function () {
        _this2.brushSize += 2;
      });
      this._sizeSlider.addEventListener('change', function () {
        _this2.brushSize = parseInt(_this2._sizeSlider.value, 10);
      });
      this._backgroundColorSelector.addEventListener('input', function () {
        _this2.backgroundColor = utils.HTMLtoRGB(_this2._backgroundColorSelector.value);
      });
      this._layerMenuOpenButton.addEventListener('click', function () {
        _this2.openLayerMenu();
      });
      this._layerMenuCloseButton.addEventListener('click', function () {
        _this2.closeLayerMenu();
      });
      this._invisibleLayerMenuOverlay.addEventListener('click', function () {
        _this2.closeLayerMenu();
      });
      this._colorMenuCloseButton.addEventListener('click', function () {
        _this2.closeColorMenu();
      });
      this._invisibleColorMenuOverlay.addEventListener('click', function () {
        _this2.closeColorMenu();
      });

      Array.prototype.forEach.call(document.getElementsByClassName('layer-selector'), function (text) {
        var id = text.parentNode.getAttribute('data-layer-id');
        if (id === -1) return;
        text.addEventListener('click', function () {
          _this2.currentLayer = id;
        });
      });
    }
  }, {
    key: 'openLayerMenu',
    value: function openLayerMenu() {
      this._layerMenu.classList.remove('hidden');
      this._invisibleLayerMenuOverlay.classList.remove('hidden');
    }
  }, {
    key: 'closeLayerMenu',
    value: function closeLayerMenu() {
      this._layerMenu.classList.add('hidden');
      this._invisibleLayerMenuOverlay.classList.add('hidden');
    }
  }, {
    key: 'openColorMenu',
    value: function openColorMenu() {
      this._colorMenu.classList.remove('hidden');
      this._invisibleColorMenuOverlay.classList.remove('hidden');
    }
  }, {
    key: 'closeColorMenu',
    value: function closeColorMenu() {
      this._colorMenu.classList.add('hidden');
      this._invisibleColorMenuOverlay.classList.add('hidden');
    }
  }]);

  return SimpleOekaki;
}(SimpleOekakiCanvas);

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SimpleOekaki;
}

if (window) {
  window.SimpleOekaki = SimpleOekaki;
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _colorPicker = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"modules/colorPicker\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

var _colorPicker2 = _interopRequireDefault(_colorPicker);

var _color = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"modules/color\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

var _color2 = _interopRequireDefault(_color);

var _stylesheet = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"modules/stylesheet\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

var _stylesheet2 = _interopRequireDefault(_stylesheet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  Color: _color2.default,
  ColorPicker: _colorPicker2.default,
  Stylesheet: _stylesheet2.default,
  // for backwards compat
  ColorWheel: _colorPicker2.default
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**!
 * Sortable
 * @author	RubaXa   <trash@rubaxa.org>
 * @license MIT
 */

(function sortableModule(factory) {
	"use strict";

	if (true) {
		!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (typeof module != "undefined" && typeof module.exports != "undefined") {
		module.exports = factory();
	} else {
		/* jshint sub:true */
		window["Sortable"] = factory();
	}
})(function sortableFactory() {
	"use strict";

	if (typeof window == "undefined" || !window.document) {
		return function sortableError() {
			throw new Error("Sortable.js requires a window with a document");
		};
	}

	var dragEl,
	    parentEl,
	    ghostEl,
	    cloneEl,
	    rootEl,
	    nextEl,
	    lastDownEl,
	    scrollEl,
	    scrollParentEl,
	    scrollCustomFn,
	    lastEl,
	    lastCSS,
	    lastParentCSS,
	    oldIndex,
	    newIndex,
	    activeGroup,
	    putSortable,
	    autoScroll = {},
	    tapEvt,
	    touchEvt,
	    moved,


	/** @const */
	R_SPACE = /\s+/g,
	    R_FLOAT = /left|right|inline/,
	    expando = 'Sortable' + new Date().getTime(),
	    win = window,
	    document = win.document,
	    parseInt = win.parseInt,
	    $ = win.jQuery || win.Zepto,
	    Polymer = win.Polymer,
	    captureMode = false,
	    supportDraggable = !!('draggable' in document.createElement('div')),
	    supportCssPointerEvents = function (el) {
		// false when IE11
		if (!!navigator.userAgent.match(/Trident.*rv[ :]?11\./)) {
			return false;
		}
		el = document.createElement('x');
		el.style.cssText = 'pointer-events:auto';
		return el.style.pointerEvents === 'auto';
	}(),
	    _silent = false,
	    abs = Math.abs,
	    min = Math.min,
	    savedInputChecked = [],
	    touchDragOverListeners = [],
	    _autoScroll = _throttle(function ( /**Event*/evt, /**Object*/options, /**HTMLElement*/rootEl) {
		// Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=505521
		if (rootEl && options.scroll) {
			var _this = rootEl[expando],
			    el,
			    rect,
			    sens = options.scrollSensitivity,
			    speed = options.scrollSpeed,
			    x = evt.clientX,
			    y = evt.clientY,
			    winWidth = window.innerWidth,
			    winHeight = window.innerHeight,
			    vx,
			    vy,
			    scrollOffsetX,
			    scrollOffsetY;

			// Delect scrollEl
			if (scrollParentEl !== rootEl) {
				scrollEl = options.scroll;
				scrollParentEl = rootEl;
				scrollCustomFn = options.scrollFn;

				if (scrollEl === true) {
					scrollEl = rootEl;

					do {
						if (scrollEl.offsetWidth < scrollEl.scrollWidth || scrollEl.offsetHeight < scrollEl.scrollHeight) {
							break;
						}
						/* jshint boss:true */
					} while (scrollEl = scrollEl.parentNode);
				}
			}

			if (scrollEl) {
				el = scrollEl;
				rect = scrollEl.getBoundingClientRect();
				vx = (abs(rect.right - x) <= sens) - (abs(rect.left - x) <= sens);
				vy = (abs(rect.bottom - y) <= sens) - (abs(rect.top - y) <= sens);
			}

			if (!(vx || vy)) {
				vx = (winWidth - x <= sens) - (x <= sens);
				vy = (winHeight - y <= sens) - (y <= sens);

				/* jshint expr:true */
				(vx || vy) && (el = win);
			}

			if (autoScroll.vx !== vx || autoScroll.vy !== vy || autoScroll.el !== el) {
				autoScroll.el = el;
				autoScroll.vx = vx;
				autoScroll.vy = vy;

				clearInterval(autoScroll.pid);

				if (el) {
					autoScroll.pid = setInterval(function () {
						scrollOffsetY = vy ? vy * speed : 0;
						scrollOffsetX = vx ? vx * speed : 0;

						if ('function' === typeof scrollCustomFn) {
							return scrollCustomFn.call(_this, scrollOffsetX, scrollOffsetY, evt);
						}

						if (el === win) {
							win.scrollTo(win.pageXOffset + scrollOffsetX, win.pageYOffset + scrollOffsetY);
						} else {
							el.scrollTop += scrollOffsetY;
							el.scrollLeft += scrollOffsetX;
						}
					}, 24);
				}
			}
		}
	}, 30),
	    _prepareGroup = function _prepareGroup(options) {
		function toFn(value, pull) {
			if (value === void 0 || value === true) {
				value = group.name;
			}

			if (typeof value === 'function') {
				return value;
			} else {
				return function (to, from) {
					var fromGroup = from.options.group.name;

					return pull ? value : value && (value.join ? value.indexOf(fromGroup) > -1 : fromGroup == value);
				};
			}
		}

		var group = {};
		var originalGroup = options.group;

		if (!originalGroup || (typeof originalGroup === "undefined" ? "undefined" : _typeof(originalGroup)) != 'object') {
			originalGroup = { name: originalGroup };
		}

		group.name = originalGroup.name;
		group.checkPull = toFn(originalGroup.pull, true);
		group.checkPut = toFn(originalGroup.put);
		group.revertClone = originalGroup.revertClone;

		options.group = group;
	};

	/**
  * @class  Sortable
  * @param  {HTMLElement}  el
  * @param  {Object}       [options]
  */
	function Sortable(el, options) {
		if (!(el && el.nodeType && el.nodeType === 1)) {
			throw 'Sortable: `el` must be HTMLElement, and not ' + {}.toString.call(el);
		}

		this.el = el; // root element
		this.options = options = _extend({}, options);

		// Export instance
		el[expando] = this;

		// Default options
		var defaults = {
			group: Math.random(),
			sort: true,
			disabled: false,
			store: null,
			handle: null,
			scroll: true,
			scrollSensitivity: 30,
			scrollSpeed: 10,
			draggable: /[uo]l/i.test(el.nodeName) ? 'li' : '>*',
			ghostClass: 'sortable-ghost',
			chosenClass: 'sortable-chosen',
			dragClass: 'sortable-drag',
			ignore: 'a, img',
			filter: null,
			preventOnFilter: true,
			animation: 0,
			setData: function setData(dataTransfer, dragEl) {
				dataTransfer.setData('Text', dragEl.textContent);
			},
			dropBubble: false,
			dragoverBubble: false,
			dataIdAttr: 'data-id',
			delay: 0,
			forceFallback: false,
			fallbackClass: 'sortable-fallback',
			fallbackOnBody: false,
			fallbackTolerance: 0,
			fallbackOffset: { x: 0, y: 0 }
		};

		// Set default options
		for (var name in defaults) {
			!(name in options) && (options[name] = defaults[name]);
		}

		_prepareGroup(options);

		// Bind all private methods
		for (var fn in this) {
			if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
				this[fn] = this[fn].bind(this);
			}
		}

		// Setup drag mode
		this.nativeDraggable = options.forceFallback ? false : supportDraggable;

		// Bind events
		_on(el, 'mousedown', this._onTapStart);
		_on(el, 'touchstart', this._onTapStart);
		_on(el, 'pointerdown', this._onTapStart);

		if (this.nativeDraggable) {
			_on(el, 'dragover', this);
			_on(el, 'dragenter', this);
		}

		touchDragOverListeners.push(this._onDragOver);

		// Restore sorting
		options.store && this.sort(options.store.get(this));
	}

	Sortable.prototype = /** @lends Sortable.prototype */{
		constructor: Sortable,

		_onTapStart: function _onTapStart( /** Event|TouchEvent */evt) {
			var _this = this,
			    el = this.el,
			    options = this.options,
			    preventOnFilter = options.preventOnFilter,
			    type = evt.type,
			    touch = evt.touches && evt.touches[0],
			    target = (touch || evt).target,
			    originalTarget = evt.target.shadowRoot && evt.path && evt.path[0] || target,
			    filter = options.filter,
			    startIndex;

			_saveInputCheckedState(el);

			// Don't trigger start event when an element is been dragged, otherwise the evt.oldindex always wrong when set option.group.
			if (dragEl) {
				return;
			}

			if (/mousedown|pointerdown/.test(type) && evt.button !== 0 || options.disabled) {
				return; // only left button or enabled
			}

			target = _closest(target, options.draggable, el);

			if (!target) {
				return;
			}

			if (lastDownEl === target) {
				// Ignoring duplicate `down`
				return;
			}

			// Get the index of the dragged element within its parent
			startIndex = _index(target, options.draggable);

			// Check filter
			if (typeof filter === 'function') {
				if (filter.call(this, evt, target, this)) {
					_dispatchEvent(_this, originalTarget, 'filter', target, el, startIndex);
					preventOnFilter && evt.preventDefault();
					return; // cancel dnd
				}
			} else if (filter) {
				filter = filter.split(',').some(function (criteria) {
					criteria = _closest(originalTarget, criteria.trim(), el);

					if (criteria) {
						_dispatchEvent(_this, criteria, 'filter', target, el, startIndex);
						return true;
					}
				});

				if (filter) {
					preventOnFilter && evt.preventDefault();
					return; // cancel dnd
				}
			}

			if (options.handle && !_closest(originalTarget, options.handle, el)) {
				return;
			}

			// Prepare `dragstart`
			this._prepareDragStart(evt, touch, target, startIndex);
		},

		_prepareDragStart: function _prepareDragStart( /** Event */evt, /** Touch */touch, /** HTMLElement */target, /** Number */startIndex) {
			var _this = this,
			    el = _this.el,
			    options = _this.options,
			    ownerDocument = el.ownerDocument,
			    dragStartFn;

			if (target && !dragEl && target.parentNode === el) {
				tapEvt = evt;

				rootEl = el;
				dragEl = target;
				parentEl = dragEl.parentNode;
				nextEl = dragEl.nextSibling;
				lastDownEl = target;
				activeGroup = options.group;
				oldIndex = startIndex;

				this._lastX = (touch || evt).clientX;
				this._lastY = (touch || evt).clientY;

				dragEl.style['will-change'] = 'transform';

				dragStartFn = function dragStartFn() {
					// Delayed drag has been triggered
					// we can re-enable the events: touchmove/mousemove
					_this._disableDelayedDrag();

					// Make the element draggable
					dragEl.draggable = _this.nativeDraggable;

					// Chosen item
					_toggleClass(dragEl, options.chosenClass, true);

					// Bind the events: dragstart/dragend
					_this._triggerDragStart(evt, touch);

					// Drag start event
					_dispatchEvent(_this, rootEl, 'choose', dragEl, rootEl, oldIndex);
				};

				// Disable "draggable"
				options.ignore.split(',').forEach(function (criteria) {
					_find(dragEl, criteria.trim(), _disableDraggable);
				});

				_on(ownerDocument, 'mouseup', _this._onDrop);
				_on(ownerDocument, 'touchend', _this._onDrop);
				_on(ownerDocument, 'touchcancel', _this._onDrop);
				_on(ownerDocument, 'pointercancel', _this._onDrop);
				_on(ownerDocument, 'selectstart', _this);

				if (options.delay) {
					// If the user moves the pointer or let go the click or touch
					// before the delay has been reached:
					// disable the delayed drag
					_on(ownerDocument, 'mouseup', _this._disableDelayedDrag);
					_on(ownerDocument, 'touchend', _this._disableDelayedDrag);
					_on(ownerDocument, 'touchcancel', _this._disableDelayedDrag);
					_on(ownerDocument, 'mousemove', _this._disableDelayedDrag);
					_on(ownerDocument, 'touchmove', _this._disableDelayedDrag);
					_on(ownerDocument, 'pointermove', _this._disableDelayedDrag);

					_this._dragStartTimer = setTimeout(dragStartFn, options.delay);
				} else {
					dragStartFn();
				}
			}
		},

		_disableDelayedDrag: function _disableDelayedDrag() {
			var ownerDocument = this.el.ownerDocument;

			clearTimeout(this._dragStartTimer);
			_off(ownerDocument, 'mouseup', this._disableDelayedDrag);
			_off(ownerDocument, 'touchend', this._disableDelayedDrag);
			_off(ownerDocument, 'touchcancel', this._disableDelayedDrag);
			_off(ownerDocument, 'mousemove', this._disableDelayedDrag);
			_off(ownerDocument, 'touchmove', this._disableDelayedDrag);
			_off(ownerDocument, 'pointermove', this._disableDelayedDrag);
		},

		_triggerDragStart: function _triggerDragStart( /** Event */evt, /** Touch */touch) {
			touch = touch || (evt.pointerType == 'touch' ? evt : null);

			if (touch) {
				// Touch device support
				tapEvt = {
					target: dragEl,
					clientX: touch.clientX,
					clientY: touch.clientY
				};

				this._onDragStart(tapEvt, 'touch');
			} else if (!this.nativeDraggable) {
				this._onDragStart(tapEvt, true);
			} else {
				_on(dragEl, 'dragend', this);
				_on(rootEl, 'dragstart', this._onDragStart);
			}

			try {
				if (document.selection) {
					// Timeout neccessary for IE9
					setTimeout(function () {
						document.selection.empty();
					});
				} else {
					window.getSelection().removeAllRanges();
				}
			} catch (err) {}
		},

		_dragStarted: function _dragStarted() {
			if (rootEl && dragEl) {
				var options = this.options;

				// Apply effect
				_toggleClass(dragEl, options.ghostClass, true);
				_toggleClass(dragEl, options.dragClass, false);

				Sortable.active = this;

				// Drag start event
				_dispatchEvent(this, rootEl, 'start', dragEl, rootEl, oldIndex);
			} else {
				this._nulling();
			}
		},

		_emulateDragOver: function _emulateDragOver() {
			if (touchEvt) {
				if (this._lastX === touchEvt.clientX && this._lastY === touchEvt.clientY) {
					return;
				}

				this._lastX = touchEvt.clientX;
				this._lastY = touchEvt.clientY;

				if (!supportCssPointerEvents) {
					_css(ghostEl, 'display', 'none');
				}

				var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY),
				    parent = target,
				    i = touchDragOverListeners.length;

				if (parent) {
					do {
						if (parent[expando]) {
							while (i--) {
								touchDragOverListeners[i]({
									clientX: touchEvt.clientX,
									clientY: touchEvt.clientY,
									target: target,
									rootEl: parent
								});
							}

							break;
						}

						target = parent; // store last element
					}
					/* jshint boss:true */
					while (parent = parent.parentNode);
				}

				if (!supportCssPointerEvents) {
					_css(ghostEl, 'display', '');
				}
			}
		},

		_onTouchMove: function _onTouchMove( /**TouchEvent*/evt) {
			if (tapEvt) {
				var options = this.options,
				    fallbackTolerance = options.fallbackTolerance,
				    fallbackOffset = options.fallbackOffset,
				    touch = evt.touches ? evt.touches[0] : evt,
				    dx = touch.clientX - tapEvt.clientX + fallbackOffset.x,
				    dy = touch.clientY - tapEvt.clientY + fallbackOffset.y,
				    translate3d = evt.touches ? 'translate3d(' + dx + 'px,' + dy + 'px,0)' : 'translate(' + dx + 'px,' + dy + 'px)';

				// only set the status to dragging, when we are actually dragging
				if (!Sortable.active) {
					if (fallbackTolerance && min(abs(touch.clientX - this._lastX), abs(touch.clientY - this._lastY)) < fallbackTolerance) {
						return;
					}

					this._dragStarted();
				}

				// as well as creating the ghost element on the document body
				this._appendGhost();

				moved = true;
				touchEvt = touch;

				_css(ghostEl, 'webkitTransform', translate3d);
				_css(ghostEl, 'mozTransform', translate3d);
				_css(ghostEl, 'msTransform', translate3d);
				_css(ghostEl, 'transform', translate3d);

				evt.preventDefault();
			}
		},

		_appendGhost: function _appendGhost() {
			if (!ghostEl) {
				var rect = dragEl.getBoundingClientRect(),
				    css = _css(dragEl),
				    options = this.options,
				    ghostRect;

				ghostEl = dragEl.cloneNode(true);

				_toggleClass(ghostEl, options.ghostClass, false);
				_toggleClass(ghostEl, options.fallbackClass, true);
				_toggleClass(ghostEl, options.dragClass, true);

				_css(ghostEl, 'top', rect.top - parseInt(css.marginTop, 10));
				_css(ghostEl, 'left', rect.left - parseInt(css.marginLeft, 10));
				_css(ghostEl, 'width', rect.width);
				_css(ghostEl, 'height', rect.height);
				_css(ghostEl, 'opacity', '0.8');
				_css(ghostEl, 'position', 'fixed');
				_css(ghostEl, 'zIndex', '100000');
				_css(ghostEl, 'pointerEvents', 'none');

				options.fallbackOnBody && document.body.appendChild(ghostEl) || rootEl.appendChild(ghostEl);

				// Fixing dimensions.
				ghostRect = ghostEl.getBoundingClientRect();
				_css(ghostEl, 'width', rect.width * 2 - ghostRect.width);
				_css(ghostEl, 'height', rect.height * 2 - ghostRect.height);
			}
		},

		_onDragStart: function _onDragStart( /**Event*/evt, /**boolean*/useFallback) {
			var dataTransfer = evt.dataTransfer,
			    options = this.options;

			this._offUpEvents();

			if (activeGroup.checkPull(this, this, dragEl, evt)) {
				cloneEl = _clone(dragEl);

				cloneEl.draggable = false;
				cloneEl.style['will-change'] = '';

				_css(cloneEl, 'display', 'none');
				_toggleClass(cloneEl, this.options.chosenClass, false);

				rootEl.insertBefore(cloneEl, dragEl);
				_dispatchEvent(this, rootEl, 'clone', dragEl);
			}

			_toggleClass(dragEl, options.dragClass, true);

			if (useFallback) {
				if (useFallback === 'touch') {
					// Bind touch events
					_on(document, 'touchmove', this._onTouchMove);
					_on(document, 'touchend', this._onDrop);
					_on(document, 'touchcancel', this._onDrop);
					_on(document, 'pointermove', this._onTouchMove);
					_on(document, 'pointerup', this._onDrop);
				} else {
					// Old brwoser
					_on(document, 'mousemove', this._onTouchMove);
					_on(document, 'mouseup', this._onDrop);
				}

				this._loopId = setInterval(this._emulateDragOver, 50);
			} else {
				if (dataTransfer) {
					dataTransfer.effectAllowed = 'move';
					options.setData && options.setData.call(this, dataTransfer, dragEl);
				}

				_on(document, 'drop', this);
				setTimeout(this._dragStarted, 0);
			}
		},

		_onDragOver: function _onDragOver( /**Event*/evt) {
			var el = this.el,
			    target,
			    dragRect,
			    targetRect,
			    revert,
			    options = this.options,
			    group = options.group,
			    activeSortable = Sortable.active,
			    isOwner = activeGroup === group,
			    isMovingBetweenSortable = false,
			    canSort = options.sort;

			if (evt.preventDefault !== void 0) {
				evt.preventDefault();
				!options.dragoverBubble && evt.stopPropagation();
			}

			if (dragEl.animated) {
				return;
			}

			moved = true;

			if (activeSortable && !options.disabled && (isOwner ? canSort || (revert = !rootEl.contains(dragEl)) // Reverting item into the original list
			: putSortable === this || (activeSortable.lastPullMode = activeGroup.checkPull(this, activeSortable, dragEl, evt)) && group.checkPut(this, activeSortable, dragEl, evt)) && (evt.rootEl === void 0 || evt.rootEl === this.el) // touch fallback
			) {
					// Smart auto-scrolling
					_autoScroll(evt, options, this.el);

					if (_silent) {
						return;
					}

					target = _closest(evt.target, options.draggable, el);
					dragRect = dragEl.getBoundingClientRect();

					if (putSortable !== this) {
						putSortable = this;
						isMovingBetweenSortable = true;
					}

					if (revert) {
						_cloneHide(activeSortable, true);
						parentEl = rootEl; // actualization

						if (cloneEl || nextEl) {
							rootEl.insertBefore(dragEl, cloneEl || nextEl);
						} else if (!canSort) {
							rootEl.appendChild(dragEl);
						}

						return;
					}

					if (el.children.length === 0 || el.children[0] === ghostEl || el === evt.target && _ghostIsLast(el, evt)) {
						//assign target only if condition is true
						if (el.children.length !== 0 && el.children[0] !== ghostEl && el === evt.target) {
							target = el.lastElementChild;
						}

						if (target) {
							if (target.animated) {
								return;
							}

							targetRect = target.getBoundingClientRect();
						}

						_cloneHide(activeSortable, isOwner);

						if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt) !== false) {
							if (!dragEl.contains(el)) {
								el.appendChild(dragEl);
								parentEl = el; // actualization
							}

							this._animate(dragRect, dragEl);
							target && this._animate(targetRect, target);
						}
					} else if (target && !target.animated && target !== dragEl && target.parentNode[expando] !== void 0) {
						if (lastEl !== target) {
							lastEl = target;
							lastCSS = _css(target);
							lastParentCSS = _css(target.parentNode);
						}

						targetRect = target.getBoundingClientRect();

						var width = targetRect.right - targetRect.left,
						    height = targetRect.bottom - targetRect.top,
						    floating = R_FLOAT.test(lastCSS.cssFloat + lastCSS.display) || lastParentCSS.display == 'flex' && lastParentCSS['flex-direction'].indexOf('row') === 0,
						    isWide = target.offsetWidth > dragEl.offsetWidth,
						    isLong = target.offsetHeight > dragEl.offsetHeight,
						    halfway = (floating ? (evt.clientX - targetRect.left) / width : (evt.clientY - targetRect.top) / height) > 0.5,
						    nextSibling = target.nextElementSibling,
						    after = false;

						if (floating) {
							var elTop = dragEl.offsetTop,
							    tgTop = target.offsetTop;

							if (elTop === tgTop) {
								after = target.previousElementSibling === dragEl && !isWide || halfway && isWide;
							} else if (target.previousElementSibling === dragEl || dragEl.previousElementSibling === target) {
								after = (evt.clientY - targetRect.top) / height > 0.5;
							} else {
								after = tgTop > elTop;
							}
						} else if (!isMovingBetweenSortable) {
							after = nextSibling !== dragEl && !isLong || halfway && isLong;
						}

						var moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, after);

						if (moveVector !== false) {
							if (moveVector === 1 || moveVector === -1) {
								after = moveVector === 1;
							}

							_silent = true;
							setTimeout(_unsilent, 30);

							_cloneHide(activeSortable, isOwner);

							if (!dragEl.contains(el)) {
								if (after && !nextSibling) {
									el.appendChild(dragEl);
								} else {
									target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
								}
							}

							parentEl = dragEl.parentNode; // actualization

							this._animate(dragRect, dragEl);
							this._animate(targetRect, target);
						}
					}
				}
		},

		_animate: function _animate(prevRect, target) {
			var ms = this.options.animation;

			if (ms) {
				var currentRect = target.getBoundingClientRect();

				if (prevRect.nodeType === 1) {
					prevRect = prevRect.getBoundingClientRect();
				}

				_css(target, 'transition', 'none');
				_css(target, 'transform', 'translate3d(' + (prevRect.left - currentRect.left) + 'px,' + (prevRect.top - currentRect.top) + 'px,0)');

				target.offsetWidth; // repaint

				_css(target, 'transition', 'all ' + ms + 'ms');
				_css(target, 'transform', 'translate3d(0,0,0)');

				clearTimeout(target.animated);
				target.animated = setTimeout(function () {
					_css(target, 'transition', '');
					_css(target, 'transform', '');
					target.animated = false;
				}, ms);
			}
		},

		_offUpEvents: function _offUpEvents() {
			var ownerDocument = this.el.ownerDocument;

			_off(document, 'touchmove', this._onTouchMove);
			_off(document, 'pointermove', this._onTouchMove);
			_off(ownerDocument, 'mouseup', this._onDrop);
			_off(ownerDocument, 'touchend', this._onDrop);
			_off(ownerDocument, 'pointerup', this._onDrop);
			_off(ownerDocument, 'touchcancel', this._onDrop);
			_off(ownerDocument, 'pointercancel', this._onDrop);
			_off(ownerDocument, 'selectstart', this);
		},

		_onDrop: function _onDrop( /**Event*/evt) {
			var el = this.el,
			    options = this.options;

			clearInterval(this._loopId);
			clearInterval(autoScroll.pid);
			clearTimeout(this._dragStartTimer);

			// Unbind events
			_off(document, 'mousemove', this._onTouchMove);

			if (this.nativeDraggable) {
				_off(document, 'drop', this);
				_off(el, 'dragstart', this._onDragStart);
			}

			this._offUpEvents();

			if (evt) {
				if (moved) {
					evt.preventDefault();
					!options.dropBubble && evt.stopPropagation();
				}

				ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild(ghostEl);

				if (rootEl === parentEl || Sortable.active.lastPullMode !== 'clone') {
					// Remove clone
					cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild(cloneEl);
				}

				if (dragEl) {
					if (this.nativeDraggable) {
						_off(dragEl, 'dragend', this);
					}

					_disableDraggable(dragEl);
					dragEl.style['will-change'] = '';

					// Remove class's
					_toggleClass(dragEl, this.options.ghostClass, false);
					_toggleClass(dragEl, this.options.chosenClass, false);

					// Drag stop event
					_dispatchEvent(this, rootEl, 'unchoose', dragEl, rootEl, oldIndex);

					if (rootEl !== parentEl) {
						newIndex = _index(dragEl, options.draggable);

						if (newIndex >= 0) {
							// Add event
							_dispatchEvent(null, parentEl, 'add', dragEl, rootEl, oldIndex, newIndex);

							// Remove event
							_dispatchEvent(this, rootEl, 'remove', dragEl, rootEl, oldIndex, newIndex);

							// drag from one list and drop into another
							_dispatchEvent(null, parentEl, 'sort', dragEl, rootEl, oldIndex, newIndex);
							_dispatchEvent(this, rootEl, 'sort', dragEl, rootEl, oldIndex, newIndex);
						}
					} else {
						if (dragEl.nextSibling !== nextEl) {
							// Get the index of the dragged element within its parent
							newIndex = _index(dragEl, options.draggable);

							if (newIndex >= 0) {
								// drag & drop within the same list
								_dispatchEvent(this, rootEl, 'update', dragEl, rootEl, oldIndex, newIndex);
								_dispatchEvent(this, rootEl, 'sort', dragEl, rootEl, oldIndex, newIndex);
							}
						}
					}

					if (Sortable.active) {
						/* jshint eqnull:true */
						if (newIndex == null || newIndex === -1) {
							newIndex = oldIndex;
						}

						_dispatchEvent(this, rootEl, 'end', dragEl, rootEl, oldIndex, newIndex);

						// Save sorting
						this.save();
					}
				}
			}

			this._nulling();
		},

		_nulling: function _nulling() {
			rootEl = dragEl = parentEl = ghostEl = nextEl = cloneEl = lastDownEl = scrollEl = scrollParentEl = tapEvt = touchEvt = moved = newIndex = lastEl = lastCSS = putSortable = activeGroup = Sortable.active = null;

			savedInputChecked.forEach(function (el) {
				el.checked = true;
			});
			savedInputChecked.length = 0;
		},

		handleEvent: function handleEvent( /**Event*/evt) {
			switch (evt.type) {
				case 'drop':
				case 'dragend':
					this._onDrop(evt);
					break;

				case 'dragover':
				case 'dragenter':
					if (dragEl) {
						this._onDragOver(evt);
						_globalDragOver(evt);
					}
					break;

				case 'selectstart':
					evt.preventDefault();
					break;
			}
		},

		/**
   * Serializes the item into an array of string.
   * @returns {String[]}
   */
		toArray: function toArray() {
			var order = [],
			    el,
			    children = this.el.children,
			    i = 0,
			    n = children.length,
			    options = this.options;

			for (; i < n; i++) {
				el = children[i];
				if (_closest(el, options.draggable, this.el)) {
					order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
				}
			}

			return order;
		},

		/**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
		sort: function sort(order) {
			var items = {},
			    rootEl = this.el;

			this.toArray().forEach(function (id, i) {
				var el = rootEl.children[i];

				if (_closest(el, this.options.draggable, rootEl)) {
					items[id] = el;
				}
			}, this);

			order.forEach(function (id) {
				if (items[id]) {
					rootEl.removeChild(items[id]);
					rootEl.appendChild(items[id]);
				}
			});
		},

		/**
   * Save the current sorting
   */
		save: function save() {
			var store = this.options.store;
			store && store.set(this);
		},

		/**
   * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
   * @param   {HTMLElement}  el
   * @param   {String}       [selector]  default: `options.draggable`
   * @returns {HTMLElement|null}
   */
		closest: function closest(el, selector) {
			return _closest(el, selector || this.options.draggable, this.el);
		},

		/**
   * Set/get option
   * @param   {string} name
   * @param   {*}      [value]
   * @returns {*}
   */
		option: function option(name, value) {
			var options = this.options;

			if (value === void 0) {
				return options[name];
			} else {
				options[name] = value;

				if (name === 'group') {
					_prepareGroup(options);
				}
			}
		},

		/**
   * Destroy
   */
		destroy: function destroy() {
			var el = this.el;

			el[expando] = null;

			_off(el, 'mousedown', this._onTapStart);
			_off(el, 'touchstart', this._onTapStart);
			_off(el, 'pointerdown', this._onTapStart);

			if (this.nativeDraggable) {
				_off(el, 'dragover', this);
				_off(el, 'dragenter', this);
			}

			// Remove draggable attributes
			Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function (el) {
				el.removeAttribute('draggable');
			});

			touchDragOverListeners.splice(touchDragOverListeners.indexOf(this._onDragOver), 1);

			this._onDrop();

			this.el = el = null;
		}
	};

	function _cloneHide(sortable, state) {
		if (sortable.lastPullMode !== 'clone') {
			state = true;
		}

		if (cloneEl && cloneEl.state !== state) {
			_css(cloneEl, 'display', state ? 'none' : '');

			if (!state) {
				if (cloneEl.state) {
					if (sortable.options.group.revertClone) {
						rootEl.insertBefore(cloneEl, nextEl);
						sortable._animate(dragEl, cloneEl);
					} else {
						rootEl.insertBefore(cloneEl, dragEl);
					}
				}
			}

			cloneEl.state = state;
		}
	}

	function _closest( /**HTMLElement*/el, /**String*/selector, /**HTMLElement*/ctx) {
		if (el) {
			ctx = ctx || document;

			do {
				if (selector === '>*' && el.parentNode === ctx || _matches(el, selector)) {
					return el;
				}
				/* jshint boss:true */
			} while (el = _getParentOrHost(el));
		}

		return null;
	}

	function _getParentOrHost(el) {
		var parent = el.host;

		return parent && parent.nodeType ? parent : el.parentNode;
	}

	function _globalDragOver( /**Event*/evt) {
		if (evt.dataTransfer) {
			evt.dataTransfer.dropEffect = 'move';
		}
		evt.preventDefault();
	}

	function _on(el, event, fn) {
		el.addEventListener(event, fn, captureMode);
	}

	function _off(el, event, fn) {
		el.removeEventListener(event, fn, captureMode);
	}

	function _toggleClass(el, name, state) {
		if (el) {
			if (el.classList) {
				el.classList[state ? 'add' : 'remove'](name);
			} else {
				var className = (' ' + el.className + ' ').replace(R_SPACE, ' ').replace(' ' + name + ' ', ' ');
				el.className = (className + (state ? ' ' + name : '')).replace(R_SPACE, ' ');
			}
		}
	}

	function _css(el, prop, val) {
		var style = el && el.style;

		if (style) {
			if (val === void 0) {
				if (document.defaultView && document.defaultView.getComputedStyle) {
					val = document.defaultView.getComputedStyle(el, '');
				} else if (el.currentStyle) {
					val = el.currentStyle;
				}

				return prop === void 0 ? val : val[prop];
			} else {
				if (!(prop in style)) {
					prop = '-webkit-' + prop;
				}

				style[prop] = val + (typeof val === 'string' ? '' : 'px');
			}
		}
	}

	function _find(ctx, tagName, iterator) {
		if (ctx) {
			var list = ctx.getElementsByTagName(tagName),
			    i = 0,
			    n = list.length;

			if (iterator) {
				for (; i < n; i++) {
					iterator(list[i], i);
				}
			}

			return list;
		}

		return [];
	}

	function _dispatchEvent(sortable, rootEl, name, targetEl, fromEl, startIndex, newIndex) {
		sortable = sortable || rootEl[expando];

		var evt = document.createEvent('Event'),
		    options = sortable.options,
		    onName = 'on' + name.charAt(0).toUpperCase() + name.substr(1);

		evt.initEvent(name, true, true);

		evt.to = rootEl;
		evt.from = fromEl || rootEl;
		evt.item = targetEl || rootEl;
		evt.clone = cloneEl;

		evt.oldIndex = startIndex;
		evt.newIndex = newIndex;

		rootEl.dispatchEvent(evt);

		if (options[onName]) {
			options[onName].call(sortable, evt);
		}
	}

	function _onMove(fromEl, toEl, dragEl, dragRect, targetEl, targetRect, originalEvt, willInsertAfter) {
		var evt,
		    sortable = fromEl[expando],
		    onMoveFn = sortable.options.onMove,
		    retVal;

		evt = document.createEvent('Event');
		evt.initEvent('move', true, true);

		evt.to = toEl;
		evt.from = fromEl;
		evt.dragged = dragEl;
		evt.draggedRect = dragRect;
		evt.related = targetEl || toEl;
		evt.relatedRect = targetRect || toEl.getBoundingClientRect();
		evt.willInsertAfter = willInsertAfter;

		fromEl.dispatchEvent(evt);

		if (onMoveFn) {
			retVal = onMoveFn.call(sortable, evt, originalEvt);
		}

		return retVal;
	}

	function _disableDraggable(el) {
		el.draggable = false;
	}

	function _unsilent() {
		_silent = false;
	}

	/** @returns {HTMLElement|false} */
	function _ghostIsLast(el, evt) {
		var lastEl = el.lastElementChild,
		    rect = lastEl.getBoundingClientRect();

		// 5 — min delta
		// abs — нельзя добавлять, а то глюки при наведении сверху
		return evt.clientY - (rect.top + rect.height) > 5 || evt.clientX - (rect.left + rect.width) > 5;
	}

	/**
  * Generate id
  * @param   {HTMLElement} el
  * @returns {String}
  * @private
  */
	function _generateId(el) {
		var str = el.tagName + el.className + el.src + el.href + el.textContent,
		    i = str.length,
		    sum = 0;

		while (i--) {
			sum += str.charCodeAt(i);
		}

		return sum.toString(36);
	}

	/**
  * Returns the index of an element within its parent for a selected set of
  * elements
  * @param  {HTMLElement} el
  * @param  {selector} selector
  * @return {number}
  */
	function _index(el, selector) {
		var index = 0;

		if (!el || !el.parentNode) {
			return -1;
		}

		while (el && (el = el.previousElementSibling)) {
			if (el.nodeName.toUpperCase() !== 'TEMPLATE' && (selector === '>*' || _matches(el, selector))) {
				index++;
			}
		}

		return index;
	}

	function _matches( /**HTMLElement*/el, /**String*/selector) {
		if (el) {
			selector = selector.split('.');

			var tag = selector.shift().toUpperCase(),
			    re = new RegExp('\\s(' + selector.join('|') + ')(?=\\s)', 'g');

			return (tag === '' || el.nodeName.toUpperCase() == tag) && (!selector.length || ((' ' + el.className + ' ').match(re) || []).length == selector.length);
		}

		return false;
	}

	function _throttle(callback, ms) {
		var args, _this;

		return function () {
			if (args === void 0) {
				args = arguments;
				_this = this;

				setTimeout(function () {
					if (args.length === 1) {
						callback.call(_this, args[0]);
					} else {
						callback.apply(_this, args);
					}

					args = void 0;
				}, ms);
			}
		};
	}

	function _extend(dst, src) {
		if (dst && src) {
			for (var key in src) {
				if (src.hasOwnProperty(key)) {
					dst[key] = src[key];
				}
			}
		}

		return dst;
	}

	function _clone(el) {
		return $ ? $(el).clone(true)[0] : Polymer && Polymer.dom ? Polymer.dom(el).cloneNode(true) : el.cloneNode(true);
	}

	function _saveInputCheckedState(root) {
		var inputs = root.getElementsByTagName('input');
		var idx = inputs.length;

		while (idx--) {
			var el = inputs[idx];
			el.checked && savedInputChecked.push(el);
		}
	}

	// Fixed #973: 
	_on(document, 'touchmove', function (evt) {
		if (Sortable.active) {
			evt.preventDefault();
		}
	});

	try {
		window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
			get: function get() {
				captureMode = {
					capture: false,
					passive: false
				};
			}
		}));
	} catch (err) {}

	// Export utils
	Sortable.utils = {
		on: _on,
		off: _off,
		css: _css,
		find: _find,
		is: function is(el, selector) {
			return !!_closest(el, selector, el);
		},
		extend: _extend,
		throttle: _throttle,
		closest: _closest,
		toggleClass: _toggleClass,
		clone: _clone,
		index: _index
	};

	/**
  * Create sortable instance
  * @param {HTMLElement}  el
  * @param {Object}      [options]
  */
	Sortable.create = function (el, options) {
		return new Sortable(el, options);
	};

	// Export
	Sortable.version = '1.6.1';
	return Sortable;
});

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _canvas = __webpack_require__(4);

var _canvas2 = _interopRequireDefault(_canvas);

var _canvas3 = __webpack_require__(5);

var _canvas4 = _interopRequireDefault(_canvas3);

var _layer = __webpack_require__(6);

var _layer2 = _interopRequireDefault(_layer);

var _layer3 = __webpack_require__(7);

var _layer4 = _interopRequireDefault(_layer3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VERSION = '0.2.1';
var MIN_BRUSH_SIZE = 1;
var MAX_BRUSH_SIZE = 31;
var DEFAULT_BRUSH_SIZE = 1;

var DEFAULT_BACKGROUND_COLOR = [1, 1, 1];
var DEFAULT_LAYER_COLOR = [0, 0, 0];

var SimpleOekakiCanvas = function () {
  _createClass(SimpleOekakiCanvas, null, [{
    key: 'VERSION',

    // Constants
    get: function get() {
      return VERSION;
    }
  }, {
    key: 'MIN_BRUSH_SIZE',
    get: function get() {
      return MIN_BRUSH_SIZE;
    }
  }, {
    key: 'MAX_BRUSH_SIZE',
    get: function get() {
      return MAX_BRUSH_SIZE;
    }
  }, {
    key: 'DEFAULT_BRUSH_SIZE',
    get: function get() {
      return DEFAULT_BRUSH_SIZE;
    }
  }, {
    key: 'DEFAULT_BACKGROUND_COLOR',
    get: function get() {
      return DEFAULT_BACKGROUND_COLOR;
    }
  }, {
    key: 'DEFAULT_LAYER_COLOR',
    get: function get() {
      return DEFAULT_LAYER_COLOR;
    }
  }]);

  function SimpleOekakiCanvas(div) {
    _classCallCheck(this, SimpleOekakiCanvas);

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

  _createClass(SimpleOekakiCanvas, [{
    key: 'getLayerColor',
    value: function getLayerColor(id) {
      return this._layerColors[id];
    }
  }, {
    key: 'setLayerColor',
    value: function setLayerColor(id, colors) {
      this._layerColors[id] = colors;
      if (this._onLayerColorChange) this._onLayerColorChange(id, colors);
    }
  }, {
    key: 'paintLine',
    value: function paintLine(x0, y0, x1, y1) {
      this._gl.useProgram(this._layerShaderProgram);
      this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._canvasFBO);
      this._gl.uniform4f(this._fragmentLineUniform, Math.round(x0) + 0.5, 800 - Math.round(y0) + 0.5, Math.round(x1) + 0.5, 800 - Math.round(y1) + 0.5);
      this._gl.uniform1f(this._fragmentSizeUniform, this._diameter);
      this._gl.drawArrays(this._gl.TRIANGLE_STRIP, 0, 4);
    }
  }, {
    key: 'paintGL',
    value: function paintGL() {
      this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
      this._gl.useProgram(this._canvasShaderProgram);
      this._gl.clearColor(this._backgroundColor[0], this._backgroundColor[1], this._backgroundColor[2], 1.0);
      this._gl.clear(this._gl.COLOR_BUFFER_BIT);
      this._gl.uniform3fv(this._fragmentBackgroundColorUniform, this._backgroundColor);
      this._gl.uniform3iv(this._fragmentLayerOrderUniform, this._layerOrder);
      this._gl.uniform3fv(this._fragmentLayerVisibilityUniform, this._layerVisibility);
      this._gl.uniformMatrix3fv(this._fragmentLayerColorsUniform, false, this._layerColors[0].concat(this._layerColors[1], this._layerColors[2]));
      this._gl.drawArrays(this._gl.TRIANGLE_STRIP, 0, 4);
    }
  }, {
    key: '_getShader',
    value: function _getShader(str, type) {
      var shader = this._gl.createShader(type);
      this._gl.shaderSource(shader, str);
      this._gl.compileShader(shader);
      if (!this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS)) {
        console.log('JS:Shader compile failed');
        console.log(this._gl.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    }
  }, {
    key: '_initBuffers',
    value: function _initBuffers() {
      var canvasBuffer = this._gl.createBuffer();
      this._gl.bindBuffer(this._gl.ARRAY_BUFFER, canvasBuffer);
      this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), this._gl.STATIC_DRAW);
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
      this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, this._canvasFBO.width, this._canvasFBO.height, 0, this._gl.RGBA, this._gl.UNSIGNED_BYTE, null);
      this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, this._gl.COLOR_ATTACHMENT0, this._gl.TEXTURE_2D, this._canvasTexture, 0);

      this._gl.clearColor(0, 0, 0, 1);
      this._gl.clear(this._gl.COLOR_BUFFER_BIT);

      this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
    }
  }, {
    key: '_initShaderProgram',
    value: function _initShaderProgram(fsh, vsh) {
      var vertexShader = this._getShader(vsh, this._gl.VERTEX_SHADER);
      var fragmentShader = this._getShader(fsh, this._gl.FRAGMENT_SHADER);
      var shaderProgram = this._gl.createProgram();
      this._gl.attachShader(shaderProgram, vertexShader);
      this._gl.attachShader(shaderProgram, fragmentShader);
      this._gl.linkProgram(shaderProgram);
      if (!this._gl.getProgramParameter(shaderProgram, this._gl.LINK_STATUS)) {
        console.log('Could not initialise shaders');
        console.log(this._gl.getProgramInfoLog(shaderProgram));
      }
      this._gl.useProgram(shaderProgram);
      var VertexPositionAttribute = this._gl.getAttribLocation(shaderProgram, 'position');
      this._gl.enableVertexAttribArray(VertexPositionAttribute);
      return shaderProgram;
    }
  }, {
    key: '_initShaders',
    value: function _initShaders() {
      this._canvasShaderProgram = this._initShaderProgram(_canvas4.default, _canvas2.default);
      this._fragmentBackgroundColorUniform = this._gl.getUniformLocation(this._canvasShaderProgram, 'backgroundColor');
      this._fragmentLayerOrderUniform = this._gl.getUniformLocation(this._canvasShaderProgram, 'layerOrder');
      this._fragmentLayerColorsUniform = this._gl.getUniformLocation(this._canvasShaderProgram, 'layerColors');
      this._fragmentLayerVisibilityUniform = this._gl.getUniformLocation(this._canvasShaderProgram, 'layerVisibility');

      this._layerShaderProgram = this._initShaderProgram(_layer4.default, _layer2.default);
      this._fragmentLineUniform = this._gl.getUniformLocation(this._layerShaderProgram, 'line');
      this._fragmentSizeUniform = this._gl.getUniformLocation(this._layerShaderProgram, 'size');
    }
  }, {
    key: '_setInputCallbacks',
    value: function _setInputCallbacks() {
      var _this = this;

      var isDown = void 0;
      var currentMousePos = void 0;
      var getMouse = function getMouse(e) {
        var bbox = _this._canvas.getBoundingClientRect();
        var mx = e.clientX - bbox.left * (_this._canvas.width / bbox.width);
        var my = e.clientY - bbox.top * (_this._canvas.height / bbox.height);
        return { x: mx, y: my };
      };

      this._canvas.addEventListener('mousedown', function (startEvent) {
        currentMousePos = getMouse(startEvent);
        _this.paintLine(currentMousePos.x, currentMousePos.y, currentMousePos.x, currentMousePos.y);
        isDown = true;
      });

      document.addEventListener('mouseup', function () {
        isDown = false;
      });
      document.addEventListener('mousemove', function (moveEvent) {
        if (!isDown) return;
        var nextPos = getMouse(moveEvent);
        _this.paintLine(currentMousePos.x, currentMousePos.y, nextPos.x, nextPos.y);
        currentMousePos = nextPos;
        moveEvent.preventDefault();
      });

      this._canvas.addEventListener('touchstart', function (startEvent) {
        currentMousePos = getMouse(startEvent.targetTouches[0]);
        _this.paintLine(currentMousePos.x, currentMousePos.y, currentMousePos.x, currentMousePos.y);
        isDown = true;
      });
      document.addEventListener('touchend', function () {
        isDown = false;
      });
      this._canvas.addEventListener('touchmove', function (moveEvent) {
        if (!isDown) return;
        moveEvent.preventDefault();

        var nextPos = getMouse(moveEvent.targetTouches[0]);

        _this.paintLine(currentMousePos.x, currentMousePos.y, nextPos.x, nextPos.y);
        currentMousePos = nextPos;
        moveEvent.stopPropagation();
        moveEvent.cancelBubble = true;
      });
    }
  }, {
    key: '_initializeGL',
    value: function _initializeGL() {
      this._gl = this._canvas.getContext('webgl') || this._canvas.getContext('experimental-webgl');
      this._gl.clearColor(0.0, 0.0, 0.0, 1.0);

      this._gl.viewport(0, 0, this._canvas.width, this._canvas.height);

      // Initialize the shader program
      this._initShaders();
      this._initBuffers();
      var self = this;
      setInterval(function () {
        self.paintGL();
      }, 15);
    }
  }, {
    key: 'backgroundColor',
    get: function get() {
      return this._backgroundColor;
    },
    set: function set(colorArray) {
      this._backgroundColor = colorArray;
      console.log('backgroundColor set:', this.backgroundColor);
    }
  }, {
    key: 'currentLayer',
    get: function get() {
      return this._currentLayer;
    },
    set: function set(id) {
      if (id === this._currentLayer) return;
      if (id >= 0 && id < 3) {
        this._currentLayer = id;
        if (this._onCurrentLayerChange) this._onCurrentLayerChange(id);
      }
    }
  }, {
    key: 'brushSize',
    get: function get() {
      return this._diameter;
    },
    set: function set(size) {
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
  }]);

  return SimpleOekakiCanvas;
}();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SimpleOekakiCanvas;
}

if (window) {
  window.SimpleOekakiCanvas = SimpleOekakiCanvas;
}

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = "attribute vec2 position;\nvarying vec2 Texcoord;\nvoid main(void) {\n  Texcoord = (position+1.0) / 2.0;\n  gl_Position = vec4(position, 0.0, 1.0);\n}"

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = "precision mediump float;\n\nvarying vec2 Texcoord;\nuniform vec3 backgroundColor;\nuniform sampler2D imageTex;\n\nuniform ivec3 layerOrder;\nuniform vec3 layerVisibility;\nuniform mat3 layerColors;\n\nvoid main(void){\n  vec4 texColor = texture2D(imageTex,Texcoord);\n\n  vec3 outputColor = backgroundColor;\n\n  for(int i = 0; i < 3; i++){\n    int currentLayer = layerOrder[i];\n\n  if(currentLayer == 0){\n      vec3 currentColor = layerColors[0];\n      float currentSet = texColor[0];\n      currentSet = currentSet * layerVisibility[0];\n      outputColor = currentSet * currentColor + outputColor * (1.0-currentSet); \n    } else if(currentLayer == 1){\n      vec3 currentColor = layerColors[1];\n      float currentSet = texColor[1];\n      currentSet = currentSet * layerVisibility[1];\n      outputColor = currentSet * currentColor + outputColor * (1.0-currentSet);\n    } else {\n      vec3 currentColor = layerColors[2];\n      float currentSet = texColor[2];\n      currentSet = currentSet * layerVisibility[2];\n      outputColor = currentSet * currentColor + outputColor * (1.0-currentSet);\n    }\n  }\n  gl_FragColor = vec4(outputColor,1.0);\n}"

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = "attribute vec2 position;\nvoid main(void) {\n  gl_Position = vec4(position, 0.0, 1.0);\n}"

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = "precision mediump float;\n\nuniform vec4 line;\nuniform float size;\n\nvoid main(void){\n  float x = gl_FragCoord.x;\n  float y = gl_FragCoord.y;\n  \n  float x1 = line[0];\n  float y1 = line[1];\n  float x2 = line[2];\n  float y2 = line[3];\n\n  float A = x - x1;\n  float B = y - y1;\n  float C = x2 - x1;\n  float D = y2 - y1;\n  \n  float dot = A * C + B * D;\n  float len_sq = C * C + D * D;\n  float param = -1.0;\n  if (len_sq != 0.0) //in case of 0 length line\n      param = dot / len_sq;\n  \n  float xx, yy;\n  \n  if (param < 0.0){\n    xx = x1;\n    yy = y1;\n  } else if(param > 1.0){\n    xx = x2;\n    yy = y2;\n  } else if(abs(C) > abs(D)){\n    xx = floor(x1 + param * C) + 0.5;\n    yy = floor(y1 + (xx - x1) / C * D) + 0.5;\n  }else{\n    yy = floor(y1 + param * D) + 0.5;\n    xx = floor(x1 + (yy - y1) / D * C) +0.5;\n  }\n  float d = distance(vec2(x,y),vec2(xx,yy));\n\n  if(d > size/2.0) discard;\n\n  gl_FragColor = vec4(1.0,1.0,1.0,1.0);\n}"

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var DECtoHEX = function DECtoHEX(c) {
  var hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
};

var HTMLtoRGB = function HTMLtoRGB(htmlcolor) {
  return htmlcolor.match(/[A-Za-z0-9]{2}/g).map(function (v) {
    return parseInt(v, 16) / 255;
  });
};

var RGBtoHTML = function RGBtoHTML(rgbcolor) {
  return "#" + DECtoHEX(rgbcolor[0] * 255) + DECtoHEX(rgbcolor[1] * 255) + DECtoHEX(rgbcolor[2] * 255);
};

module.exports = {
  DECtoHEX: DECtoHEX,
  HTMLtoRGB: HTMLtoRGB,
  RGBtoHTML: RGBtoHTML
};

/***/ })
/******/ ]);
//# sourceMappingURL=SimpleOekaki.js.map