import test from 'ava';
import * as phys from '../js/physics.js'
import * as geom from '../js/geometry/triangle.js'
import { approxEqualV } from './_testUtils.js'

const slideTestCandidates = [{
		normal: geom.vector(0, 0, -1),
		velocity: geom.vector(10, 5, 5),
		tMax: 1,
		t: 0.8,
		result: geom.vector(2, 1, 0),
	},
];

for (let c of slideTestCandidates) {
	test('test slide', async t => {
		approxEqualV(t, phys.calculateSlide(c.velocity, c.t, c.tMax, c.normal), c.result);
	});
}

const moveAndSlideTestCandidates = [{
		normal: geom.vector(0, 0, -1),
		velocity: geom.vector(2, 4, -2),
		origin: geom.vector(0, 0, 2),
		triangles: [geom.triangle(
			geom.vector(0, 0, 0),
			geom.vector(0, 9, 0),
			geom.vector(9, 0, 0),
		)],
		radius: 1,
		result: geom.vector(2, 4, 1),
	}, {
		normal: geom.vector(0, 0, -1),
		velocity: geom.vector(2, 4, -2),
		origin: geom.vector(0, 0, 2),
		triangles: [geom.triangle(
			geom.vector(0, 0, 0),
			geom.vector(0, 9, 0),
			geom.vector(9, 0, 0),
		), geom.triangle(
			geom.vector(0, 4, 0),
			geom.vector(9, 4, 0),
			geom.vector(0, 4, 9),
		)],
		radius: 1,
		result: geom.vector(1.5, 3, 1),
	},
];

let i = 0;
for (let c of moveAndSlideTestCandidates) {
	i += 1;
	test(`test move and slide #${i}`, async t => {
		approxEqualV(t, phys.moveAndSlide(c.origin, c.radius, c.velocity, c.triangles), c.result, 0.001);
	});
}
