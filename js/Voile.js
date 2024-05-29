document.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash;

    if (hash.includes('voile')) {
        var canvas = document.createElement("canvas");
        canvas.id = "voile";
        const engine = new BABYLON.Engine(canvas, true);
var createScene = function () {

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);
    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 15, 70), scene);
    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);
    camera.inputs.clear(); // Disable camera controls
    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // Skybox
    var skybox = BABYLON.MeshBuilder.CreateBox("skybox", { size: 1000 }, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyboxMaterial", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.Texture("../asset/textures/TropicalSunnyDay_nz.jpg", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;

    // Ajouter de l'eau dans la piscine
    const water = BABYLON.MeshBuilder.CreateBox("water", { width: 900, height: 1, depth: 900 }, scene);
    water.position.y = -0.42; // Positionner l'eau légèrement au-dessus du fond de la piscine
    water.material = new BABYLON.StandardMaterial("waterMaterial", scene);
    water.material.diffuseTexture = new BABYLON.Texture("../asset/textures/waterbump.png", scene); // Ajouter une texture à l'eau
    water.material.alpha = 0.4; // Transparence de l'eau
    water.waterColor = new BABYLON.Color3(0, 0, 221 / 255);
    water.windForce = -10;
    water.waveHeight = 1.7;
    water.bumpHeight = 0.1;
    water.windDirection = new BABYLON.Vector2(1, 1);

    // Keyboard events
    var inputMap = {};
    scene.actionManager = new BABYLON.ActionManager(scene);
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));

    // Importer le voilier
    BABYLON.SceneLoader.ImportMesh("", "../asset/", "Voilier.glb", scene, function (newMeshes) {
        var voilier = newMeshes[0];
        voilier.position = new BABYLON.Vector3(0, 1.2, 45);
        scene.registerBeforeRender(function () {
            voilier.position.z -= 0.1;
            camera.position.z += voilier.position.z - camera.position.z + 20;

        });

        // Generate cylinders
        const numCylinders = 10;

        for (let i = 0; i < numCylinders; i++) {
            // Create cylinder
            const cylinder = BABYLON.MeshBuilder.CreateCylinder("cylinder" + i, { height: 10, diameter: 5 }, scene);
            cylinder.rotation.z = Math.PI / 2;
            cylinder.position.x = Math.random() * 70 - 30; // Random x position between -40 and 40
            cylinder.position.z = Math.random() * 80 - 40; // Random z position between -40 and 40
            cylinder.material = new BABYLON.StandardMaterial("cylinderMaterial", scene);
            cylinder.material.diffuseTexture = new BABYLON.Texture("../asset/textures/albedo.png", scene); // Set cylinder texture to bois.jpg
        }

        // Keyboard events
        scene.onKeyboardObservable.add((kbInfo) => {
            if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN) {
                if (kbInfo.event.key === "ArrowLeft") {
                    voilier.position.x += 0.5;
                }
                if (kbInfo.event.key === "ArrowRight") {
                    voilier.position.x -= 0.5;
                }
            }

        });
        camera.target = voilier.position; // Faire en sorte que la caméra regarde l'eau

    });

    //camera.target = water.position; // Faire en sorte que la caméra regarde l'eau
    return scene;
}

const scene = createScene(); // Appeler la fonction createScene
// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});

    // Show the canvas
    canvas.style.display = "block";
    // Set the canvas size to match the window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.getElementById('menu').appendChild(canvas);
} 
});