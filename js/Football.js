var canvas = document.createElement("canvas");
canvas.id = "foot";
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
const hash = window.location.hash; // Declare the hash variable and assign it the value of the URL anchor

var createScene = function () {

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);
    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 6, 58), scene);
    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());
    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);
    camera.inputs.clear(); // Disable camera controls
    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // Create a skybox
    var skyboxMaterial = new BABYLON.StandardMaterial("skyboxMaterial", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.Texture("../asset/textures/TropicalSunnyDay_nz.jpg", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

    var skybox = BABYLON.MeshBuilder.CreateBox("skybox", { size: 1000 }, scene);
    skybox.material = skyboxMaterial;

    // Create a ground mesh
    var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene);
    // Apply a material to the ground
    var grassMaterial = new BABYLON.StandardMaterial("bawl", scene);
    var grassTexture = new BABYLON.GrassProceduralTexture("textbawl", 256, scene);
    grassMaterial.ambientTexture = grassTexture;
    ground.material = grassMaterial;

    // Création de la cage de foot
    var cylinder1 = BABYLON.MeshBuilder.CreateCylinder("cylinder1", { height: 30, diameter: 1.5 }, scene);
    cylinder1.position = new BABYLON.Vector3(-23, 5, -10);
    cylinder1.material = new BABYLON.StandardMaterial("cylinder1Material", scene);
    cylinder1.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
    var cylinder2 = BABYLON.MeshBuilder.CreateCylinder("cylinder2", { height: 30, diameter: 1.5 }, scene);
    cylinder2.position = new BABYLON.Vector3(23, 5, -10);
    cylinder2.material = new BABYLON.StandardMaterial("cylinder2Material", scene);
    cylinder2.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
    var cylinder3 = BABYLON.MeshBuilder.CreateCylinder("cylinder3", { height: 47, diameter: 1.5 }, scene);
    cylinder3.position = new BABYLON.Vector3(0, 20, -10);
    cylinder3.rotation.z = Math.PI / 2;
    cylinder3.material = new BABYLON.StandardMaterial("cylinder3Material", scene);
    cylinder3.material.diffuseColor = new BABYLON.Color3(1, 1, 1);

    // Create a grid material
    var grid = new BABYLON.GridMaterial("grid", scene);
    grid.gridRatio = 0.2;
    grid.mainColor = new BABYLON.Color3(1, 1, 1);
    grid.lineColor = new BABYLON.Color3(1, 1, 1);
    grid.opacity = 0.9;
    const plane = BABYLON.MeshBuilder.CreatePlane("plane", {height:45, width: 51, sideOrientation: BABYLON.Mesh.DOUBLESIDE});
    plane.material = grid;
    plane.position.z = -20;

    
    // Importer le ballon de foot
    BABYLON.SceneLoader.ImportMesh("", "../asset/import/", "Ballon.glb", scene, function (newMeshes) {
        var ballon = newMeshes[0];
        ballon.position = new BABYLON.Vector3(0, 1, 40);
        ballon.isPickable = true;

        // Animation du ballon
        scene.onPointerDown = function(evt, pickResult) {
            console.log(pickResult.pickedMesh.name);
            //Nom de l'objet ballon
            if(pickResult.pickedMesh.name == "Solid.001_primitive0" || pickResult.pickedMesh.name == "Solid.001_primitive1"){
            console.log(pickResult.pickedMesh.name);
        
            // Dessiner une ligne qui sera la direction du ballon
            var directionLine = BABYLON.MeshBuilder.CreateLines("directionLine", {points: [ballon.position, new BABYLON.Vector3(0, 0, 0)]}, scene);
            directionLine.color = new BABYLON.Color3(1, 0, 0);
            // Animate the direction line
            // Create an animation for rotating the direction line
            var animationLine = new BABYLON.Animation("animationLine", "rotation", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
            var keys = [];
            keys.push({
                frame: 0,
                value: new BABYLON.Vector3(0, 2, 30)
            });
            keys.push({
                frame: 100,
                value: new BABYLON.Vector3(0, 4, 30)
            });
            animationLine.setKeys(keys);
            directionLine.animations = [];
            directionLine.animations.push(animationLine);

            // Set the initial position of the direction line to the ballon position
            directionLine.position = ballon.position;
            scene.beginAnimation(directionLine, 0, 100, true);
        
        }}  
    });

    //Importer le goal
    BABYLON.SceneLoader.ImportMesh("", "../asset/import/", "Goal.glb", scene, function (newMeshes) {
        var goal = newMeshes[0];
        goal.position = new BABYLON.Vector3(0, 0, -10);
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

if (hash.includes('foot')) {
    // Show the canvas
    canvas.style.display = "block";
    // Set the canvas size to match the window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.getElementById('menu').appendChild(canvas);

}