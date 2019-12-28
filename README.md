
## Smooth Scroll Image a.k.a. SScrollImage 🕺
<br>

---

<br>

# How to install

<br>

To install SScrollImage.js import it in your script like this

```javascript
import { SScrollImage } from 'path-to-the-script/SScrollImage.js';

```
**NPM ?** 😱
<br> *(idk)*

<br>

---

<br>

## How it works ?

<br>

Two lines needed for the **Javascript** part. 😉

```javascript
// Creating an instance
const SScroll = new SScrollImage();
// Init the SScroll for images
SScroll.init()

// Destroy all event listeners attached
// SScroll.destroy();
```

For the **HTML** part, it's more complex. <br>
You need to declare a div which will contain the image as a **background-url** and a parent that will handle the **size** of your image.
Add the attribute data-img-scroll to the parent <br>
*(The JavaScript part will detect all elements with this attribute).*
```html
<div class="item__img-wrapper" data-img-scroll>
	<div class="item__img"></div>
</div>
```

For the **CSS** part, it's a bit complicated.  💪 💪<br>
You need to add the following ***REQUIRED*** instructions (ofc) to your CSS and specify a value for the height and width of your image to the parent element.
<br> <br>
For the img itself (as a background-url) you have to specify a CSS variable call *--overflow* (in px) that will be used to make the parallax effect. <br>
*Assigning an higher overflow will make the parallax effect bigger*
```css
.item__img-wrapper {
	width: 300px;
	height: 500px;

	/* REQUIRED */
	overflow: hidden;
	will-change: transform;
}

.item__img {
	background-image: url('YOUR IMAGE URL');

	/* REQUIRED */
	/* Assigning an higher overflow will make the parallax effect bigger */
	--overflow: 60px;
	height: calc(100% + (2 * var(--overflow)));
	top: calc(-1 * var(--overflow));
	width: 100%;
	position: absolute;
	background-size: cover;
	background-position: 50% 0;
}
	
```

<br>

---

<br>

## Credits

<br>

All credits goes to [this codrops article](https://tympanus.net/codrops/2019/07/23/smooth-scrolling-image-effects/) and to this repository [codrops/SmoothScrollingImageEffects](https://github.com/codrops/SmoothScrollingImageEffects/).
<br>
This script was created on top of their original script, i just simplify some of the functions for my own use.
<br> <br>
[© Codrops 2019](www.codrops.com)
<br> 
*© ... and a little bit for myself too* 🤓
