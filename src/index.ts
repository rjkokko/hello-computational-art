// Get the canvas DOM element
const canvas = document.getElementById(
  "renderCanvas"
) as (HTMLCanvasElement | null);

// Load the 3D engine
const engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true
});
// CreateScene function that creates and return the scene
const createScene = function() {
  const ROW_SIZE = 50;
  const NUMBER_OF_ELEMS = 1000;
  // Create a basic BJS Scene object
  const scene = new BABYLON.Scene(engine);
  //   scene.debugLayer.show();
  // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
  const camera = new BABYLON.FreeCamera(
    "camera1",
    new BABYLON.Vector3(25, (0.5 * NUMBER_OF_ELEMS) / ROW_SIZE, -20),
    scene
  );
  // Target the camera to scene origin
  camera.setTarget(
    new BABYLON.Vector3(25, (0.5 * NUMBER_OF_ELEMS) / ROW_SIZE, 0)
  );
  // Attach the camera to the canvas
  camera.attachControl(canvas as HTMLElement, false);
  // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
  const light = new BABYLON.HemisphericLight(
    "light1",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  for (let j = 0; j < 5; j++) {
    for (let i = 0; i < NUMBER_OF_ELEMS; i++) {
      // Create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
      const sphere = BABYLON.Mesh.CreateSphere(
        "sphere1",
        16,
        1,
        scene,
        false,
        BABYLON.Mesh.FRONTSIDE
      );
      // Move the sphere upward 1/2 of its height
      sphere.position.x = (i % ROW_SIZE) + Math.random() - 0.1;
      sphere.position.y = Math.floor(i / ROW_SIZE) + Math.random() - 0.1;
      sphere.position.z = Math.random() * 2 + 2 * j;

      var mat = new BABYLON.StandardMaterial("mat", scene);
      mat.emissiveTexture = new BABYLON.Texture("grass.png", scene);
      // mat.diffuseColor = new BABYLON.Color3(1, 0, 0);
      mat.diffuseColor = BABYLON.Color3.Random();
      sphere.material = mat;
    }
  }

  // Create a built-in "ground" shape; its constructor takes 6 params : name, width, height, subdivision, scene, updatable
  //   const ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene, false);
  // Return the created scene
  return scene;
};
// call the createScene function
const scene = createScene();
// run the render loop
engine.runRenderLoop(function() {
  scene.render();
});
// the canvas/window resize event handler
window.addEventListener("resize", function() {
  engine.resize();
});
