document.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash;

    if (hash.includes('escalade')) {
        var canvas = document.createElement("canvas");
        canvas.id = "escalade";
        const engine = new BABYLON.Engine(canvas, true);

var createScene = function () {

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);
    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 1, 16), scene);
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
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0.5, 0.9); // Light yellow color
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
    
    // Create ground
    var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 1000, height: 100 }, scene);
    ground.material = new BABYLON.StandardMaterial("groundMaterial", scene);
    ground.material.diffuseColor = new BABYLON.Color3(0.76, 0.69, 0.57);
    ground.material.backFaceCulling = false;
    
    // Create climbing wall
    var wall = BABYLON.MeshBuilder.CreateBox("wall", { width: 20, height: 100, depth: 1 }, scene);
    wall.position = new BABYLON.Vector3(0, 50, 0);
    wall.material = new BABYLON.StandardMaterial("wallMaterial", scene);
    wall.material.diffuseColor = new BABYLON.Color3(1, 0.5, 0.5);

    // Create climbing holds
    for (let i = 0; i < 55; i++) {
        var hold = BABYLON.MeshBuilder.CreateBox("hold" + i, { width: 2, height: 1, depth: 2 }, scene);
        hold.position = new BABYLON.Vector3(Math.random() * 16 - 9, Math.random() * 90 + 8, 0);
        hold.material = new BABYLON.StandardMaterial("holdMaterial" + i, scene);
        hold.material.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
    }

// Animer la scène
scene.registerBeforeRender(function () {
    camera.position.y += 0.1; // Move the camera up along the y-axis
    if (camera.position.y >= wall.position.y *2) {
        engine.stopRenderLoop();
    }
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

    // Show the canvas
    canvas.style.display = "block";
    // Set the canvas size to match the window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.getElementById('menu').appendChild(canvas);
  }
});