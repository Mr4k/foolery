const phys = require('./physics.js');
const geom = require('./geometry/triangle.js');

const asteroid = require('./game/asteroid.js');
const orientationController = require('./controllers/OrientationController');

module.exports = {
	phys,
	geom,
	asteroid,
	orientationController,
}