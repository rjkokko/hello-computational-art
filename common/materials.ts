function createGlass(scene: BABYLON.Scene, texture: BABYLON.HDRCubeTexture) {
    const glass = new BABYLON.PBRMaterial('glass', scene);

    glass.reflectionTexture = texture;
    glass.refractionTexture = texture;
    glass.linkRefractionWithTransparency = true;
    glass.indexOfRefraction = 0.52;
    glass.alpha = 0;
    glass.microSurface = 1;
    glass.reflectivityColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    glass.albedoColor = new BABYLON.Color3(0.85, 0.85, 0.85);
    return glass;
}

function createMetal(scene: BABYLON.Scene, texture: BABYLON.HDRCubeTexture) {
    var metal = new BABYLON.PBRMaterial('metal', scene);
    metal.reflectionTexture = texture;
    metal.microSurface = 0.96;
    metal.reflectivityColor = new BABYLON.Color3(0.85, 0.85, 0.85);
    metal.albedoColor = new BABYLON.Color3(0.01, 0.01, 0.01);
    return metal;
}
function createMarble(scene: BABYLON.Scene) {
    const mat = new BABYLON.StandardMaterial('mat', scene);
    mat.emissiveTexture = new BABYLON.Texture('grass.png', scene);
    mat.diffuseColor = BABYLON.Color3.Yellow();
    return mat;
}
export { createGlass, createMetal, createMarble };
