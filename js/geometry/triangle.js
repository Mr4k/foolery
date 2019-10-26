const EPSILON = 0.000000;

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
	// Note (Peter) use better rng source or deterministic ids in the future
	const id = Math.floor(Math.random() * 100000000);
	return {
		id,
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

	const distanceToEdge = triangle.edges.reduce((closest, e) => {
		const res = squaredDistToEdge(point, e);
		if (!closest || res.dist < closest.dist) return res;

		return closest;
	}, null);
	
	// TODO Peter is this really nessecary if there is a point on the plane shoudn't it always
	// be closer than projection to an edge?
	if (distToTri && (!distanceToEdge || distToTri.dist < distanceToEdge.dist)) return distToTri;
	return distanceToEdge;
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
