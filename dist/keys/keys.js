import { getCurrentIntensity, init } from '../common/sound-analyzer.js';
import { createGlass, createPlastic, } from '../common/materials.js';
const createScene = function (engine, canvas) {
    const ROW_SIZE = 35;
    const NUMBER_OF_ELEMS = 800;
    const NUMBER_OF_LAYERS = 1;
    const BOX_SIDE_LENGTH = 50;
    // Create a basic BJS Scene object
    const scene = new BABYLON.Scene(engine);
    const gravity = new BABYLON.Vector3(0, -4, 0);
    scene.enablePhysics(gravity, new BABYLON.OimoJSPlugin());
    const camera = new BABYLON.UniversalCamera('UniversalCamera', new BABYLON.Vector3(-40, 30, -40), scene);
    // Target the camera to scene origin
    const center = new BABYLON.Vector3(0, 0, 0);
    const cameraTarget = center;
    camera.setTarget(cameraTarget);
    // Attach the camera to the canvas
    camera.attachControl(canvas, false);
    //   Create a basic light, aiming 0, 1, 0 - meaning, to the sky
    const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
    var directionalLight = new BABYLON.DirectionalLight('DirectionalLight', new BABYLON.Vector3(0, -1, 0), scene);
    var skybox = BABYLON.MeshBuilder.CreateBox('skyBox', { size: 1000.0 }, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial('skyBox', scene);
    skyboxMaterial.backFaceCulling = false;
    var files = [
        './static/skybox/space_left.jpg',
        './static/skybox/space_up.jpg',
        './static/skybox/space_front.jpg',
        './static/skybox/space_right.jpg',
        './static/skybox/space_down.jpg',
        './static/skybox/space_back.jpg',
    ];
    let spaceTexture = BABYLON.CubeTexture.CreateFromImages(files, scene);
    skyboxMaterial.reflectionTexture = spaceTexture;
    skyboxMaterial.reflectionTexture.coordinatesMode =
        BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
    const glass = createGlass(scene, spaceTexture);
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
    // keys
    let elements = [];
    const plastic = createPlastic(scene);
    for (let j = 0; j < NUMBER_OF_LAYERS; j++) {
        for (let i = 0; i < NUMBER_OF_ELEMS; i++) {
            const key = BABYLON.Mesh.CreateBox('key', 1, scene, false, BABYLON.Mesh.FRONTSIDE);
            key.position.x =
                (i % ROW_SIZE) + Math.random() - 0.1 - ROW_SIZE / 2;
            key.position.z =
                Math.floor(i / ROW_SIZE) + Math.random() - 0.1 - 10;
            // key.position.y = Math.random() * 2 + 2 * j;
            // key.position.x = i % ROW_SIZE;
            // key.position.z = Math.floor(i / ROW_SIZE);
            key.position.y = 2 * j + 3;
            key.material = plastic;
            key.translate(new BABYLON.Vector3(1, 0, 0), 3);
            // physics
            key.physicsImpostor = new BABYLON.PhysicsImpostor(key, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0 }, scene);
            elements.push(key);
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
        const audioIntensity = getCurrentIntensity();
        const bassIntesity = (audioIntensity[0] + audioIntensity[1] + audioIntensity[2]) / 3;
        const impulseVector = new BABYLON.Vector3(0, (bassIntesity * 3) / 100, 0);
        elements.forEach((elem) => {
            const position = elem.getAbsolutePosition();
            if (position.y <= 1 &&
                position.y >= 0 &&
                Math.abs(position.x) < 25 &&
                Math.abs(position.z) < 25) {
                elem.physicsImpostor.applyImpulse(impulseVector, position);
            }
        });
        // }
        scene.render();
    });
});
//# sourceMappingURL=keys.js.map