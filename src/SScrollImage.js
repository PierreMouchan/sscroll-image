/**
 * INSPIRED BY THIS CODROPS ARTICLE
 * https://tympanus.net/codrops/2019/07/23/smooth-scrolling-image-effects/
 * ALL RIGHTS GOES TO THEM
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2019, Codrops
 * http://www.codrops.com
 */

// helper functions
const MathUtils = {
	// map number x from range [a, b] to [c, d]
	map: (x, a, b, c, d) => ((x - a) * (d - c)) / (b - a) + c,
	// linear interpolation
	lerp: (a, b, n) => (1 - n) * a + n * b
};

// calculate the viewport size
let winsize;
const CALC_WIN_SIZE = () => (winsize = { width: window.innerWidth, height: window.innerHeight });

// scroll position and update function
let docScroll;
const GET_PAGEY_SCROLL = () => (docScroll = window.pageYOffset || document.documentElement.scrollTop);

export class SScrollImage {
	constructor(container) {
		this.container = container || '[data-img-scroll]';
		this.items = [];
	}
	initEvents() {
		// Init events to calcul height to scroll and window size;
		CALC_WIN_SIZE();
		GET_PAGEY_SCROLL();
		window.addEventListener('resize', CALC_WIN_SIZE);
		window.addEventListener('scroll', GET_PAGEY_SCROLL);
		// init resize foreach item attach to the window
		for (const item of this.items) {
			window.addEventListener('resize', item.resize());
		}
	}
	destroyEvents() {
		// destroy events
		window.removeEventListener('resize', CALC_WIN_SIZE);
		window.removeEventListener('scroll', GET_PAGEY_SCROLL);

		// destroy resize foreach item attach to the window
		for (const item of this.items) {
			window.removeEventListener('resize', item.resize());
		}
	}
	init() {
		// init Events
		this.initEvents();
		// select all
		document.querySelectorAll(this.container).forEach(item => this.items.push(new Item(item)));
		this.render();
	}
	render() {
		// for every item
		for (const item of this.items) {
			// if the item is inside the viewport call it's render function
			// this will update the item's inner image translation, based on the document scroll value and the item's position on the viewport
			if (item.isVisible) {
				item.render();
			}
		}
		requestAnimationFrame(() => this.render());
	}
	destroy() {
		this.destroyEvents();
	}
}

// Item
class Item {
	constructor(el) {
		// the container element
		this.el = el;
		// the inner image ( DIRECT CHILDREN )
		this.image = this.el.children[0];
		this.renderedStyles = {
			// here we define which property will change as we scroll the page and the items is inside the viewport
			// in this case we will be translating the image on the y-axis
			// we interpolate between the previous and current value to achieve a smooth effect
			innerTranslationY: {
				// interpolated value
				previous: 0,
				// current value
				current: 0,
				// amount to interpolate
				ease: 0.1,
				// the maximum value to translate the image is set in a CSS variable (--overflow)
				maxValue: parseInt(getComputedStyle(this.image).getPropertyValue('--overflow')),
				// current value setter
				// the value of the translation will be:
				// when the item's top value (relative to the viewport) equals the window's height (items just came into the viewport) the translation = minimum value (- maximum value)
				// when the item's top value (relative to the viewport) equals "-item's height" (item just exited the viewport) the translation = maximum value
				setValue: () => {
					const maxValue = this.renderedStyles.innerTranslationY.maxValue;
					const minValue = -1 * maxValue;
					return Math.max(
						Math.min(
							MathUtils.map(this.props.top - docScroll, winsize.height, -1 * this.props.height, minValue, maxValue),
							maxValue
						),
						minValue
					);
				}
			}
		};
		// set the initial values
		this.update();
		// use the IntersectionObserver API to check when the element is inside the viewport
		// only then the element translation will be updated
		this.observer = new IntersectionObserver(entries => {
			entries.forEach(entry => (this.isVisible = entry.intersectionRatio > 0));
		});
		this.observer.observe(this.el);
		// init/bind events
		// this.initEvents();
	}
	update() {
		// gets the item's height and top (relative to the document)
		this.getSize();
		// sets the initial value (no interpolation)
		for (const key in this.renderedStyles) {
			this.renderedStyles[key].current = this.renderedStyles[key].previous = this.renderedStyles[key].setValue();
		}
		// translate the image
		this.layout();
	}
	getSize() {
		const rect = this.el.getBoundingClientRect();
		this.props = {
			// item's height
			height: rect.height,
			// offset top relative to the document
			top: docScroll + rect.top
		};
	}

	resize() {
		// on resize rest sizes and update the translation value
		this.update();
	}
	render() {
		// update the current and interpolated values
		for (const key in this.renderedStyles) {
			this.renderedStyles[key].current = this.renderedStyles[key].setValue();
			this.renderedStyles[key].previous = MathUtils.lerp(
				this.renderedStyles[key].previous,
				this.renderedStyles[key].current,
				this.renderedStyles[key].ease
			);
		}
		// and translates the image
		this.layout();
	}
	layout() {
		// translates the image
		this.image.style.transform = `translate3d(0,${this.renderedStyles.innerTranslationY.previous}px,0)`;
	}
}
