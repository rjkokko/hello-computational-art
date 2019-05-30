function createGlass(scene: BABYLON.Scene, texture: BABYLON.BaseTexture) {
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

function createMetal(scene: BABYLON.Scene, texture: BABYLON.BaseTexture) {
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

function createPlastic(scene: BABYLON.Scene, color: BABYLON.Color3) {
    var plastic = new BABYLON.StandardMaterial('plastic', scene);

    plastic.diffuseColor = color;
    plastic.specularColor = color;
    // plastic.emissiveColor = color;
    // plastic.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
    // plastic.emissiveColor = new BABYLON.Color3(1, 1, 1);
    // plastic.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);
    return plastic;
}

export { createGlass, createMetal, createMarble, createPlastic };
