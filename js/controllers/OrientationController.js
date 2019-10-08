// calculate new orientation using an axis angle rotation
// axis is the cross product of old down and new down and angle is assuming the shortest angle taken between them
function calculateOrientationDeltaAxisAndAngle(oldDown, down) {
  // TODO (Peter) can probably save a dot product down there b/c cross product mag is related to cos(theta)
  const rawAxis = geom.cross(down, oldDown);
  if (Math.abs(geom.dot(rawAxis, rawAxis)) > 0.0001) {
    const axis = geom.normalize(rawAxis);
    const angle = Math.acos(geom.dot(down, oldDown));
    return { axis, angle };
  }
  // not large enough to warrant an orientation change
  return;
}

const ORIENTATION_DIRECTIONS = {
  LEFT: 0,
  FORWARD: 1,
  DOWN: 2,
}

// TODO (Peter) replace the dependency on THREE.js for the axis angle rotations
function createOrientationController(THREE, stepAmount = 1) {
  const orientations = [
    { x: 1, y: 0, z: 0 },
    { x: 0, y: -1, z: 0 },
    { x: 0, y: 0, z: 1 },
  ];
  return {
    getOrientation: orientation => orientations[orientation],
    update: down => {
      const ret = calculateOrientationDeltaAxisAndAngle(
        orientations[ORIENTATION_DIRECTIONS.DOWN],
        down
      );
      if (!ret) return;

      const { axis, angle } = ret;
      orientations.forEach((orientation, index) => {
        const threeOrientationVector = new THREE.Vector3(
          orientation.x,
          orientation.y,
          orientation.z);
				threeOrientationVector.applyAxisAngle(axis, -angle * stepAmount);
				orientations[index] = {
          x: threeOrientationVector.x,
          y: threeOrientationVector.y,
          z: threeOrientationVector.z,
        };
      });
    },
  }
}

module.exports = {
  createOrientationController,
  ORIENTATION_DIRECTIONS,
}
