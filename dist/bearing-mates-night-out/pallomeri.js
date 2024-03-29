import { init, getCurrentBassIntesity, } from '../common/sound-analyzer.js';
import { createMetal, createGlass } from '../common/materials.js';
const createScene = function (engine, canvas) {
    const ROW_SIZE = 35;
    const NUMBER_OF_ELEMS = 800;
    const NUMBER_OF_LAYERS = 1;
    const BOX_SIDE_LENGTH = 50;
    // Create a basic BJS Scene object
    const scene = new BABYLON.Scene(engine);
    scene.enablePhysics(null, new BABYLON.OimoJSPlugin());
    const camera = new BABYLON.UniversalCamera('UniversalCamera', new BABYLON.Vector3(0, 20, 0), scene);
    // Target the camera to scene origin
    const center = new BABYLON.Vector3(0, 0, 0);
    const cameraTarget = new BABYLON.Vector3(25, 5, 25);
    camera.setTarget(cameraTarget);
    // Attach the camera to the canvas
    camera.attachControl(canvas, false);
    //   Create a basic light, aiming 0, 1, 0 - meaning, to the sky
    const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
    const hdrTexture = new BABYLON.HDRCubeTexture('../bearing-mates-night-out/static/night.hdr', scene, 512);
    var hdrSkybox = BABYLON.Mesh.CreateBox('hdrSkyBox', 1000.0, scene);
    hdrSkybox.isPickable = false;
    var hdrSkyboxMaterial = new BABYLON.PBRMaterial('skyBox', scene);
    hdrSkyboxMaterial.backFaceCulling = false;
    hdrSkyboxMaterial.reflectionTexture = hdrTexture.clone();
    hdrSkyboxMaterial.reflectionTexture.coordinatesMode =
        BABYLON.Texture.SKYBOX_MODE;
    hdrSkyboxMaterial.microSurface = 1.0;
    hdrSkyboxMaterial.disableLighting = true;
    hdrSkybox.material = hdrSkyboxMaterial;
    hdrSkybox.infiniteDistance = true;
    const glass = createGlass(scene, hdrTexture);
    // Ground
    let ground = BABYLON.Mesh.CreateBox('Ground', 1, scene);
    ground.scaling = new BABYLON.Vector3(BOX_SIDE_LENGTH, 1, BOX_SIDE_LENGTH);
    ground.position.y = 0;
    ground.checkCollisions = true;
    ground.material = glass;
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 1, restitution: 0 }, scene);
    // Walls
    var border0 = BABYLON.Mesh.CreateBox('border0', 1, scene);
    border0.scaling = new BABYLON.Vector3(1, 10, BOX_SIDE_LENGTH);
    border0.position.y = 5.0;
    border0.position.x = -BOX_SIDE_LENGTH / 2;
    border0.checkCollisions = true;
    var border1 = BABYLON.Mesh.CreateBox('border1', 1, scene);
    border1.scaling = new BABYLON.Vector3(1, 10, BOX_SIDE_LENGTH);
    border1.position.y = 5.0;
    border1.position.x = BOX_SIDE_LENGTH / 2;
    border1.checkCollisions = true;
    var border2 = BABYLON.Mesh.CreateBox('border2', 1, scene);
    border2.scaling = new BABYLON.Vector3(BOX_SIDE_LENGTH, 10, 1);
    border2.position.y = 5.0;
    border2.position.z = BOX_SIDE_LENGTH / 2;
    border2.checkCollisions = true;
    var border3 = BABYLON.Mesh.CreateBox('border3', 1, scene);
    border3.scaling = new BABYLON.Vector3(BOX_SIDE_LENGTH, 10, 1);
    border3.position.y = 5.0;
    border3.position.z = -BOX_SIDE_LENGTH / 2;
    border3.checkCollisions = true;
    border0.material = glass;
    border1.material = glass;
    border2.material = glass;
    border3.material = glass;
    border0.physicsImpostor = new BABYLON.PhysicsImpostor(border0, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);
    border1.physicsImpostor = new BABYLON.PhysicsImpostor(border1, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);
    border2.physicsImpostor = new BABYLON.PhysicsImpostor(border2, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);
    border3.physicsImpostor = new BABYLON.PhysicsImpostor(border3, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);
    // Spheres
    let elements = [];
    const metal = createMetal(scene, hdrTexture);
    for (let j = 0; j < NUMBER_OF_LAYERS; j++) {
        for (let i = 0; i < NUMBER_OF_ELEMS; i++) {
            const sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 1, scene, false, BABYLON.Mesh.FRONTSIDE);
            sphere.position.x =
                (i % ROW_SIZE) + Math.random() - 0.1 - ROW_SIZE / 2;
            sphere.position.z =
                Math.floor(i / ROW_SIZE) + Math.random() - 0.1 - 10;
            // sphere.position.y = Math.random() * 2 + 2 * j;
            // sphere.position.x = i % ROW_SIZE;
            // sphere.position.z = Math.floor(i / ROW_SIZE);
            sphere.position.y = 2 * j + 3;
            sphere.material = metal;
            sphere.translate(new BABYLON.Vector3(1, 0, 0), 3);
            // physics
            sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0 }, scene);
            elements.push(sphere);
        }
    }
    // Return the created scene
    return { scene, elements };
};
document.querySelector('button').addEventListener('click', function () {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth || 1600;
    canvas.height = window.innerHeight || 900;
    canvas.id = 'renderCanvas';
    document.querySelector('#lander').replaceWith(canvas);
    // the canvas/window resize event handler
    const engine = new BABYLON.Engine(canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true,
    });
    window.addEventListener('resize', function () {
        engine.resize();
    });
    init();
    const { scene, elements } = createScene(engine, canvas);
    // scene.debugLayer.show();
    // showAxis(5, scene);
    // run the render loop
    engine.runRenderLoop(() => {
        // numberOfLoops++;
        // if (numberOfLoops >= 2) {
        //     numberOfLoops = 0;
        const impulseVector = new BABYLON.Vector3(0, getCurrentBassIntesity() / 10, 0);
        elements.forEach((elem) => {
            const position = elem.getAbsolutePosition();
            if (position.y <= 1 &&
                position.y >= 0 &&
                position.x < 25 &&
                position.x > -25 &&
                position.z < 25 &&
                position.z > -25) {
                elem.physicsImpostor.applyImpulse(impulseVector, position);
            }
        });
        // }
        scene.render();
    });
});
//# sourceMappingURL=pallomeri.js.map