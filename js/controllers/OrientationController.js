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

const ORIENTATIONS = [
  { x: 1, y: 0, z: 0 },
  { x: 0, y: -1, z: 0 },
  { x: 0, y: 0, z: 1 },
];

// TODO (Peter) replace the dependency on THREE.js for the axis angle rotations and quarternions
function getOrientations(THREE, quaternion) {
  return ORIENTATIONS.map(orientation => {
    const threeOrientation = new THREE.Vector3(orientation.x, orientation.y, orientation.z);
    threeOrientation.applyQuaternion(quaternion);
    return threeOrientation;
  })
}

function createOrientationController(THREE) {
  const internalQuaternion = new THREE.Quaternion();
  let internalDown = ORIENTATIONS[ORIENTATION_DIRECTIONS.DOWN];
  return {
    getQuaternion: () => internalQuaternion.clone().conjugate(),
    update: down => {
      const ret = calculateOrientationDeltaAxisAndAngle(
        internalDown,
        down
      );
      if (!ret) return;

      const { axis, angle } = ret;
      const threeAxis = new THREE.Vector3(axis.x, axis.y, axis.z);

      const updateQuaternion = new THREE.Quaternion();
      updateQuaternion.setFromAxisAngle(threeAxis, angle);

      internalQuaternion.multiply(updateQuaternion);
      internalDown = down;
    },
  }
}

module.exports = {
  createOrientationController,
  getOrientations,
  ORIENTATION_DIRECTIONS,
}
