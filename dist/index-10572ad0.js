/*!
 * App 0.0.1
 */
import { g as getDefaultExportFromCjs, r as requireLib } from './index-d790a87a.js';

function _mergeNamespaces(n, m) {
	m.forEach(function (e) {
		e && typeof e !== 'string' && !Array.isArray(e) && Object.keys(e).forEach(function (k) {
			if (k !== 'default' && !(k in n)) {
				var d = Object.getOwnPropertyDescriptor(e, k);
				Object.defineProperty(n, k, d.get ? d : {
					enumerable: true,
					get: function () { return e[k]; }
				});
			}
		});
	});
	return Object.freeze(n);
}

var libExports = requireLib();
var index = /*@__PURE__*/getDefaultExportFromCjs(libExports);

var index$1 = /*#__PURE__*/_mergeNamespaces({
	__proto__: null,
	'default': index
}, [libExports]);

export { index$1 as i };
