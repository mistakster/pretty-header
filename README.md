# Pretty Header

Split a text into lines with almost equal width.

## Demo

Have a look at the [demo page](https://mistakster.github.io/pretty-header/test/) to see this script in action.

![Original and processed versions side by side](https://mistakster.github.io/pretty-header/test/pretty-header-demo.jpg)

## Usage

### As npm package

```
$ npm install pretty-header
```

```js
var prettyHeader = require('pretty-header');
var i, elements;
elements = document.querySelectorAll('.pretty');
for (i = 0; i < elements.length; i++) {
  prettyHeader(elements[i], 'nowrap');
}
```

### As a script

```html
<script src="pretty-header.js"></script>
<script>
  var i, elements;
  elements = document.querySelectorAll('.pretty');
  for (i = 0; i < elements.length; i++) {
    prettyHeader(elements[i], 'nowrap');
  }
</script>
```

### As jQuery plugin

```html
<script src="jquery-2.1.4.js"></script>
<script src="pretty-header.js"></script>
<script>
	$(function () {
		$('.pretty').prettyHeader('nowrap');
	});
</script>
```

## API

### prettyHeader(element, option)

### element

Type: `Node`

Container element.

### option

Type: `String|Function`

Each line of text will be wrapper into the element with
applied `white-spce: nowrap` styles. You can provide class name
or factory function for such elements.

If option is a string, it will be using as class for `<span>`.

If option is a function, it should return new DOM-Node.

```js
prettyHeader(element, function () {
	var helper = document.createElement('div');
	helper.className = 'pretty-header-helper';
	return helper;
});
```

## License

MIT © [Vladimir Kuznetsov](https://twitter.com/mistakster)
