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

module.exports = {
	calculateSlide,
	moveAndSlide,
	geom,
}
