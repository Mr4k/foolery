let closeRenderTarget;
let orthoCamera;
let orthoScene;

function setup(THREE, width, height) {
    closeRenderTarget = new THREE.WebGLRenderTarget(width, height, {});
    orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
    orthoScene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry( 2, 2 );
    const material = new THREE.MeshBasicMaterial( {
        map: closeRenderTarget.texture,
        alphaMap: closeRenderTarget.texture,
        side: THREE.DoubleSide,
        transparent: true,
    });
    const plane = new THREE.Mesh( geometry, material );
    orthoScene.add(plane);
}

function render(THREE, renderer, scene, originalCamera, distanceToPlayer) {
    // should maybe use it's own renderer and camera and not hijack others
    /*scene.background = new THREE.Color(0x000000);
    originalCamera.near = 0.1;
    originalCamera.far = distanceToPlayer;
    originalCamera.updateProjectionMatrix();
    renderer.render(scene, originalCamera, closeRenderTarget);
    originalCamera.near = distanceToPlayer;
    originalCamera.far = 1000;
    originalCamera.updateProjectionMatrix();
    scene.background = new THREE.Color(0xffffff);*/
    renderer.render(scene, originalCamera);
    /*renderer.autoClear = false;
    renderer.render(orthoScene, orthoCamera);
    renderer.autoClear = true;*/
}

module.exports = {
    setup,
    render,
}
