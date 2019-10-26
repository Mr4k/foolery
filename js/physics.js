const geom = require('./geometry/triangle');
const EPSILON = 0.0000;

function calculateSlide(velocity, t, tMax, normal) {
	const scaledV = geom.scale(velocity, tMax - t);
	return geom.add(scaledV, geom.scale(normal, -geom.dot(scaledV, normal)));
}

// TODO (Peter) almost sure this can become one with the above function
function calculateSlide2(velocity, t, tMax, normal) {
	const scaledV = geom.scale(velocity, tMax - t);
	return geom.add(scaledV, geom.scale(normal, -Math.min(geom.dot(scaledV, normal), 0)));
}

function moveAndSlide(origin, radius, originalVelocity, triangles, stepSize = 1, depth = 3, kineticFriction = 0.5, totalNormalForce = { x: 0, y: 0, z: 0 }, totalFrictionForce = { x: 0, y: 0, z: 0 }) {
	if (depth === 0) return { newOrigin: origin, totalNormalForce, totalFrictionForce };

	// we may start very close to some triangles, if we do assume we are automatically hitting them
	// remove the part of our movement pointing that way right off of the bat

	let updatedTotalNormalForce = totalNormalForce;

	const { vectorsToProjectAgainst, triangleIds } = getTrianglesWithinDist(origin, triangles, radius + 1);
	const velocity = vectorsToProjectAgainst.reduce((vel, normal) => {
		const normalForceMag = -geom.dot(normal, vel);
		updatedTotalNormalForce = geom.add(geom.scale(normal, normalForceMag), updatedTotalNormalForce);
		return calculateSlide2(vel, 0, stepSize, normal);
	}, originalVelocity);
	const filteredTriangles = triangles.filter(tri => !triangleIds.includes(tri.id));
	// now search for further collisions

	let minT = 10000000000;
	let minN;

	for (let triangle of filteredTriangles) {
		const intersection = geom.sphereHitsTriangle(origin, velocity,
			radius, triangle);
		if (intersection && intersection.t >= 0 && intersection.t < minT) {
			minN = intersection.n;
			minT = intersection.t;
		}
	}

	minT = Math.min(Math.max(minT - EPSILON, 0), stepSize);

	const move = geom.add(origin, geom.scale(velocity, minT));
	console.log({ newOrigin: move, totalNormalForce: updatedTotalNormalForce, totalFrictionForce });

	if (!minN) return { newOrigin: move, totalNormalForce: updatedTotalNormalForce, totalFrictionForce };

	const slide = calculateSlide(velocity, minT, stepSize, minN);

	// TODO I'm sure this part could be improved / moved
	// also test this
	const normalForceMag = Math.abs(geom.dot(minN, velocity)) * (1 - minT);
	updatedTotalNormalForce = geom.add(updatedTotalNormalForce, geom.scale(minN, normalForceMag));

	const slideMag = Math.sqrt(geom.dot(slide, slide));
	const frictionAmount = Math.max(slideMag - normalForceMag * kineticFriction, 0) / (slideMag === 0 ? 1 : slideMag);
	const postFrictionSlide = geom.scale(slide, frictionAmount);
	const updatedTotalFrictionForce = geom.add(
		totalFrictionForce,
		geom.scale(slide, -(1 - frictionAmount))
	);

	return moveAndSlide(move, radius, postFrictionSlide, triangles, stepSize, depth - 1, kineticFriction, updatedTotalNormalForce, updatedTotalFrictionForce);
}

const getTrianglesWithinDist = (origin, triangles, withinDist) => triangles.reduce(({ vectorsToProjectAgainst, triangleIds }, tri) => {
	let ret = geom.squaredDistToTriangle(origin, tri);
	if (!ret) return {
		vectorsToProjectAgainst,
		triangleIds,
	};

	const { dist, dir } = ret;
	
	if (dist < withinDist * withinDist) {
		triangleIds.push(tri.id);
		// gram schmit!!!!!!
		let finalDir = dir;
		vectorsToProjectAgainst.forEach(vec => {
			const proj = Math.min(geom.dot(finalDir, vec), 0);
			finalDir = geom.add(finalDir, geom.scale(vec, -proj));
		});
		if (finalDir.x !== 0 || finalDir.y !== 0 || finalDir.z !== 0){
			vectorsToProjectAgainst.push(geom.normalize(finalDir));	
		};
	}

	return {
		vectorsToProjectAgainst,
		triangleIds
	};
}, {
	vectorsToProjectAgainst: [],
	triangleIds: [],
});

// bad bad bad change this
function isOnGround(origin, radius, triangles, withinDist = 0.01) {
	return getTrianglesWithinDist(origin, triangles, withinDist + radius);
}

// TODO this function could be wayyyy more efficient
function calculateGravityDirection(origin, triangles, exclusionDist = 100) {
	const { grav, _minDist } = triangles.reduce(({ grav, minDist }, tri) => {
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

module.exports = {
	calculateSlide,
	moveAndSlide,
	geom,
	calculateGravityDirection,
	isOnGround,
}
