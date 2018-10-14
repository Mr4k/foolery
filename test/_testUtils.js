import * as geom from '../js/geometry/triangle.js'

function approxEqualV(t, v1, v2, epsilon = 0.0001) {
	return t.truthy(geom.dot(geom.sub(v1, v2), geom.sub(v1, v2)) < epsilon * epsilon);
}

module.exports = {
	approxEqualV,
}