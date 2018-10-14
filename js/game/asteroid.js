function crapRand(seed) {
	return (Math.sin(seed) + 1) / 2.0;
}

function generateAsteroid(THREE, radius) {
	const geom = new THREE.SphereGeometry(radius, 10, 10);

	vertsToNeighborsMap = [];
	for (let i = 0; i < geom.vertices.length; i+=1) {
		vertsToNeighborsMap.push({});
		let scale = Math.random() * 1.2 + 0.4;
		scale *= scale * scale;
		geom.vertices[i].set(
			geom.vertices[i].x * scale,
			geom.vertices[i].y * scale,
			geom.vertices[i].z * scale);
	}

	for (let f of geom.faces) {
		vertsToNeighborsMap[f.a][f.b] = true;
		vertsToNeighborsMap[f.a][f.c] = true;
		vertsToNeighborsMap[f.b][f.a] = true;
		vertsToNeighborsMap[f.b][f.c] = true;
		vertsToNeighborsMap[f.c][f.a] = true;
		vertsToNeighborsMap[f.c][f.b] = true;
	}

	console.log('vtN', vertsToNeighborsMap);

	for (let j = 0; j < 3; j++) {
		for (let i = 0; i < geom.vertices.length; i+=1) {
			const neighbors = Object.keys(vertsToNeighborsMap[i]);
			let avgLen = neighbors.reduce((sum, key) => {
				return sum + geom.vertices[key].length();
			}, 0) / (neighbors.length === 0 ? 1 : neighbors.length);
			console.log(avgLen);
			geom.vertices[i] = geom.vertices[i].normalize().multiplyScalar(avgLen);
		}
	}

	geom.verticesNeedUpdate = true;
	geom.computeVertexNormals();
	return geom;
}

module.exports = {
	generateAsteroid,
}