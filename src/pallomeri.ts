import { getCurrentIntensity, init } from './sound-analyzer.js';

// Get the canvas DOM element
const canvas = document.getElementById(
    'renderCanvas',
) as (HTMLCanvasElement | null);

// Load the 3D engine
const engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
});
// CreateScene function that creates and return the scene
const createScene = function() {
    const ROW_SIZE = 35;
    const NUMBER_OF_ELEMS = 800;
    const NUMBER_OF_LAYERS = 2;
    // Create a basic BJS Scene object
    const scene = new BABYLON.Scene(engine);
    scene.enablePhysics(null, new BABYLON.OimoJSPlugin());

    //   scene.debugLayer.show();
    // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
    const camera = new BABYLON.FreeCamera(
        'camera1',
        new BABYLON.Vector3(18, 20, (0.5 * NUMBER_OF_ELEMS) / ROW_SIZE),
        scene,
    );
    // Target the camera to scene origin
    const center = new BABYLON.Vector3(
        18,
        0,
        (0.5 * NUMBER_OF_ELEMS) / ROW_SIZE,
    );
    camera.setTarget(center);
    // Attach the camera to the canvas
    camera.attachControl(canvas as HTMLElement, false);
    //   Create a basic light, aiming 0, 1, 0 - meaning, to the sky
    const light = new BABYLON.HemisphericLight(
        'light1',
        new BABYLON.Vector3(3, 1, -1),
        scene,
    );

    const groundMaterial = new BABYLON.StandardMaterial('mat', scene);
    groundMaterial.emissiveTexture = new BABYLON.Texture('grass.png', scene);
    groundMaterial.diffuseColor = BABYLON.Color3.White();
    // Ground
    let ground = BABYLON.Mesh.CreateBox('Ground', 1, scene);
    ground.scaling = new BABYLON.Vector3(100, 1, 100);
    ground.position.y = 0;
    ground.checkCollisions = true;
    ground.material = groundMaterial;

    ground.physicsImpostor = new BABYLON.PhysicsImpostor(
        ground,
        BABYLON.PhysicsImpostor.BoxImpostor,
        { mass: 0, friction: 0.5, restitution: 0.7 },
        scene,
    );
    let elements: BABYLON.Mesh[] = [];
    for (let j = 0; j < NUMBER_OF_LAYERS; j++) {
        for (let i = 0; i < NUMBER_OF_ELEMS; i++) {
            // Create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
            const sphere = BABYLON.Mesh.CreateSphere(
                'sphere1',
                16,
                1,
                scene,
                false,
                BABYLON.Mesh.FRONTSIDE,
            );
            sphere.position.x = (i % ROW_SIZE) + Math.random() - 0.1;
            sphere.position.z = Math.floor(i / ROW_SIZE) + Math.random() - 0.1;
            sphere.position.y = Math.random() * 2 + 2 * j;

            const mat = new BABYLON.StandardMaterial('mat', scene);
            mat.emissiveTexture = new BABYLON.Texture('grass.png', scene);
            mat.diffuseColor = BABYLON.Color3.Random();
            sphere.material = mat;

            // physics
            sphere.physicsImpostor = new BABYLON.PhysicsImpostor(
                sphere,
                BABYLON.PhysicsImpostor.SphereImpostor,
                { mass: 1, restitution: 0.1 },
                scene,
            );

            elements.push(sphere);
        }
    }

    // Create a built-in "ground" shape; its constructor takes 6 params : name, width, height, subdivision, scene, updatable
    //   const ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene, false);
    // Return the created scene
    return { scene, elements };
};

document.querySelector('button')!.addEventListener('click', function() {
    this.hidden = true;
    init();
    const { scene, elements } = createScene();
    let numberOfLoops = 0;
    // run the render loop
    engine.runRenderLoop(() => {
        numberOfLoops++;
        if (numberOfLoops >= 2) {
            numberOfLoops = 0;
            const audioIntensity = getCurrentIntensity();
            const bassIntesity =
                (audioIntensity[0] + audioIntensity[1] + audioIntensity[2]) / 3;
            const impulseVector = new BABYLON.Vector3(
                0,
                (bassIntesity * 3) / 100,
                0,
            );
            elements.forEach((elem) => {
                const position = elem.getAbsolutePosition();
                if (position.y <= 1) {
                    elem.physicsImpostor!.applyImpulse(impulseVector, position);
                }
            });
        }

        scene.render();
    });
});
// call the createScene function

// setTimeout(() => {
//   const impulseVector = new BABYLON.Vector3(0, 10, 0);
//   elements.forEach((elem) => {
//   elem.physicsImpostor.applyImpulse(
//     impulseVector,
//     elem.getAbsolutePosition()
// })
// )}, 1000);

// the canvas/window resize event handler
window.addEventListener('resize', function() {
    engine.resize();
});
