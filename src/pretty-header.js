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
		root.makePrettyHeader = factory();
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

	/**
	 * @param {Node} ele which holds the text to decorate
	 * @param {String|Function} option is a class name or DOM-Node factory function
	 */
	function makePrettyHeader(ele, option) {

		var elementFactory = buildElementFactory(option);

		var i, j, k, x;
		var $ele = $(ele);
		var $span = $('<span/>');
		var text = $.trim($ele.text());
		$ele.html($span.text(text));
		var lineHeight = parseInt($span.css('line-height'));
		var height = parseInt($span.css('height'));
		var lines = Math.round(height / lineHeight);
		if (lines <= 1) {
			return;
		}

		var maxWidth = $ele.width();
		var words = text.split(/\s+/);
		$span.html('<span>' + words.join(' </span> <span>') + '</span>');

		var wordSpans = $span.find('> span').addClass(option);
		var wordWidths = $.map(wordSpans, function (wordSpan) {
			return $(wordSpan).width();
		});

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

		$span.addClass(option);
		var $lines = [$span];
		for (i = 1; i < lines; i++) {
			$ele.append(' ');
			$lines.push($('<span/>').addClass(option).appendTo($ele));
		}

		for (x = 0, i = 0; i < lines; i++) {
			$lines[i].html(words.slice(x, variations[j].dividers[i]).join(' '));
			x = variations[j].dividers[i];
		}

	}

	return makePrettyHeader;

}));
