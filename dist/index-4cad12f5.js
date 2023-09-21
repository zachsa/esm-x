/*!
 * App 0.0.1
 */
'use strict';var index$1=require('./index.js');function _mergeNamespaces(n, m){m.forEach(function(e){e&&typeof e!=='string'&&!Array.isArray(e)&&Object.keys(e).forEach(function(k){if(k!=='default'&&!(k in n)){var d=Object.getOwnPropertyDescriptor(e,k);Object.defineProperty(n,k,d.get?d:{enumerable:true,get:function(){return e[k]}});}})});return Object.freeze(n);}var lib = {};Object.defineProperty(lib, "__esModule", {
  value: true
});
var default_1 = lib.default = void 0;
var _helperPluginUtils = index$1.l;
var _default = (0, _helperPluginUtils.declare)(api => {
  api.assertVersion(7);
  return {
    name: "syntax-import-assertions",
    manipulateOptions(opts, parserOpts) {
      parserOpts.plugins.push("importAssertions");
    }
  };
});
default_1 = lib.default = _default;var index=/*#__PURE__*/_mergeNamespaces({__proto__:null,get default(){return default_1}},[lib]);exports.i=index;