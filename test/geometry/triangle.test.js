import test from 'ava';
import * as geom from '../../js/geometry/triangle.js';

test('triangle: correct normal', t => {
	const v1 = geom.vector(1,1,0);
	const v2 = geom.vector(2,1,0);
	const v3 = geom.vector(1,2,0);

	const triangle = geom.triangle(v1, v2, v3);

	t.deepEqual(triangle.normal, geom.vector(0,0,1));
});

test('rayIntersectsPlane: correct intersections', t => {
	const v1 = geom.vector(0,0,0);
	const v2 = geom.vector(1,0,0);
	const v3 = geom.vector(0,1,0);

	const triangle = geom.triangle(v1, v2, v3);

	let rayPlaneIntersection = geom.rayIntersectsPlane(
		geom.vector(3, 3, 3),
		geom.vector(2, 2, -6),
		triangle
	);
	t.is(rayPlaneIntersection, 0.5);
});

const pointInTriangleTestCandidates = [{
		point: geom.vector(1.5, 1.4, 0),
		result: true,
	}, {
		point: geom.vector(1.2, 1.7, 0),
		result: true,
	}, {
		point: geom.vector(1.9, 1.8, 0),
		result: false,
	}, {
		point: geom.vector(-5, 1.5, 0),
		result: false,
	},
];

for (let c of pointInTriangleTestCandidates) {
	test(`coplanarPointInTriangle: point
	 (${c.point.x}, ${c.point.y}, ${c.point.z}) is ${c.point.result ? '' : 'not'} in triangle`, t => {
		const v1 = geom.vector(1,1,0);
		const v2 = geom.vector(2,1,0);
		const v3 = geom.vector(1,2,0);

		const triangle = geom.triangle(v1, v2, v3);

		t.is(geom.coplanarPointInTriangle(c.point, triangle), c.result);
	});
}

const sphereHitsTriangleTestCandidates = [{
    origin: geom.vector(1.5, 1.4, 3),
    radius: 1,
    velocity: geom.vector(0, 0, -4),
    result: 0.5,
  }, {
    origin: geom.vector(1.5, 1.4, -3),
    radius: 1,
    velocity: geom.vector(0, 0, 4),
    result: 0.5,
  }, {
    origin: geom.vector(0.5, 0.4, 6),
    radius: 1,
    velocity: geom.vector(1, 1, -5),
    result: 1,
  }, {
    origin: geom.vector(0.5, 0.4, 5),
    radius: 1,
    velocity: geom.vector(1, 1, -1),
    result: undefined,
  }, 
];

for (let c of sphereHitsTriangleTestCandidates) {
  test(`sphereIntersectsPlane: sphere with origin (${c.origin.x}, ${c.origin.y}, ${c.origin.z})
     and velocity (${c.velocity.x}, ${c.velocity.y}, ${c.velocity.z}) does ${c.result ? 'not' : ''} 
     intersect plane.`, t => {
    const v1 = geom.vector(1,1,0);
    const v2 = geom.vector(2,1,0);
    const v3 = geom.vector(1,2,0);

    const triangle = geom.triangle(v1, v2, v3);

    t.is(geom.sphereHitsTrianglePlane(c.origin, c.velocity, c.radius, triangle), c.result);
  });
}

const sphereHitsLineTestCandidates = [{
    origin: geom.vector(0, 0, 3),
    radius: 1,
    velocity: geom.vector(0, 0, -1),
    result: { s1: 2, s2: 4 },
  }, {
    origin: geom.vector(0, 1, 3),
    radius: 1,
    velocity: geom.vector(0, 0, -1),
    result: { s1: 3, s2: 3 },
  }, {
    origin: geom.vector(0, 1, 3),
    radius: 1,
    velocity: geom.vector(0, 0, -3),
    result: { s1: 1, s2: 1 },
  }, {
    origin: geom.vector(0, 0, 6),
    radius: 2,
    velocity: geom.vector(0, 0, -4),
    result: { s1: 1, s2: 2 },
  }, 
];

