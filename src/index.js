import './style.css';
import { $, getElementInfo, isDOM } from './dom.js';
import { throttle } from './utils.js';
import logger from './logger.js';

class DomInspector {
	constructor(options = {}) {
		this._doc = window.document;
		this.root = options.root ? (isDOM(options.root) ? options.root : $(options.root)) : $('body');
		this.theme = options.theme || 'dom-inspector-theme-default';
		this.overlay = '';
		this.overlayId = '';
		this._throttleOnMove = throttle(this._onMove.bind(this), 100);
		this.destroyed = false;
		this._init();
	}
	enable() {
		if (this.destroyed) return logger.warn('Inspector instance has been destroyed! Please redeclare it.');
		this.overlay.style.display = 'block';
		this.root.addEventListener('mousemove', this._throttleOnMove);
	}
	disable() {
		this.overlay.style.display = 'none';
		this.overlay.style.width = 0;
		this.overlay.style.height = 0;
		this.root.removeEventListener('mousemove', this._throttleOnMove);
	}
	destroy() {
		this.destroyed = true;
		this.disable();
		this.overlay.remove();
	}
	getXPath(ele) {

	}
	getCssPath(ele) {

	}
	getSelector(ele) {

	}
	_init() {
		this.overlayId = `dom-inspector-${Date.now()}`;
		this.overlay = this._createElement('div', {
			id: this.overlayId,
			class: `dom-inspector ${this.theme}`
		});
		$('body').appendChild(this.overlay);
	}
	_createElement(tag, attr) {
		const ele = this._doc.createElement(tag);
		Object.keys(attr).forEach(item => {
			ele.setAttribute(item, attr[item]);
		});
		return ele;
	}
	_onMove(e) {
		this.target = e.target;
		const elementInfo = getElementInfo(e.target);
		// console.log(e.target, elementInfo);
		Object.keys(elementInfo).forEach(item => {
			if (item === 'z-index' && this.overlay.style['z-index'] <= elementInfo[item]) {
				return (this.overlay.style[item] = elementInfo[item] + 1);
			}
			this.overlay.style[item] = `${elementInfo[item]}px`;
		});
	}
}

export default DomInspector;
