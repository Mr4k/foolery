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
