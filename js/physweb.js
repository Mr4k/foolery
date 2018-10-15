(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.game = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function crapRand(seed) {
	return (Math.sin(seed) + 1) / 2.0;
}

function generateAsteroid(THREE, radius) {
	const geom = new THREE.SphereGeometry(radius, 10, 10);

	vertsToNeighborsMap = [];
	for (let i = 0; i < geom.vertices.length; i+=1) {
		vertsToNeighborsMap.push({});
		let scale = Math.random() * 1.2 + 0.4;
		scale *= scale * scale;
		geom.vertices[i].set(
			geom.vertices[i].x * scale,
			geom.vertices[i].y * scale,
			geom.vertices[i].z * scale);
	}

	for (let f of geom.faces) {
		vertsToNeighborsMap[f.a][f.b] = true;
		vertsToNeighborsMap[f.a][f.c] = true;
		vertsToNeighborsMap[f.b][f.a] = true;
		vertsToNeighborsMap[f.b][f.c] = true;
		vertsToNeighborsMap[f.c][f.a] = true;
		vertsToNeighborsMap[f.c][f.b] = true;
	}

	console.log('vtN', vertsToNeighborsMap);

	for (let j = 0; j < 3; j++) {
		for (let i = 0; i < geom.vertices.length; i+=1) {
			const neighbors = Object.keys(vertsToNeighborsMap[i]);
			let avgLen = neighbors.reduce((sum, key) => {
				return sum + geom.vertices[key].length();
			}, 0) / (neighbors.length === 0 ? 1 : neighbors.length);
			console.log(avgLen);
			geom.vertices[i] = geom.vertices[i].normalize().multiplyScalar(avgLen);
		}
	}

	geom.verticesNeedUpdate = true;
	geom.computeVertexNormals();
	return geom;
}

module.exports = {
	generateAsteroid,
}
},{}],2:[function(require,module,exports){
const EPSILON = 0.00001;

function vector(x, y, z) {
	return {
		x: x,
		y: y,
		z: z,
	}
}

function sub(v1, v2) {
	return {
		x:v1.x-v2.x,
		y:v1.y-v2.y,
		z:v1.z-v2.z,
	}
}

function add(v1, v2) {
	return {
		x:v1.x+v2.x,
		y:v1.y+v2.y,
		z:v1.z+v2.z,
	}
}

function scale(v1, s) {
	return {
		x: v1.x * s,
		y: v1.y * s,
		z: v1.z * s,
	}
}

function dot(v1, v2) {
	return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

function cross(v1, v2) {
	return {
		x: v1.y*v2.z - v1.z*v2.y,
		y: v1.z*v2.x - v1.x*v2.z,
		z: v1.x*v2.y - v1.y*v2.x,
	}
}

function len(v1) {
	return Math.sqrt(dot(v1, v1));
}

function normalize(v1) {
	const len = Math.sqrt(dot(v1, v1));
	return {
		x: v1.x / len,
		y: v1.y / len,
		z: v1.z / len,
	}
}

// TODO make this function more efficient
function triangle(v1, v2, v3) {
	const normal = normalize(cross(sub(v1, v3), sub(v2, v3)));
	return {
		v1: v1,
		v2: v2,
		v3: v3,
		normal,
		edges: [{
			anchor: v2,
			testPoint: v3,
			v: normalize(sub(v1, v2)),
			len: len(sub(v1, v2)),
			n: normalize(cross(sub(v1, v2), normal)),
		}, {
			anchor: v3,
			testPoint: v1,
			v: normalize(sub(v2, v3)),
			len: len(sub(v2, v3)),
			n: normalize(cross(sub(v2, v3), normal)),
		}, {
			anchor: v1,
			testPoint: v2,
			v: normalize(sub(v3, v1)),
			len: len(sub(v3, v1)),
			n: normalize(cross(sub(v3, v1), normal)),
		}]
	}
}

function rayIntersectsPlane(origin, v, planeLike) {
	const projTowardsPlane = dot(planeLike.normal, v);
	if (Math.abs(projTowardsPlane) < EPSILON) return;

	const newPlanePos = sub(planeLike.v1, origin);
	const distToPlane = dot(newPlanePos, planeLike.normal);
	return distToPlane / projTowardsPlane;
}

function coplanarPointInTriangle(pt, triangle, epsilon = 0) {
	for (let e of triangle.edges) {
		const trueSide = dot(sub(e.testPoint, e.anchor), e.n);
		const testSide = dot(sub(pt, e.anchor), e.n);
		if (Math.sign(testSide) !== Math.sign(trueSide) && Math.abs(trueSide - testSide) >= epsilon) return false;
	}
	return true;
}

// this function checks if a sphere hits a triangle from above or below
// note we do NOT check whether sphere comes in through an edge or a vertex
function sphereHitsTrianglePlane(origin, v, r, triangle) {
	const { v1, normal } = triangle;
	const sign = Math.sign(dot(sub(origin, v1), normal));
	const newOrigin = sub(origin, scale(normal, r * sign));

	const sphereHitsPlane = rayIntersectsPlane(newOrigin, v, triangle);
	if (!sphereHitsPlane) return;

	const sphereProjectionOnPlane = add(scale(v, sphereHitsPlane), newOrigin);
	if (coplanarPointInTriangle(sphereProjectionOnPlane, triangle)) return sphereHitsPlane;

	return;
}

// note we assume the sphere isn't already hitting the edge
function sphereHitsLine(origin, v, r, lineLike) {
	const newOrigin = sub(origin, lineLike.anchor);
	const lNorm = lineLike.v;
	const oo = dot(newOrigin, newOrigin);
	const ov = dot(newOrigin, v);
	const ol = dot(newOrigin, lNorm);
	const vl = dot(v, lNorm);
	const vv = dot(v, v);
	const c = oo - ol * ol - r * r;
	const b = 2 * (ov - ol * vl);
	const a = vv - vl * vl;

	const radicant = b*b - 4*a*c;
	if (radicant < 0) return;

	const sqrtRad = Math.sqrt(radicant);
	return {
		s1: (-b - sqrtRad) / (2 * a),
		s2: (-b + sqrtRad) / (2 * a),
	}
}

// note we assume the sphere isn't already hitting the edge
// we also don't take care of the cases where the sphere hits an edge cap
function sphereHitsEdge(origin, v, r, edgeLike) {
	const sphereIntersectsLine = sphereHitsLine(origin, v, r, edgeLike);
	if (sphereIntersectsLine === undefined) return {};

	const { s1, s2 } = sphereIntersectsLine;

	const newOrigin = sub(origin, edgeLike.anchor);

	const intersectionS1 = add(scale(v, s1), newOrigin);
	const intersectionS2 = add(scale(v, s2), newOrigin);

	const projS1 = dot(intersectionS1, edgeLike.v);
	const projS2 = dot(intersectionS2, edgeLike.v);

	const ret = { 
		s1: { 
			t: s1,
			n: sub(intersectionS1, scale(edgeLike.v, projS1)),
		}, 
		s2: {
			t: s2,
			n: sub(intersectionS2, scale(edgeLike.v, projS2)),
		} 
	};

	if (projS1 < 0 || projS1 > edgeLike.len) ret.s1 = undefined;
	if (projS2 < 0 || projS2 > edgeLike.len) ret.s2 = undefined;

	return ret;
}

function sphereHitsPoint(origin, v, r, pointLike) {
	const newPoint = sub(pointLike.anchor, origin);
	const a = dot(v, v);
	const b = -2 * dot(v, newPoint);
	const c = dot(newPoint, newPoint) - r * r;

	const radicant = b*b - 4*a*c;
	if (radicant < 0) return;

	const sqrtRad = Math.sqrt(radicant);
	return {
		s1: (-b - sqrtRad) / (2 * a),
		s2: (-b + sqrtRad) / (2 * a),
	}
}

// returns first valid point hit and its normal
// TODO this function could probably be made more readable
function sphereHitsTriangle(origin, v, r, triangle) {
	const sphereIntersectsTriangle = sphereHitsTrianglePlane(origin, v, r, triangle);

	let minT = 100000000;
	let minN;

	// TODO make sure 0 is false is not a problem here
	if (sphereIntersectsTriangle !== undefined && sphereIntersectsTriangle > 0) {
		minT = sphereIntersectsTriangle;
		minN = triangle.normal;
	}

	for (let e of triangle.edges) {
		const sphereIntersectsEdge = sphereHitsEdge(origin, v, r, e);
		if (sphereIntersectsEdge.s1 !== undefined && sphereIntersectsEdge.s1.t >= 0 && sphereIntersectsEdge.s1.t < minT) {
			minT = sphereIntersectsEdge.s1.t;
			minN = normalize(sphereIntersectsEdge.s1.n);
		}
		if (sphereIntersectsEdge.s2 !== undefined && sphereIntersectsEdge.s2.t >= 0 && sphereIntersectsEdge.s2.t < minT) {
			minT = sphereIntersectsEdge.s2.t;
			minN = normalize(sphereIntersectsEdge.s2.n);
		}

		const sphereIntersectsPoint = sphereHitsPoint(origin, v, r, e);
		if (sphereIntersectsPoint !== undefined && sphereIntersectsPoint.s1 >= 0 && sphereIntersectsPoint.s1 < minT) {
			const moved = add(scale(v, sphereIntersectsPoint.s1), origin);
			minT = sphereIntersectsPoint.s1;
			minN = normalize(sub(moved, e.anchor));
		}
		if (sphereIntersectsPoint !== undefined && sphereIntersectsPoint.s2 >= 0 && sphereIntersectsPoint.s2 < minT) {
			const moved = add(scale(v, sphereIntersectsPoint.s2), origin);
			minT = sphereIntersectsPoint.s2;
			minN = normalize(sub(moved, e.anchor));
		}
	}

	if (!minN) return;
	return {
		t: minT,
		n: minN,
	}
}

function squaredDistToEdge(point, edgeLike) {
	const newPoint = sub(point, edgeLike.anchor);
	let proj = dot(newPoint, edgeLike.v);

	proj = Math.min(Math.max(0, proj), edgeLike.len);

	const diff = sub(newPoint, scale(edgeLike.v, proj));
	return {
		dist: dot(diff, diff),
		dir: normalize(diff),
	};
}

function squaredDistToTrianglePlane(point, triangle, epsilon = 0) {
	const newPoint = sub(point, triangle.v1);
	const proj = sub(newPoint, scale(triangle.normal, dot(newPoint, triangle.normal)));
	const diff = sub(newPoint, proj);

	if (coplanarPointInTriangle(add(proj, triangle.v1), triangle, epsilon)) return {
		dist: dot(diff, diff),
		dir: normalize(diff),
	};

	return;
}

function squaredDistToTriangle(point, triangle) {
	const distToTri = squaredDistToTrianglePlane(point, triangle);
	if (distToTri) return distToTri;

	return triangle.edges.reduce((closest, e) => {
		const res = squaredDistToEdge(point, e);
		if (!closest || res.dist < closest.dist) return res;

		return closest;
	}, undefined);
}

module.exports = {
	add,
	sub,
	scale,
	dot,
	cross,
	vector,
	normalize,
	triangle,
	rayIntersectsPlane,
	coplanarPointInTriangle,
	sphereHitsTrianglePlane,
	sphereHitsLine,
	sphereHitsEdge,
	sphereHitsPoint,
	sphereHitsTriangle,
	squaredDistToTriangle,
	squaredDistToEdge,
	squaredDistToTrianglePlane,
}

},{}],3:[function(require,module,exports){
const phys = require('./physics.js');
const geom = require('./geometry/triangle.js');

const asteroid = require('./game/asteroid.js');

module.exports = {
	phys,
	geom,
	asteroid,
}
},{"./game/asteroid.js":1,"./geometry/triangle.js":2,"./physics.js":4}],4:[function(require,module,exports){
const geom = require('./geometry/triangle');
const EPSILON = 0.0001;

function calculateSlide(velocity, t, tMax, normal) {
	const scaledV = geom.scale(velocity, tMax - t);
	return geom.add(scaledV, geom.scale(normal, -geom.dot(scaledV, normal)));
}

function moveAndSlide(origin, radius, velocity, triangles, stepSize = 1, depth = 3) {
	if (depth === 0) return origin;

	let minT = 10000000000;
	let minN;

	for (let triangle of triangles) {
		const intersection = geom.sphereHitsTriangle(origin, velocity,
		 radius, triangle);
		if (intersection && intersection.t >= 0 && intersection.t < minT) {
			minN = intersection.n;
			minT = intersection.t;
		}
	}

	minT = Math.min(Math.max(minT - EPSILON, 0), stepSize);

	const move = geom.add(origin, geom.scale(velocity, minT));

	if (!minN) return move;

	const slide = calculateSlide(velocity, minT, stepSize, minN);

	return moveAndSlide(move, radius, slide, triangles, stepSize, depth - 1);
}

// TODO this function could be wayyyy more efficient
function calculateGravityDirection(origin, triangles, exclusionDist = 10) {
	const grav = triangles.reduce((grav, tri) => {
		let ret = geom.squaredDistToTrianglePlane(origin, tri, 0.1);
		if (!ret) return grav;

		const { dist, dir } = ret;

		const rayOccluded = triangles.reduce((hits, tri) => {
			if (!hits) return false;

			// this function with with sphere radius 0 is a raycast
			const intersection = geom.sphereHitsTrianglePlane(origin, dir, 0, tri);
			if (intersection && intersection < dist) return false;

			return hits;
		});

		if (rayOccluded) return grav;

		if (dist < exclusionDist * exclusionDist) {
			grav = geom.add(geom.scale(dir, 1.0/(1 + dist)), grav);
		}

		//console.log('dist', dist);

		return grav;
	}, geom.vector(0, 0, 0));
	if (grav.x === 0 && grav.y === 0 && grav.z === 0) return grav;

	return geom.scale(geom.normalize(grav), -1);
}

module.exports = {
	calculateSlide,
	moveAndSlide,
	geom,
	calculateGravityDirection,
}

},{"./geometry/triangle":2}]},{},[3])(3)
});
