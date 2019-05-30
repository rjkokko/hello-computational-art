var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getCurrentIntensity, init } from '../common/sound-analyzer.js';
import { createGlass, createPlastic } from '../common/materials.js';
function drawBox(scene, reflectionTexture, boxSideLength) {
    const glass = createGlass(scene, reflectionTexture);
    glass.reflectivityColor = BABYLON.Color3.Purple();
    glass.albedoColor = BABYLON.Color3.Purple();
    // Ground
    let ground = BABYLON.Mesh.CreateBox('Ground', 1, scene);
    const plastic = createPlastic(scene, new BABYLON.Color3(0.1, 0.1, 0.1));
    plastic.reflectionTexture = reflectionTexture;
    plastic.refractionTexture = reflectionTexture;
    plastic.indexOfRefraction = 0.5;
    ground.scaling = new BABYLON.Vector3(boxSideLength, 1, boxSideLength);
    ground.position.y = 0;
    ground.checkCollisions = true;
    ground.material = plastic;
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 1, restitution: 0 }, scene);
    // Walls
    var border0 = BABYLON.Mesh.CreateBox('border0', 1, scene);
    border0.scaling = new BABYLON.Vector3(1, 10, boxSideLength);
    border0.position.y = 5.0;
    border0.position.x = -boxSideLength / 2;
    border0.checkCollisions = true;
    var border1 = BABYLON.Mesh.CreateBox('border1', 1, scene);
    border1.scaling = new BABYLON.Vector3(1, 10, boxSideLength);
    border1.position.y = 5.0;
    border1.position.x = boxSideLength / 2;
    border1.checkCollisions = true;
    var border2 = BABYLON.Mesh.CreateBox('border2', 1, scene);
    border2.scaling = new BABYLON.Vector3(boxSideLength, 10, 1);
    border2.position.y = 5.0;
    border2.position.z = boxSideLength / 2;
    border2.checkCollisions = true;
    var border3 = BABYLON.Mesh.CreateBox('border3', 1, scene);
    border3.scaling = new BABYLON.Vector3(boxSideLength, 10, 1);
    border3.position.y = 5.0;
    border3.position.z = -boxSideLength / 2;
    border3.checkCollisions = true;
    border0.material = plastic;
    border1.material = plastic;
    border2.material = plastic;
    border3.material = plastic;
    border0.physicsImpostor = new BABYLON.PhysicsImpostor(border0, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);
    border1.physicsImpostor = new BABYLON.PhysicsImpostor(border1, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);
    border2.physicsImpostor = new BABYLON.PhysicsImpostor(border2, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);
    border3.physicsImpostor = new BABYLON.PhysicsImpostor(border3, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);
    return { ground, border0, border1, border2, border3 };
}
function importKeyMesh(scene) {
    return new Promise((resolve, reject) => {
        BABYLON.SceneLoader.ImportMesh('', './static/', 'key.obj', scene, (newMeshes) => {
            const key = newMeshes[1];
            const text = newMeshes[0];
            text.parent = key;
            const keyMat = new BABYLON.StandardMaterial('plastic', scene);
            keyMat.backFaceCulling = false;
            keyMat.diffuseColor = BABYLON.Color3.Black();
            keyMat.specularColor = BABYLON.Color3.Gray();
            key.material = keyMat;
            key.position.x = 0;
            key.position.y = 4;
            key.position.z = 0;
            key.physicsImpostor = new BABYLON.PhysicsImpostor(key, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 100, restitution: 0.03, friction: 1 }, scene);
            resolve(key);
        }, null, (err) => {
            console.error('Reading key mesh failed');
            reject(err);
        });
    });
}
const createScene = function (engine, canvas) {
    return __awaiter(this, void 0, void 0, function* () {
        const ROW_SIZE = 35;
        const NUMBER_OF_ELEMS = 400;
        const NUMBER_OF_LAYERS = 1;
        const BOX_SIDE_LENGTH = 50;
        // Create a basic BJS Scene object
        const scene = new BABYLON.Scene(engine);
        scene.useRightHandedSystem = true;
        const gravity = new BABYLON.Vector3(0, -9.81, 0);
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
        var directionalLight = new BABYLON.DirectionalLight('DirectionalLight', new BABYLON.Vector3(0.25, -1, 0), scene);
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
        const { ground } = drawBox(scene, spaceTexture, BOX_SIDE_LENGTH);
        // keys
        let elements = [];
        // import key.obj
        let keyOriginal = yield importKeyMesh(scene);
        elements.push(keyOriginal);
        for (let j = 0; j < NUMBER_OF_LAYERS; j++) {
            for (let i = 0; i < NUMBER_OF_ELEMS; i++) {
                const key = keyOriginal.clone(`clone-number-${i}`, null);
                if (key) {
                    key.position.x =
                        (i % ROW_SIZE) + Math.random() - 0.1 - ROW_SIZE / 2;
                    key.position.z =
                        Math.floor(i / ROW_SIZE) + Math.random() - 0.1 - 10;
                    // key.position.y = Math.random() * 2 + 2 * j;
                    // key.position.x = i % ROW_SIZE;
                    // key.position.z = Math.floor(i / ROW_SIZE);
                    key.position.y = 2 * j + 3;
                    key.translate(new BABYLON.Vector3(1, 0, 0), 3);
                    // // physics
                    // key.physicsImpostor = new BABYLON.PhysicsImpostor(
                    //     key,
                    //     BABYLON.PhysicsImpostor.BoxImpostor,
                    //     { mass: 1, restitution: 0 },
                    //     scene,
                    // );
                    elements.push(key);
                }
            }
        }
        // Return the created scene
        return { scene, elements, directionalLight, ground };
    });
};
document.querySelector('button').addEventListener('click', function () {
    return __awaiter(this, void 0, void 0, function* () {
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
        const { scene, elements, directionalLight, ground } = yield createScene(engine, canvas);
        // scene.debugLayer.show();
        // showAxis(5, scene);
        // run the render loop
        engine.runRenderLoop(() => {
            // numberOfLoops++;
            // if (numberOfLoops >= 2) {
            //     numberOfLoops = 0;
            const audioIntensity = getCurrentIntensity();
            const bassIntesity = audioIntensity[0];
            const impulseVector = new BABYLON.Vector3(0, bassIntesity / 100, 0);
            elements.forEach((elem) => {
                if (elem.intersectsMesh(ground, true)) {
                    elem.physicsImpostor.applyImpulse(impulseVector, elem.getAbsolutePosition());
                }
                // const position = elem.getAbsolutePosition();
                // if (
                //     position.y <= 1.5 &&
                //     position.y >= 0 &&
                //     Math.abs(position.x) < 25 &&
                //     Math.abs(position.z) < 25
                // ) {
                // }
            });
            // adjust light
            const lightIntesity = (bassIntesity - 100) / 70 / 3;
            directionalLight.diffuse = new BABYLON.Color3(lightIntesity, lightIntesity, lightIntesity);
            scene.render();
        });
    });
});
//# sourceMappingURL=keys.js.map