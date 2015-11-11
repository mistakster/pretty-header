/**
 * Pretty Header
 * @version 0.1.0
 * @author Vladimir Kuznetsov <mistakster@gmail.com>
 */
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define([], factory);
	} else if (typeof module === 'object' && module.exports) {
		module.exports = factory();
	} else if (typeof jQuery !== 'undefined' && typeof jQuery.fn !== 'undefined') {
		(function (makePrettyHeader) {
			jQuery.fn.prettyHeader = function (option) {
				return this.each(function () {
					makePrettyHeader(this, option);
				});
			};
		})(factory());
	} else {
		root.prettyHeader = factory();
	}
}(this, function () {

	function buildElementFactory(option) {
		var factory;
		if (typeof option === 'function') {
			factory = option;
		} else if (typeof option === 'string') {
			factory = function () {
				var span = document.createElement('span');
				span.className = option;
				return span;
			}
		} else {
			throw new Error('Option should be type of String or Function');
		}
		return factory;
	}

	function emptyElement(ele) {
		while (ele.firstChild) {
			ele.removeChild(ele.firstChild);
		}
		return ele;
	}

	function getLinesCount(ele) {
		var computedStyle = window.getComputedStyle(ele);
		var lineHeight = parseFloat(computedStyle.getPropertyValue('line-height'));
		if (isNaN(lineHeight)) {
			throw new Error('You should explicitly provide line-height property in CSS');
		}
		return Math.round(ele.offsetHeight / lineHeight);
	}

	function getWidth(ele) {
		return ele.offsetWidth;
	}

	/**
	 * @param {Array} words
	 * @param {Node} container
	 * @param {Function} elementFactory
	 */
	function computeWordWidths(words, container, elementFactory) {
		var i, span;
		var len = words.length;
		var spans = [];
		var widths = [];

		emptyElement(container);
		for (i = 0; i < len; i++) {
			span = elementFactory();
			span.appendChild(document.createTextNode(words[i] + ' '));
			spans.push(span);
			container.appendChild(span);
			if (i < len - 1) {
				container.appendChild(document.createTextNode(' '));
			}
		}

		for (i = 0; i < len; i++) {
			widths.push(getWidth(spans[i]));
		}

		return widths;
	}

	/**
	 * @param {Node} ele which holds the text to decorate
	 * @param {String|Function} option is a class name or DOM-Node factory function
	 */
	function makePrettyHeader(ele, option) {

		var i, j, k, x;
		var lines;
		var elementFactory = buildElementFactory(option);
		var text = ele.textContent;
		var span = document.createElement('span');

		span.appendChild(document.createTextNode(text));

		emptyElement(ele).appendChild(span);
		lines = getLinesCount(ele);
		if (lines <= 1) {
			ele.textContent = text;
			return;
		}

		var maxWidth = getWidth(ele);
		var words = text.trim().split(/\s+/);
		var wordWidths = computeWordWidths(words, span, elementFactory);

		var variations = [];

		function sum(arr) {
			var result = 0;
			for (var i = 0; i < arr.length; i++) {
				result += arr[i];
			}
			return result;
		}

		function computeVariant(dividers) {
			var width = [];
			var i, x, lines;
			dividers.push(words.length);
			lines = dividers.length;
			for (x = 0, i = 0; i < lines; i++) {
				width.push(sum(wordWidths.slice(x, dividers[i])));
				x = dividers[i];
			}
			var diff = Math.max.apply(null, width) - Math.min.apply(null, width);
			return {
				dividers: dividers,
				diff: diff
			};
		}

		var dividers = [];
		for (i = 1; i < lines; i++) {
			dividers.push(i);
		}

		while (dividers[0] < words.length - 1) {
			variations.push(computeVariant(dividers.slice()));
			x = lines - 2;
			for (j = x; j >= 0; j--) {
				dividers[j]++;
				if (j < lines - 1) {
					for (k = j + 1; k < lines - 1; k++) {
						dividers[k] = dividers[k - 1] + 1;
					}
				}
				if (dividers[j] <= words.length + 1 + j - lines) {
					break;
				}
			}
		}

		// j will contain the index of the most optimal variant
		for (x = Infinity, i = 0; i < variations.length; i++) {
			if (variations[i].diff < x) {
				x = variations[i].diff;
				j = i;
			}
		}

		emptyElement(ele);
		for (x = 0, i = 0; i < lines; i++) {
			span = elementFactory();
			span.appendChild(document.createTextNode(words.slice(x, variations[j].dividers[i]).join(' ')));
			ele.appendChild(span);
			if (i < lines - 1) {
				ele.appendChild(document.createTextNode(' '));
			}
			x = variations[j].dividers[i];
		}
	}

	return makePrettyHeader;

}));
