/*!
 * App 0.0.1
 */
import {a as requireLib,r as requireLib$1,l as lib$8,b as require$$1,g as getDefaultExportFromCjs,c as lib$9}from'./index-f1562490.js';function _mergeNamespaces(n, m){m.forEach(function(e){e&&typeof e!=='string'&&!Array.isArray(e)&&Object.keys(e).forEach(function(k){if(k!=='default'&&!(k in n)){var d=Object.getOwnPropertyDescriptor(e,k);Object.defineProperty(n,k,d.get?d:{enumerable:true,get:function(){return e[k]}});}})});return Object.freeze(n);}var lib$7 = {};var lib$6 = {};Object.defineProperty(lib$6, "__esModule", {
  value: true
});
lib$6.declare = declare;
lib$6.declarePreset = void 0;
const apiPolyfills = {
  assertVersion: api => range => {
    throwVersionError(range, api.version);
  }
};
{
  Object.assign(apiPolyfills, {
    targets: () => () => {
      return {};
    },
    assumption: () => () => {
      return undefined;
    }
  });
}
function declare(builder) {
  return (api, options, dirname) => {
    var _clonedApi2;
    let clonedApi;
    for (const name of Object.keys(apiPolyfills)) {
      var _clonedApi;
      if (api[name]) continue;
      (_clonedApi = clonedApi) != null ? _clonedApi : clonedApi = copyApiObject(api);
      clonedApi[name] = apiPolyfills[name](clonedApi);
    }
    return builder((_clonedApi2 = clonedApi) != null ? _clonedApi2 : api, options || {}, dirname);
  };
}
const declarePreset = declare;
lib$6.declarePreset = declarePreset;
function copyApiObject(api) {
  let proto = null;
  if (typeof api.version === "string" && /^7\./.test(api.version)) {
    proto = Object.getPrototypeOf(api);
    if (proto && (!has(proto, "version") || !has(proto, "transform") || !has(proto, "template") || !has(proto, "types"))) {
      proto = null;
    }
  }
  return Object.assign({}, proto, api);
}
function has(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
function throwVersionError(range, version) {
  if (typeof range === "number") {
    if (!Number.isInteger(range)) {
      throw new Error("Expected string or integer value.");
    }
    range = `^${range}.0.0-0`;
  }
  if (typeof range !== "string") {
    throw new Error("Expected string or integer value.");
  }
  const limit = Error.stackTraceLimit;
  if (typeof limit === "number" && limit < 25) {
    Error.stackTraceLimit = 25;
  }
  let err;
  if (version.slice(0, 2) === "7.") {
    err = new Error(`Requires Babel "^7.0.0-beta.41", but was loaded with "${version}". ` + `You'll need to update your @babel/core version.`);
  } else {
    err = new Error(`Requires Babel "${range}", but was loaded with "${version}". ` + `If you are sure you have a compatible version of @babel/core, ` + `it is likely that something in your build process is loading the ` + `wrong version. Inspect the stack trace of this error to look for ` + `the first entry that doesn't mention "@babel/core" or "babel-core" ` + `to see what is calling Babel.`);
  }
  if (typeof limit === "number") {
    Error.stackTraceLimit = limit;
  }
  throw Object.assign(err, {
    code: "BABEL_VERSION_UNSUPPORTED",
    version,
    range
  });
}var lib$5 = {};var createPlugin$1 = {};var lib$4 = {};Object.defineProperty(lib$4, "__esModule", {
  value: true
});
lib$4.default = void 0;
var _helperPluginUtils$3 = lib$6;
var _default$4 = (0, _helperPluginUtils$3.declare)(api => {
  api.assertVersion(7);
  return {
    name: "syntax-jsx",
    manipulateOptions(opts, parserOpts) {
      {
        if (parserOpts.plugins.some(p => (Array.isArray(p) ? p[0] : p) === "typescript")) {
          return;
        }
      }
      parserOpts.plugins.push("jsx");
    }
  };
});
lib$4.default = _default$4;var lib$3 = {};Object.defineProperty(lib$3, "__esModule", {
  value: true
});
lib$3.default = annotateAsPure;
var _t = requireLib();
const {
  addComment
} = _t;
const PURE_ANNOTATION = "#__PURE__";
const isPureAnnotated = ({
  leadingComments
}) => !!leadingComments && leadingComments.some(comment => /[@#]__PURE__/.test(comment.value));
function annotateAsPure(pathOrNode) {
  const node = pathOrNode["node"] || pathOrNode;
  if (isPureAnnotated(node)) {
    return;
  }
  addComment(node, "leading", PURE_ANNOTATION);
}Object.defineProperty(createPlugin$1, "__esModule", {
  value: true
});
createPlugin$1.default = createPlugin;
var _pluginSyntaxJsx = lib$4;
var _helperPluginUtils$2 = lib$6;
var _core$2 = requireLib$1();
var _helperModuleImports = lib$8;
var _helperAnnotateAsPure$1 = lib$3;
const DEFAULT = {
  importSource: "react",
  runtime: "automatic",
  pragma: "React.createElement",
  pragmaFrag: "React.Fragment"
};
const JSX_SOURCE_ANNOTATION_REGEX = /^\s*\*?\s*@jsxImportSource\s+([^\s]+)\s*$/m;
const JSX_RUNTIME_ANNOTATION_REGEX = /^\s*\*?\s*@jsxRuntime\s+([^\s]+)\s*$/m;
const JSX_ANNOTATION_REGEX = /^\s*\*?\s*@jsx\s+([^\s]+)\s*$/m;
const JSX_FRAG_ANNOTATION_REGEX = /^\s*\*?\s*@jsxFrag\s+([^\s]+)\s*$/m;
const get = (pass, name) => pass.get(`@babel/plugin-react-jsx/${name}`);
const set = (pass, name, v) => pass.set(`@babel/plugin-react-jsx/${name}`, v);
function hasProto(node) {
  return node.properties.some(value => _core$2.types.isObjectProperty(value, {
    computed: false,
    shorthand: false
  }) && (_core$2.types.isIdentifier(value.key, {
    name: "__proto__"
  }) || _core$2.types.isStringLiteral(value.key, {
    value: "__proto__"
  })));
}
function createPlugin({
  name,
  development
}) {
  return (0, _helperPluginUtils$2.declare)((_, options) => {
    const {
      pure: PURE_ANNOTATION,
      throwIfNamespace = true,
      filter,
      runtime: RUNTIME_DEFAULT = development ? "automatic" : "classic",
      importSource: IMPORT_SOURCE_DEFAULT = DEFAULT.importSource,
      pragma: PRAGMA_DEFAULT = DEFAULT.pragma,
      pragmaFrag: PRAGMA_FRAG_DEFAULT = DEFAULT.pragmaFrag
    } = options;
    {
      var {
        useSpread = false,
        useBuiltIns = false
      } = options;
      if (RUNTIME_DEFAULT === "classic") {
        if (typeof useSpread !== "boolean") {
          throw new Error("transform-react-jsx currently only accepts a boolean option for " + "useSpread (defaults to false)");
        }
        if (typeof useBuiltIns !== "boolean") {
          throw new Error("transform-react-jsx currently only accepts a boolean option for " + "useBuiltIns (defaults to false)");
        }
        if (useSpread && useBuiltIns) {
          throw new Error("transform-react-jsx currently only accepts useBuiltIns or useSpread " + "but not both");
        }
      }
    }
    const injectMetaPropertiesVisitor = {
      JSXOpeningElement(path, state) {
        const attributes = [];
        if (isThisAllowed(path.scope)) {
          attributes.push(_core$2.types.jsxAttribute(_core$2.types.jsxIdentifier("__self"), _core$2.types.jsxExpressionContainer(_core$2.types.thisExpression())));
        }
        attributes.push(_core$2.types.jsxAttribute(_core$2.types.jsxIdentifier("__source"), _core$2.types.jsxExpressionContainer(makeSource(path, state))));
        path.pushContainer("attributes", attributes);
      }
    };
    return {
      name,
      inherits: _pluginSyntaxJsx.default,
      visitor: {
        JSXNamespacedName(path) {
          if (throwIfNamespace) {
            throw path.buildCodeFrameError(`Namespace tags are not supported by default. React's JSX doesn't support namespace tags. \
You can set \`throwIfNamespace: false\` to bypass this warning.`);
          }
        },
        JSXSpreadChild(path) {
          throw path.buildCodeFrameError("Spread children are not supported in React.");
        },
        Program: {
          enter(path, state) {
            const {
              file
            } = state;
            let runtime = RUNTIME_DEFAULT;
            let source = IMPORT_SOURCE_DEFAULT;
            let pragma = PRAGMA_DEFAULT;
            let pragmaFrag = PRAGMA_FRAG_DEFAULT;
            let sourceSet = !!options.importSource;
            let pragmaSet = !!options.pragma;
            let pragmaFragSet = !!options.pragmaFrag;
            if (file.ast.comments) {
              for (const comment of file.ast.comments) {
                const sourceMatches = JSX_SOURCE_ANNOTATION_REGEX.exec(comment.value);
                if (sourceMatches) {
                  source = sourceMatches[1];
                  sourceSet = true;
                }
                const runtimeMatches = JSX_RUNTIME_ANNOTATION_REGEX.exec(comment.value);
                if (runtimeMatches) {
                  runtime = runtimeMatches[1];
                }
                const jsxMatches = JSX_ANNOTATION_REGEX.exec(comment.value);
                if (jsxMatches) {
                  pragma = jsxMatches[1];
                  pragmaSet = true;
                }
                const jsxFragMatches = JSX_FRAG_ANNOTATION_REGEX.exec(comment.value);
                if (jsxFragMatches) {
                  pragmaFrag = jsxFragMatches[1];
                  pragmaFragSet = true;
                }
              }
            }
            set(state, "runtime", runtime);
            if (runtime === "classic") {
              if (sourceSet) {
                throw path.buildCodeFrameError(`importSource cannot be set when runtime is classic.`);
              }
              const createElement = toMemberExpression(pragma);
              const fragment = toMemberExpression(pragmaFrag);
              set(state, "id/createElement", () => _core$2.types.cloneNode(createElement));
              set(state, "id/fragment", () => _core$2.types.cloneNode(fragment));
              set(state, "defaultPure", pragma === DEFAULT.pragma);
            } else if (runtime === "automatic") {
              if (pragmaSet || pragmaFragSet) {
                throw path.buildCodeFrameError(`pragma and pragmaFrag cannot be set when runtime is automatic.`);
              }
              const define = (name, id) => set(state, name, createImportLazily(state, path, id, source));
              define("id/jsx", development ? "jsxDEV" : "jsx");
              define("id/jsxs", development ? "jsxDEV" : "jsxs");
              define("id/createElement", "createElement");
              define("id/fragment", "Fragment");
              set(state, "defaultPure", source === DEFAULT.importSource);
            } else {
              throw path.buildCodeFrameError(`Runtime must be either "classic" or "automatic".`);
            }
            if (development) {
              path.traverse(injectMetaPropertiesVisitor, state);
            }
          }
        },
        JSXFragment: {
          exit(path, file) {
            let callExpr;
            if (get(file, "runtime") === "classic") {
              callExpr = buildCreateElementFragmentCall(path, file);
            } else {
              callExpr = buildJSXFragmentCall(path, file);
            }
            path.replaceWith(_core$2.types.inherits(callExpr, path.node));
          }
        },
        JSXElement: {
          exit(path, file) {
            let callExpr;
            if (get(file, "runtime") === "classic" || shouldUseCreateElement(path)) {
              callExpr = buildCreateElementCall(path, file);
            } else {
              callExpr = buildJSXElementCall(path, file);
            }
            path.replaceWith(_core$2.types.inherits(callExpr, path.node));
          }
        },
        JSXAttribute(path) {
          if (_core$2.types.isJSXElement(path.node.value)) {
            path.node.value = _core$2.types.jsxExpressionContainer(path.node.value);
          }
        }
      }
    };
    function isDerivedClass(classPath) {
      return classPath.node.superClass !== null;
    }
    function isThisAllowed(scope) {
      do {
        const {
          path
        } = scope;
        if (path.isFunctionParent() && !path.isArrowFunctionExpression()) {
          if (!path.isMethod()) {
            return true;
          }
          if (path.node.kind !== "constructor") {
            return true;
          }
          return !isDerivedClass(path.parentPath.parentPath);
        }
        if (path.isTSModuleBlock()) {
          return false;
        }
      } while (scope = scope.parent);
      return true;
    }
    function call(pass, name, args) {
      const node = _core$2.types.callExpression(get(pass, `id/${name}`)(), args);
      if (PURE_ANNOTATION != null ? PURE_ANNOTATION : get(pass, "defaultPure")) (0, _helperAnnotateAsPure$1.default)(node);
      return node;
    }
    function shouldUseCreateElement(path) {
      const openingPath = path.get("openingElement");
      const attributes = openingPath.node.attributes;
      let seenPropsSpread = false;
      for (let i = 0; i < attributes.length; i++) {
        const attr = attributes[i];
        if (seenPropsSpread && _core$2.types.isJSXAttribute(attr) && attr.name.name === "key") {
          return true;
        } else if (_core$2.types.isJSXSpreadAttribute(attr)) {
          seenPropsSpread = true;
        }
      }
      return false;
    }
    function convertJSXIdentifier(node, parent) {
      if (_core$2.types.isJSXIdentifier(node)) {
        if (node.name === "this" && _core$2.types.isReferenced(node, parent)) {
          return _core$2.types.thisExpression();
        } else if (_core$2.types.isValidIdentifier(node.name, false)) {
          node.type = "Identifier";
          return node;
        } else {
          return _core$2.types.stringLiteral(node.name);
        }
      } else if (_core$2.types.isJSXMemberExpression(node)) {
        return _core$2.types.memberExpression(convertJSXIdentifier(node.object, node), convertJSXIdentifier(node.property, node));
      } else if (_core$2.types.isJSXNamespacedName(node)) {
        return _core$2.types.stringLiteral(`${node.namespace.name}:${node.name.name}`);
      }
      return node;
    }
    function convertAttributeValue(node) {
      if (_core$2.types.isJSXExpressionContainer(node)) {
        return node.expression;
      } else {
        return node;
      }
    }
    function accumulateAttribute(array, attribute) {
      if (_core$2.types.isJSXSpreadAttribute(attribute.node)) {
        const arg = attribute.node.argument;
        if (_core$2.types.isObjectExpression(arg) && !hasProto(arg)) {
          array.push(...arg.properties);
        } else {
          array.push(_core$2.types.spreadElement(arg));
        }
        return array;
      }
      const value = convertAttributeValue(attribute.node.name.name !== "key" ? attribute.node.value || _core$2.types.booleanLiteral(true) : attribute.node.value);
      if (attribute.node.name.name === "key" && value === null) {
        throw attribute.buildCodeFrameError('Please provide an explicit key value. Using "key" as a shorthand for "key={true}" is not allowed.');
      }
      if (_core$2.types.isStringLiteral(value) && !_core$2.types.isJSXExpressionContainer(attribute.node.value)) {
        var _value$extra;
        value.value = value.value.replace(/\n\s+/g, " ");
        (_value$extra = value.extra) == null ? true : delete _value$extra.raw;
      }
      if (_core$2.types.isJSXNamespacedName(attribute.node.name)) {
        attribute.node.name = _core$2.types.stringLiteral(attribute.node.name.namespace.name + ":" + attribute.node.name.name.name);
      } else if (_core$2.types.isValidIdentifier(attribute.node.name.name, false)) {
        attribute.node.name.type = "Identifier";
      } else {
        attribute.node.name = _core$2.types.stringLiteral(attribute.node.name.name);
      }
      array.push(_core$2.types.inherits(_core$2.types.objectProperty(attribute.node.name, value), attribute.node));
      return array;
    }
    function buildChildrenProperty(children) {
      let childrenNode;
      if (children.length === 1) {
        childrenNode = children[0];
      } else if (children.length > 1) {
        childrenNode = _core$2.types.arrayExpression(children);
      } else {
        return undefined;
      }
      return _core$2.types.objectProperty(_core$2.types.identifier("children"), childrenNode);
    }
    function buildJSXElementCall(path, file) {
      const openingPath = path.get("openingElement");
      const args = [getTag(openingPath)];
      const attribsArray = [];
      const extracted = Object.create(null);
      for (const attr of openingPath.get("attributes")) {
        if (attr.isJSXAttribute() && _core$2.types.isJSXIdentifier(attr.node.name)) {
          const {
            name
          } = attr.node.name;
          switch (name) {
            case "__source":
            case "__self":
              if (extracted[name]) throw sourceSelfError(path, name);
            case "key":
              {
                const keyValue = convertAttributeValue(attr.node.value);
                if (keyValue === null) {
                  throw attr.buildCodeFrameError('Please provide an explicit key value. Using "key" as a shorthand for "key={true}" is not allowed.');
                }
                extracted[name] = keyValue;
                break;
              }
            default:
              attribsArray.push(attr);
          }
        } else {
          attribsArray.push(attr);
        }
      }
      const children = _core$2.types.react.buildChildren(path.node);
      let attribs;
      if (attribsArray.length || children.length) {
        attribs = buildJSXOpeningElementAttributes(attribsArray, children);
      } else {
        attribs = _core$2.types.objectExpression([]);
      }
      args.push(attribs);
      if (development) {
        var _extracted$key;
        args.push((_extracted$key = extracted.key) != null ? _extracted$key : path.scope.buildUndefinedNode(), _core$2.types.booleanLiteral(children.length > 1));
        if (extracted.__source) {
          args.push(extracted.__source);
          if (extracted.__self) args.push(extracted.__self);
        } else if (extracted.__self) {
          args.push(path.scope.buildUndefinedNode(), extracted.__self);
        }
      } else if (extracted.key !== undefined) {
        args.push(extracted.key);
      }
      return call(file, children.length > 1 ? "jsxs" : "jsx", args);
    }
    function buildJSXOpeningElementAttributes(attribs, children) {
      const props = attribs.reduce(accumulateAttribute, []);
      if ((children == null ? void 0 : children.length) > 0) {
        props.push(buildChildrenProperty(children));
      }
      return _core$2.types.objectExpression(props);
    }
    function buildJSXFragmentCall(path, file) {
      const args = [get(file, "id/fragment")()];
      const children = _core$2.types.react.buildChildren(path.node);
      args.push(_core$2.types.objectExpression(children.length > 0 ? [buildChildrenProperty(children)] : []));
      if (development) {
        args.push(path.scope.buildUndefinedNode(), _core$2.types.booleanLiteral(children.length > 1));
      }
      return call(file, children.length > 1 ? "jsxs" : "jsx", args);
    }
    function buildCreateElementFragmentCall(path, file) {
      if (filter && !filter(path.node, file)) return;
      return call(file, "createElement", [get(file, "id/fragment")(), _core$2.types.nullLiteral(), ..._core$2.types.react.buildChildren(path.node)]);
    }
    function buildCreateElementCall(path, file) {
      const openingPath = path.get("openingElement");
      return call(file, "createElement", [getTag(openingPath), buildCreateElementOpeningElementAttributes(file, path, openingPath.get("attributes")), ..._core$2.types.react.buildChildren(path.node)]);
    }
    function getTag(openingPath) {
      const tagExpr = convertJSXIdentifier(openingPath.node.name, openingPath.node);
      let tagName;
      if (_core$2.types.isIdentifier(tagExpr)) {
        tagName = tagExpr.name;
      } else if (_core$2.types.isStringLiteral(tagExpr)) {
        tagName = tagExpr.value;
      }
      if (_core$2.types.react.isCompatTag(tagName)) {
        return _core$2.types.stringLiteral(tagName);
      } else {
        return tagExpr;
      }
    }
    function buildCreateElementOpeningElementAttributes(file, path, attribs) {
      const runtime = get(file, "runtime");
      {
        if (runtime !== "automatic") {
          const objs = [];
          const props = attribs.reduce(accumulateAttribute, []);
          if (!useSpread) {
            let start = 0;
            props.forEach((prop, i) => {
              if (_core$2.types.isSpreadElement(prop)) {
                if (i > start) {
                  objs.push(_core$2.types.objectExpression(props.slice(start, i)));
                }
                objs.push(prop.argument);
                start = i + 1;
              }
            });
            if (props.length > start) {
              objs.push(_core$2.types.objectExpression(props.slice(start)));
            }
          } else if (props.length) {
            objs.push(_core$2.types.objectExpression(props));
          }
          if (!objs.length) {
            return _core$2.types.nullLiteral();
          }
          if (objs.length === 1) {
            if (!(_core$2.types.isSpreadElement(props[0]) && _core$2.types.isObjectExpression(props[0].argument))) {
              return objs[0];
            }
          }
          if (!_core$2.types.isObjectExpression(objs[0])) {
            objs.unshift(_core$2.types.objectExpression([]));
          }
          const helper = useBuiltIns ? _core$2.types.memberExpression(_core$2.types.identifier("Object"), _core$2.types.identifier("assign")) : file.addHelper("extends");
          return _core$2.types.callExpression(helper, objs);
        }
      }
      const props = [];
      const found = Object.create(null);
      for (const attr of attribs) {
        const {
          node
        } = attr;
        const name = _core$2.types.isJSXAttribute(node) && _core$2.types.isJSXIdentifier(node.name) && node.name.name;
        if (runtime === "automatic" && (name === "__source" || name === "__self")) {
          if (found[name]) throw sourceSelfError(path, name);
          found[name] = true;
        }
        accumulateAttribute(props, attr);
      }
      return props.length === 1 && _core$2.types.isSpreadElement(props[0]) && !_core$2.types.isObjectExpression(props[0].argument) ? props[0].argument : props.length > 0 ? _core$2.types.objectExpression(props) : _core$2.types.nullLiteral();
    }
  });
  function getSource(source, importName) {
    switch (importName) {
      case "Fragment":
        return `${source}/${development ? "jsx-dev-runtime" : "jsx-runtime"}`;
      case "jsxDEV":
        return `${source}/jsx-dev-runtime`;
      case "jsx":
      case "jsxs":
        return `${source}/jsx-runtime`;
      case "createElement":
        return source;
    }
  }
  function createImportLazily(pass, path, importName, source) {
    return () => {
      const actualSource = getSource(source, importName);
      if ((0, _helperModuleImports.isModule)(path)) {
        let reference = get(pass, `imports/${importName}`);
        if (reference) return _core$2.types.cloneNode(reference);
        reference = (0, _helperModuleImports.addNamed)(path, importName, actualSource, {
          importedInterop: "uncompiled",
          importPosition: "after"
        });
        set(pass, `imports/${importName}`, reference);
        return reference;
      } else {
        let reference = get(pass, `requires/${actualSource}`);
        if (reference) {
          reference = _core$2.types.cloneNode(reference);
        } else {
          reference = (0, _helperModuleImports.addNamespace)(path, actualSource, {
            importedInterop: "uncompiled"
          });
          set(pass, `requires/${actualSource}`, reference);
        }
        return _core$2.types.memberExpression(reference, _core$2.types.identifier(importName));
      }
    };
  }
}
function toMemberExpression(id) {
  return id.split(".").map(name => _core$2.types.identifier(name)).reduce((object, property) => _core$2.types.memberExpression(object, property));
}
function makeSource(path, state) {
  const location = path.node.loc;
  if (!location) {
    return path.scope.buildUndefinedNode();
  }
  if (!state.fileNameIdentifier) {
    const {
      filename = ""
    } = state;
    const fileNameIdentifier = path.scope.generateUidIdentifier("_jsxFileName");
    path.scope.getProgramParent().push({
      id: fileNameIdentifier,
      init: _core$2.types.stringLiteral(filename)
    });
    state.fileNameIdentifier = fileNameIdentifier;
  }
  return makeTrace(_core$2.types.cloneNode(state.fileNameIdentifier), location.start.line, location.start.column);
}
function makeTrace(fileNameIdentifier, lineNumber, column0Based) {
  const fileLineLiteral = lineNumber != null ? _core$2.types.numericLiteral(lineNumber) : _core$2.types.nullLiteral();
  const fileColumnLiteral = column0Based != null ? _core$2.types.numericLiteral(column0Based + 1) : _core$2.types.nullLiteral();
  return _core$2.template.expression.ast`{
    fileName: ${fileNameIdentifier},
    lineNumber: ${fileLineLiteral},
    columnNumber: ${fileColumnLiteral},
  }`;
}
function sourceSelfError(path, name) {
  const pluginName = `transform-react-jsx-${name.slice(2)}`;
  return path.buildCodeFrameError(`Duplicate ${name} prop found. You are most likely using the deprecated ${pluginName} Babel plugin. Both __source and __self are automatically set when using the automatic runtime. Please remove transform-react-jsx-source and transform-react-jsx-self from your Babel config.`);
}Object.defineProperty(lib$5, "__esModule", {
  value: true
});
lib$5.default = void 0;
var _createPlugin$1 = createPlugin$1;
var _default$3 = (0, _createPlugin$1.default)({
  name: "transform-react-jsx",
  development: false
});
lib$5.default = _default$3;var lib$2 = {};var development = {};Object.defineProperty(development, "__esModule", {
  value: true
});
development.default = void 0;
var _createPlugin = createPlugin$1;
var _default$2 = (0, _createPlugin.default)({
  name: "transform-react-jsx/development",
  development: true
});
development.default = _default$2;(function (exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	Object.defineProperty(exports, "default", {
	  enumerable: true,
	  get: function () {
	    return _development.default;
	  }
	});
	var _development = development;

	
} (lib$2));var lib$1 = {};Object.defineProperty(lib$1, "__esModule", {
  value: true
});
lib$1.default = void 0;
var _helperPluginUtils$1 = lib$6;
var _path = require$$1;
var _core$1 = requireLib$1();
var _default$1 = (0, _helperPluginUtils$1.declare)(api => {
  api.assertVersion(7);
  function addDisplayName(id, call) {
    const props = call.arguments[0].properties;
    let safe = true;
    for (let i = 0; i < props.length; i++) {
      const prop = props[i];
      if (_core$1.types.isSpreadElement(prop)) {
        continue;
      }
      const key = _core$1.types.toComputedKey(prop);
      if (_core$1.types.isStringLiteral(key, {
        value: "displayName"
      })) {
        safe = false;
        break;
      }
    }
    if (safe) {
      props.unshift(_core$1.types.objectProperty(_core$1.types.identifier("displayName"), _core$1.types.stringLiteral(id)));
    }
  }
  const isCreateClassCallExpression = _core$1.types.buildMatchMemberExpression("React.createClass");
  const isCreateClassAddon = callee => _core$1.types.isIdentifier(callee, {
    name: "createReactClass"
  });
  function isCreateClass(node) {
    if (!node || !_core$1.types.isCallExpression(node)) return false;
    if (!isCreateClassCallExpression(node.callee) && !isCreateClassAddon(node.callee)) {
      return false;
    }
    const args = node.arguments;
    if (args.length !== 1) return false;
    const first = args[0];
    if (!_core$1.types.isObjectExpression(first)) return false;
    return true;
  }
  return {
    name: "transform-react-display-name",
    visitor: {
      ExportDefaultDeclaration({
        node
      }, state) {
        if (isCreateClass(node.declaration)) {
          const filename = state.filename || "unknown";
          let displayName = _path.basename(filename, _path.extname(filename));
          if (displayName === "index") {
            displayName = _path.basename(_path.dirname(filename));
          }
          addDisplayName(displayName, node.declaration);
        }
      },
      CallExpression(path) {
        const {
          node
        } = path;
        if (!isCreateClass(node)) return;
        let id;
        path.find(function (path) {
          if (path.isAssignmentExpression()) {
            id = path.node.left;
          } else if (path.isObjectProperty()) {
            id = path.node.key;
          } else if (path.isVariableDeclarator()) {
            id = path.node.id;
          } else if (path.isStatement()) {
            return true;
          }
          if (id) return true;
        });
        if (!id) return;
        if (_core$1.types.isMemberExpression(id)) {
          id = id.property;
        }
        if (_core$1.types.isIdentifier(id)) {
          addDisplayName(id.name, node);
        }
      }
    }
  };
});
lib$1.default = _default$1;var lib = {};Object.defineProperty(lib, "__esModule", {
  value: true
});
lib.default = void 0;
var _helperPluginUtils = lib$6;
var _helperAnnotateAsPure = lib$3;
var _core = requireLib$1();
const PURE_CALLS = [["react", new Set(["cloneElement", "createContext", "createElement", "createFactory", "createRef", "forwardRef", "isValidElement", "memo", "lazy"])], ["react-dom", new Set(["createPortal"])]];
var _default = (0, _helperPluginUtils.declare)(api => {
  api.assertVersion(7);
  return {
    name: "transform-react-pure-annotations",
    visitor: {
      CallExpression(path) {
        if (isReactCall(path)) {
          (0, _helperAnnotateAsPure.default)(path);
        }
      }
    }
  };
});
lib.default = _default;
function isReactCall(path) {
  const calleePath = path.get("callee");
  if (!calleePath.isMemberExpression()) {
    for (const [module, methods] of PURE_CALLS) {
      for (const method of methods) {
        if (calleePath.referencesImport(module, method)) {
          return true;
        }
      }
    }
    return false;
  }
  const object = calleePath.get("object");
  const callee = calleePath.node;
  if (!callee.computed && _core.types.isIdentifier(callee.property)) {
    const propertyName = callee.property.name;
    for (const [module, methods] of PURE_CALLS) {
      if (object.referencesImport(module, "default") || object.referencesImport(module, "*")) {
        return methods.has(propertyName);
      }
    }
  }
  return false;
}(function (exports) {

	Object.defineProperty(exports, '__esModule', { value: true });

	var helperPluginUtils = lib$6;
	var transformReactJSX = lib$5;
	var transformReactJSXDevelopment = lib$2;
	var transformReactDisplayName = lib$1;
	var transformReactPure = lib;
	var helperValidatorOption = lib$9;

	function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

	var transformReactJSX__default = /*#__PURE__*/_interopDefaultLegacy(transformReactJSX);
	var transformReactJSXDevelopment__default = /*#__PURE__*/_interopDefaultLegacy(transformReactJSXDevelopment);
	var transformReactDisplayName__default = /*#__PURE__*/_interopDefaultLegacy(transformReactDisplayName);
	var transformReactPure__default = /*#__PURE__*/_interopDefaultLegacy(transformReactPure);

	new helperValidatorOption.OptionValidator("@babel/preset-react");
	function normalizeOptions(options = {}) {
	  {
	    let {
	      pragma,
	      pragmaFrag
	    } = options;
	    const {
	      pure,
	      throwIfNamespace = true,
	      runtime = "classic",
	      importSource,
	      useBuiltIns,
	      useSpread
	    } = options;
	    if (runtime === "classic") {
	      pragma = pragma || "React.createElement";
	      pragmaFrag = pragmaFrag || "React.Fragment";
	    }
	    const development = !!options.development;
	    return {
	      development,
	      importSource,
	      pragma,
	      pragmaFrag,
	      pure,
	      runtime,
	      throwIfNamespace,
	      useBuiltIns,
	      useSpread
	    };
	  }
	}

	var index = helperPluginUtils.declarePreset((api, opts) => {
	  api.assertVersion(7);
	  const {
	    development,
	    importSource,
	    pragma,
	    pragmaFrag,
	    pure,
	    runtime,
	    throwIfNamespace
	  } = normalizeOptions(opts);
	  return {
	    plugins: [[development ? transformReactJSXDevelopment__default["default"] : transformReactJSX__default["default"], {
	      importSource,
	      pragma,
	      pragmaFrag,
	      runtime,
	      throwIfNamespace,
	      pure,
	      useBuiltIns: !!opts.useBuiltIns,
	      useSpread: opts.useSpread
	    }], transformReactDisplayName__default["default"], pure !== false && transformReactPure__default["default"]].filter(Boolean)
	  };
	});

	exports["default"] = index;
	
} (lib$7));

var index = /*@__PURE__*/getDefaultExportFromCjs(lib$7);var index$1=/*#__PURE__*/_mergeNamespaces({__proto__:null,'default':index},[lib$7]);export{index$1 as i};