const geom = require('./geometry/triangle');
const EPSILON = 0.0001;

function calculateSlide(velocity, t, tMax, normal) {
	const scaledV = geom.scale(velocity, tMax - t);
	return geom.add(scaledV, geom.scale(normal, -geom.dot(scaledV, normal)));
}

function moveAndSlide(origin, radius, velocity, triangles, stepSize = 1, depth = 3, kineticFriction = 0.5) {
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

	// TODO I'm sure this part could be improved / moved
	// also test this
	const normalForceMag = Math.abs(geom.dot(minN, velocity)) * (1 - minT);
	const postFrictionSlide = geom.scale(slide, Math.max(Math.sqrt(geom.dot(slide, slide)) - normalForceMag * kineticFriction, 0));

	return moveAndSlide(move, radius, postFrictionSlide, triangles, stepSize, depth - 1);
}

// TODO this function could be wayyyy more efficient
function calculateGravityDirection(origin, triangles, exclusionDist = 100) {
	const { grav, _minDist } = triangles.reduce(( { grav, minDist }, tri) => {
		let ret = geom.squaredDistToTriangle(origin, tri);
		if (!ret) return { grav, minDist };

		const { dist, dir } = ret;

		if (dist > exclusionDist * exclusionDist || !dist) return { grav, minDist };

		if (dist > minDist) return { grav, minDist };

		/*const rayOccluded = triangles.reduce((hits, tri) => {
			if (!hits) return false;

			// this function with sphere radius 0 is a raycast
			const intersection = geom.sphereHitsTrianglePlane(origin, dir, 0, tri);
			if (intersection && intersection < dist) return false;

			return hits;
		});

		if (rayOccluded) return grav;*/

		//grav = geom.add(geom.scale(dir, 1.0/(1 + dist)), grav);
		grav = dir;

		return { grav, minDist: dist };
	}, { grav: geom.vector(0, 0, 0), minDist: 1000000 });
	if (grav.x === 0 && grav.y === 0 && grav.z === 0) return grav;

	return geom.scale(geom.normalize(grav), -1);
}

function getForward(gravDir, oldGravDir, oldFwd) {
	
}

module.exports = {
	calculateSlide,
	moveAndSlide,
	geom,
	calculateGravityDirection,
}
