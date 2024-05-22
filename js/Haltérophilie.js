var canvas = document.createElement("canvas");
canvas.id = "halterophilie";
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
const hash = window.location.hash;

var createScene = function () {

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);
    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 1, 30), scene);
    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());
    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);
    camera.inputs.clear(); // Disable camera controls
    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    
    // Create skybox
    var skybox = BABYLON.MeshBuilder.CreateBox("skybox", { size: 1000 }, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyboxMaterial", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.8, 0); // Light yellow color
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;

    // Create GUI
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    var textBlock = new BABYLON.GUI.TextBlock();
    textBlock.text = "OlympicWare";
    textBlock.color = "white";
    textBlock.fontSize = 40;
    textBlock.fontFamily = "Arial";
    textBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    textBlock.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP; // Change alignment to top
    advancedTexture.addControl(textBlock);
    
    // Create ground
    var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 1000, height: 100 }, scene);
    ground.material = new BABYLON.StandardMaterial("groundMaterial", scene);
    ground.material.diffuseColor = new BABYLON.Color3(0.76, 0.69, 0.57);
    
     // Importer le voilier
     BABYLON.SceneLoader.ImportMesh("", "./asset/", "Halteres.glb", scene, function (newMeshes) {
        var haltere = newMeshes[0];
        haltere.position.y = 1;


        });
    
    
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

if (hash.includes('halterophilie')) {
    // Show the canvas
    canvas.style.display = "block";
    // Set the canvas size to match the window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.getElementById('menu').appendChild(canvas);
  }