for (let c of sphereHitsLineTestCandidates) {
  test(`sphereIntersectsLine: sphere with origin (${c.origin.x}, ${c.origin.y}, ${c.origin.z})
     and velocity (${c.velocity.x}, ${c.velocity.y}, ${c.velocity.z}) does ${c.result ? 'not' : ''} 
     intersect line.`, t => {
    const lineLike = {
      anchor: geom.vector(0, 0, 0),
      v: geom.vector(1, 0, 0),
    }

    t.deepEqual(geom.sphereHitsLine(c.origin, c.velocity, c.radius, lineLike), c.result);
  });
}

const sphereHitsEdgeTestCandidates = [{
    origin: geom.vector(1, 0, 3),
    radius: 1,
    velocity: geom.vector(0, 0, -1),
    result: { 
      s1: {
        t: 2,
        n: geom.vector(0, 0, 1),
      }, 
      s2: {
        t: 4,
        n: geom.vector(0, 0, -1),
      },
    },
  }, 
];

for (let c of sphereHitsEdgeTestCandidates) {
  test(`sphereIntersectsEdge: sphere with origin (${c.origin.x}, ${c.origin.y}, ${c.origin.z})
     and velocity (${c.velocity.x}, ${c.velocity.y}, ${c.velocity.z}) does ${c.result ? 'not' : ''} 
     intersect edge.`, t => {
    const edgeLike = {
      anchor: geom.vector(0, 0, 0),
      v: geom.vector(1, 0, 0),
      len: 5,
    }

    t.deepEqual(geom.sphereHitsEdge(c.origin, c.velocity, c.radius, edgeLike), c.result);
  });
}

const sphereHitsPointTestCandidates = [{
    origin: geom.vector(1, 1, 3),
    radius: 1,
    velocity: geom.vector(0, 0, -1),
    result: { 
      s1: 1,
      s2: 3,
    },
  }, {
    origin: geom.vector(1, 2, 3),
    radius: 1,
    velocity: geom.vector(0, 0, -1),
    result: { 
      s1: 2,
      s2: 2,
    },
  }, 
];

for (let c of sphereHitsPointTestCandidates) {
  test(`sphereIntersectsPoint: sphere with origin (${c.origin.x}, ${c.origin.y}, ${c.origin.z})
     and velocity (${c.velocity.x}, ${c.velocity.y}, ${c.velocity.z}) does ${c.result ? 'not' : ''} 
     intersect point.`, t => {
    const pointLike = {
      anchor: geom.vector(1, 1, 1),
    }

    t.deepEqual(geom.sphereHitsPoint(c.origin, c.velocity, c.radius, pointLike), c.result);
  });
}

const distToEdgeTestCandidates = [{
    point: geom.vector(1, 1, 2),
    result: {
      dist: 4,
      dir: geom.vector(0, 0, 1),
    },
  }, 
];

for (let c of distToEdgeTestCandidates) {
  test(`squaredDistToEdge: sphere with origin (${c.point.x}, ${c.point.y}, ${c.point.z})`, t => {
    const edgeLike = {
      anchor: geom.vector(0, 1, 0),
      v: geom.vector(1, 0, 0),
      len: 5,
    }

    t.deepEqual(geom.squaredDistToEdge(c.point, edgeLike), c.result);
  });
}

const distToTriangleTestCandidates = [{
    point: geom.vector(1.25, 1.25, 2),
    result: {
      dist: 4,
      dir: geom.vector(0, 0, 1),
    },
  }, {
    point: geom.vector(-4, 1, 0),
    result: {
      dist: 25,
      dir: geom.vector(-1, 0, 0),
    },
  }
];

for (let c of distToTriangleTestCandidates) {
  test.only(`squaredDistToTriangle: sphere with origin (${c.point.x}, ${c.point.y}, ${c.point.z})`, t => {
    const v1 = geom.vector(1,1,0);
    const v2 = geom.vector(2,1,0);
    const v3 = geom.vector(1,2,0);

    const triangle = geom.triangle(v1, v2, v3);

    t.deepEqual(geom.squaredDistToTriangle(c.point, triangle), c.result);
  });
}
