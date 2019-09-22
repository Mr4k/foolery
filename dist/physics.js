// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"geometry/triangle.js":[function(require,module,exports) {
var EPSILON = 0.00001;

function vector(x, y, z) {
  return {
    x: x,
    y: y,
    z: z
  };
}

function sub(v1, v2) {
  return {
    x: v1.x - v2.x,
    y: v1.y - v2.y,
    z: v1.z - v2.z
  };
}

function add(v1, v2) {
  return {
    x: v1.x + v2.x,
    y: v1.y + v2.y,
    z: v1.z + v2.z
  };
}

function scale(v1, s) {
  return {
    x: v1.x * s,
    y: v1.y * s,
    z: v1.z * s
  };
}

function dot(v1, v2) {
  return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

function cross(v1, v2) {
  return {
    x: v1.y * v2.z - v1.z * v2.y,
    y: v1.z * v2.x - v1.x * v2.z,
    z: v1.x * v2.y - v1.y * v2.x
  };
}

function len(v1) {
  return Math.sqrt(dot(v1, v1));
}

function normalize(v1) {
  var len = Math.sqrt(dot(v1, v1));
  return {
    x: v1.x / len,
    y: v1.y / len,
    z: v1.z / len
  };
} // TODO make this function more efficient


function triangle(v1, v2, v3) {
  var normal = normalize(cross(sub(v1, v3), sub(v2, v3)));
  return {
    v1: v1,
    v2: v2,
    v3: v3,
    normal: normal,
    edges: [{
      anchor: v2,
      testPoint: v3,
      v: normalize(sub(v1, v2)),
      len: len(sub(v1, v2)),
      n: normalize(cross(sub(v1, v2), normal))
    }, {
      anchor: v3,
      testPoint: v1,
      v: normalize(sub(v2, v3)),
      len: len(sub(v2, v3)),
      n: normalize(cross(sub(v2, v3), normal))
    }, {
      anchor: v1,
      testPoint: v2,
      v: normalize(sub(v3, v1)),
      len: len(sub(v3, v1)),
      n: normalize(cross(sub(v3, v1), normal))
    }]
  };
}

function rayIntersectsPlane(origin, v, planeLike) {
  var projTowardsPlane = dot(planeLike.normal, v);
  if (Math.abs(projTowardsPlane) < EPSILON) return;
  var newPlanePos = sub(planeLike.v1, origin);
  var distToPlane = dot(newPlanePos, planeLike.normal);
  return distToPlane / projTowardsPlane;
}

function coplanarPointInTriangle(pt, triangle) {
  var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = triangle.edges[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var e = _step.value;
      var trueSide = dot(sub(e.testPoint, e.anchor), e.n);
      var testSide = dot(sub(pt, e.anchor), e.n);
      if (Math.sign(testSide) !== Math.sign(trueSide) && Math.abs(trueSide - testSide) >= epsilon) return false;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return true;
} // this function checks if a sphere hits a triangle from above or below
// note we do NOT check whether sphere comes in through an edge or a vertex


function sphereHitsTrianglePlane(origin, v, r, triangle) {
  var v1 = triangle.v1,
      normal = triangle.normal;
  var sign = Math.sign(dot(sub(origin, v1), normal));
  var newOrigin = sub(origin, scale(normal, r * sign));
  var sphereHitsPlane = rayIntersectsPlane(newOrigin, v, triangle);
  if (!sphereHitsPlane) return;
  var sphereProjectionOnPlane = add(scale(v, sphereHitsPlane), newOrigin);
  if (coplanarPointInTriangle(sphereProjectionOnPlane, triangle)) return sphereHitsPlane;
  return;
} // note we assume the sphere isn't already hitting the edge


function sphereHitsLine(origin, v, r, lineLike) {
  var newOrigin = sub(origin, lineLike.anchor);
  var lNorm = lineLike.v;
  var oo = dot(newOrigin, newOrigin);
  var ov = dot(newOrigin, v);
  var ol = dot(newOrigin, lNorm);
  var vl = dot(v, lNorm);
  var vv = dot(v, v);
  var c = oo - ol * ol - r * r;
  var b = 2 * (ov - ol * vl);
  var a = vv - vl * vl;
  var radicant = b * b - 4 * a * c;
  if (radicant < 0) return;
  var sqrtRad = Math.sqrt(radicant);
  return {
    s1: (-b - sqrtRad) / (2 * a),
    s2: (-b + sqrtRad) / (2 * a)
  };
} // note we assume the sphere isn't already hitting the edge
// we also don't take care of the cases where the sphere hits an edge cap


function sphereHitsEdge(origin, v, r, edgeLike) {
  var sphereIntersectsLine = sphereHitsLine(origin, v, r, edgeLike);
  if (sphereIntersectsLine === undefined) return {};
  var s1 = sphereIntersectsLine.s1,
      s2 = sphereIntersectsLine.s2;
  var newOrigin = sub(origin, edgeLike.anchor);
  var intersectionS1 = add(scale(v, s1), newOrigin);
  var intersectionS2 = add(scale(v, s2), newOrigin);
  var projS1 = dot(intersectionS1, edgeLike.v);
  var projS2 = dot(intersectionS2, edgeLike.v);
  var ret = {
    s1: {
      t: s1,
      n: sub(intersectionS1, scale(edgeLike.v, projS1))
    },
    s2: {
      t: s2,
      n: sub(intersectionS2, scale(edgeLike.v, projS2))
    }
  };
  if (projS1 < 0 || projS1 > edgeLike.len) ret.s1 = undefined;
  if (projS2 < 0 || projS2 > edgeLike.len) ret.s2 = undefined;
  return ret;
}

function sphereHitsPoint(origin, v, r, pointLike) {
  var newPoint = sub(pointLike.anchor, origin);
  var a = dot(v, v);
  var b = -2 * dot(v, newPoint);
  var c = dot(newPoint, newPoint) - r * r;
  var radicant = b * b - 4 * a * c;
  if (radicant < 0) return;
  var sqrtRad = Math.sqrt(radicant);
  return {
    s1: (-b - sqrtRad) / (2 * a),
    s2: (-b + sqrtRad) / (2 * a)
  };
} // returns first valid point hit and its normal
// TODO this function could probably be made more readable


function sphereHitsTriangle(origin, v, r, triangle) {
  var sphereIntersectsTriangle = sphereHitsTrianglePlane(origin, v, r, triangle);
  var minT = 100000000;
  var minN; // TODO make sure 0 is false is not a problem here

  if (sphereIntersectsTriangle !== undefined && sphereIntersectsTriangle > 0) {
    minT = sphereIntersectsTriangle;
    minN = triangle.normal;
  }

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = triangle.edges[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var e = _step2.value;
      var sphereIntersectsEdge = sphereHitsEdge(origin, v, r, e);

      if (sphereIntersectsEdge.s1 !== undefined && sphereIntersectsEdge.s1.t >= 0 && sphereIntersectsEdge.s1.t < minT) {
        minT = sphereIntersectsEdge.s1.t;
        minN = normalize(sphereIntersectsEdge.s1.n);
      }

      if (sphereIntersectsEdge.s2 !== undefined && sphereIntersectsEdge.s2.t >= 0 && sphereIntersectsEdge.s2.t < minT) {
        minT = sphereIntersectsEdge.s2.t;
        minN = normalize(sphereIntersectsEdge.s2.n);
      }

      var sphereIntersectsPoint = sphereHitsPoint(origin, v, r, e);

      if (sphereIntersectsPoint !== undefined && sphereIntersectsPoint.s1 >= 0 && sphereIntersectsPoint.s1 < minT) {
        var moved = add(scale(v, sphereIntersectsPoint.s1), origin);
        minT = sphereIntersectsPoint.s1;
        minN = normalize(sub(moved, e.anchor));
      }

      if (sphereIntersectsPoint !== undefined && sphereIntersectsPoint.s2 >= 0 && sphereIntersectsPoint.s2 < minT) {
        var _moved = add(scale(v, sphereIntersectsPoint.s2), origin);

        minT = sphereIntersectsPoint.s2;
        minN = normalize(sub(_moved, e.anchor));
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  if (!minN) return;
  return {
    t: minT,
    n: minN
  };
}

function squaredDistToEdge(point, edgeLike) {
  var newPoint = sub(point, edgeLike.anchor);
  var proj = dot(newPoint, edgeLike.v);
  proj = Math.min(Math.max(0, proj), edgeLike.len);
  var diff = sub(newPoint, scale(edgeLike.v, proj));
  return {
    dist: dot(diff, diff),
    dir: normalize(diff)
  };
}

function squaredDistToTrianglePlane(point, triangle) {
  var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var newPoint = sub(point, triangle.v1);
  var proj = sub(newPoint, scale(triangle.normal, dot(newPoint, triangle.normal)));
  var diff = sub(newPoint, proj);
  if (coplanarPointInTriangle(add(proj, triangle.v1), triangle, epsilon)) return {
    dist: dot(diff, diff),
    dir: normalize(diff)
  };
  return;
}

function squaredDistToTriangle(point, triangle) {
  var distToTri = squaredDistToTrianglePlane(point, triangle);
  if (distToTri) return distToTri;
  return triangle.edges.reduce(function (closest, e) {
    var res = squaredDistToEdge(point, e);
    if (!closest || res.dist < closest.dist) return res;
    return closest;
  }, undefined);
}

module.exports = {
  add: add,
  sub: sub,
  scale: scale,
  dot: dot,
  cross: cross,
  vector: vector,
  normalize: normalize,
  triangle: triangle,
  rayIntersectsPlane: rayIntersectsPlane,
  coplanarPointInTriangle: coplanarPointInTriangle,
  sphereHitsTrianglePlane: sphereHitsTrianglePlane,
  sphereHitsLine: sphereHitsLine,
  sphereHitsEdge: sphereHitsEdge,
  sphereHitsPoint: sphereHitsPoint,
  sphereHitsTriangle: sphereHitsTriangle,
  squaredDistToTriangle: squaredDistToTriangle,
  squaredDistToEdge: squaredDistToEdge,
  squaredDistToTrianglePlane: squaredDistToTrianglePlane
};
},{}],"physics.js":[function(require,module,exports) {
var geom = require('./geometry/triangle');

var EPSILON = 0.0001;

function calculateSlide(velocity, t, tMax, normal) {
  var scaledV = geom.scale(velocity, tMax - t);
  return geom.add(scaledV, geom.scale(normal, -geom.dot(scaledV, normal)));
}

function moveAndSlide(origin, radius, velocity, triangles) {
  var stepSize = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
  var depth = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 3;
  var kineticFriction = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0.5;
  if (depth === 0) return origin;
  var minT = 10000000000;
  var minN;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = triangles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var triangle = _step.value;
      var intersection = geom.sphereHitsTriangle(origin, velocity, radius, triangle);

      if (intersection && intersection.t >= 0 && intersection.t < minT) {
        minN = intersection.n;
        minT = intersection.t;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  minT = Math.min(Math.max(minT - EPSILON, 0), stepSize);
  var move = geom.add(origin, geom.scale(velocity, minT));
  if (!minN) return move;
  var slide = calculateSlide(velocity, minT, stepSize, minN); // TODO I'm sure this part could be improved / moved
  // also test this

  var normalForceMag = Math.abs(geom.dot(minN, velocity)) * (1 - minT);
  var postFrictionSlide = geom.scale(slide, Math.max(Math.sqrt(geom.dot(slide, slide)) - normalForceMag * kineticFriction, 0));
  return moveAndSlide(move, radius, postFrictionSlide, triangles, stepSize, depth - 1);
} // TODO this function could be wayyyy more efficient


function calculateGravityDirection(origin, triangles) {
  var exclusionDist = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
  var grav = triangles.reduce(function (grav, tri) {
    var ret = geom.squaredDistToTriangle(origin, tri);
    if (!ret) return grav;
    var dist = ret.dist,
        dir = ret.dir;
    if (dist > exclusionDist * exclusionDist) return grav;
    var rayOccluded = triangles.reduce(function (hits, tri) {
      if (!hits) return false; // this function with with sphere radius 0 is a raycast

      var intersection = geom.sphereHitsTrianglePlane(origin, dir, 0, tri);
      if (intersection && intersection < dist) return false;
      return hits;
    });
    if (rayOccluded) return grav;
    grav = geom.add(geom.scale(dir, 1.0 / (1 + dist)), grav);
    return grav;
  }, geom.vector(0, 0, 0));
  if (grav.x === 0 && grav.y === 0 && grav.z === 0) return grav;
  return geom.scale(geom.normalize(grav), -1);
}

function getOrientationAxes(gravDir, up) {}

module.exports = {
  calculateSlide: calculateSlide,
  moveAndSlide: moveAndSlide,
  geom: geom,
  calculateGravityDirection: calculateGravityDirection
};
},{"./geometry/triangle":"geometry/triangle.js"}],"../../../.nvm/versions/node/v12.4.0/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50755" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../.nvm/versions/node/v12.4.0/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","physics.js"], null)
//# sourceMappingURL=/physics.js.map