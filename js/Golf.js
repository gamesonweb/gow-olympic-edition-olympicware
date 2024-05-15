var canvas = document.createElement("canvas");
canvas.id = "golf";
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
const hash = window.location.hash;

var createScene = function () {

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());
    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);
    camera.inputs.clear(); // Disable camera controls
    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 1.4;

    // Dessiner le terrain de golf
    var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene);
    // Apply a material to the ground
	var grassMaterial = new BABYLON.StandardMaterial("bawl", scene);
    var grassTexture = new BABYLON.GrassProceduralTexture("textbawl", 256, scene);
    grassMaterial.ambientTexture = grassTexture;
    ground.material = grassMaterial;

    // Dessiner la balle de golf
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene);
    // Apply a material to the sphere
    var sphereMaterial = new BABYLON.StandardMaterial("sphereMaterial", scene);
    sphereMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
    sphere.material = sphereMaterial;
    sphere.position.y = 0.4;
    sphere.position.z = -40;

    // Dessiner le trou
    var ellipse = BABYLON.MeshBuilder.CreateDisc("ellipse", { radius: 4, tessellation: 64 }, scene);
    // Apply a material to the ellipse
    var ellipseMaterial = new BABYLON.StandardMaterial("ellipseMaterial", scene);
    ellipseMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    ellipse.material = ellipseMaterial;
    ellipse.position.y = 1;
    ellipse.rotation.x = Math.PI / 2;
    ellipse.position.x = 20;
    ellipse.position.z = 20;

    // Dessiner le bâton
    var stick = BABYLON.MeshBuilder.CreateCylinder("stick", { height: 24, diameterTop: 0.6, diameterBottom: 0.6 }, scene);
    // Apply a material to the stick
    var stickMaterial = new BABYLON.StandardMaterial("stickMaterial", scene);
    stickMaterial.diffuseColor.diffuseColor = new BABYLON.Color3(0, 0, 0);
    stick.material = stickMaterial;
    stick.position.y = 17;
    stick.position.z = 0;
    stick.position.x = 15;

    // Dessiner un triangle
    const triangle = BABYLON.MeshBuilder.CreateDisc("disc", {tessellation: 3,radius:6});    // Appliquer un matériau au cercle
    var triangleMaterial = new BABYLON.StandardMaterial("circleMaterial", scene);
    triangleMaterial.diffuseColor = new BABYLON.Color3(1, 0.5, 0.5);
    triangle.material = triangleMaterial;
    triangle.position.y = 23.4;
    triangle.position.x = 18.3; 

// Animate the ball on click
canvas.addEventListener("click", function(event) {
    // Get the coordinates of the click
    var pickResult = scene.pick(event.clientX, event.clientY);
    var destination = pickResult.pickedPoint;

    // Animate the ball to the clicked position
    BABYLON.Animation.CreateAndStartAnimation("anim", sphere, "position", 60, 120, sphere.position, destination, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

    // Check if the ball touches the ellipse
    if (sphere.intersectsMesh(ellipse, false)) {
        sphere.position.y = -3;
    }
});


    camera.position = new BABYLON.Vector3(0, 20, -75); // Eloigner la caméra du terrain
    camera.target = ground.position;

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

if (hash.includes('golf')) {
    // Show the canvas
    canvas.style.display = "block";
    // Set the canvas size to match the window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.getElementById('menu').appendChild(canvas);
  }