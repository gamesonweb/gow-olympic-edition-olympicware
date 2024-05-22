const canvas = document.getElementById("galerie"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

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
    light.intensity = 0.7;

    // Creation des etageres
   var cube = BABYLON.MeshBuilder.CreateBox("cube", { size: 0.5, height: 50 }, scene);
    cube.position = new BABYLON.Vector3(-4, 2, 0);
    cube.rotation.z = Math.PI / 2;
    // Set the material of the rectangle
    var material = new BABYLON.StandardMaterial("rectangleMaterial", scene);
    material.diffuseTexture = new BABYLON.Texture("../asset/textures../albedo.png");
    cube.material = material;

    var cube2 = cube.clone("cube2");
    cube2.position = new BABYLON.Vector3(-4, -1, 0);
    const audio = new Audio("../asset/sons/Mouse_click.wav");
    // GUI
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    var button = BABYLON.GUI.Button.CreateSimpleButton("but", "Retour");
        button.width = "150px"
        button.height = "40px";
        button.color = "black";
        button.cornerRadius = 10;
        button.background = "white";
        button.top = "200px"; // Set the position in the y-axis
        advancedTexture.addControl(button);
        button.onPointerUpObservable.add(function () {
            audio.play();
            window.location.href = "../index.html"; // Replace with the URL of your choice 1 page
        });
    // Create an image for Game 1
    var image1 = new BABYLON.GUI.Image("image1", "../asset/galerie/Tennis.png");
    image1.width = "150px";
    image1.height = "150px";
    image1.left = "-600px"; // Position the image on the left
    image1.top = "-280px"; // Position the image on the top
    image1.onPointerUpObservable.add(function() {
        // Code to start Game 1
        window.location.href = "../html/OlympicWare.html#tennis";
    });
    var image1Container = new BABYLON.GUI.Rectangle();
    image1Container.width = "150px";
    image1Container.height = "150px";
    image1Container.thickness = 2;
    image1Container.color = "white";
    image1Container.left = "-600px"; // Position the image on the left
    image1Container.top = "-280px"; // Position the image on the top
    advancedTexture.addControl(image1);
    advancedTexture.addControl(image1Container);

    // Create an image for Game 2
    var image2 = new BABYLON.GUI.Image("image2", "../asset/galerie../arc.png");
    image2.width = "150px";
    image2.height = "150px";
    image2.left = "-400px"; // Position the image next to the first image
    image2.top = "-280px";
    image2.onPointerUpObservable.add(function() {
        // Code to start Game 2
        window.location.href = "../html/OlympicWare.html#arc";
    });
    var image2Container = new BABYLON.GUI.Rectangle();
    image2Container.width = "150px";
    image2Container.height = "150px";
    image2Container.thickness = 2;
    image2Container.color = "white";
    image2Container.left = "-400px"; // Position the image next to the first image
    image2Container.top = "-280px";
    advancedTexture.addControl(image2);
    advancedTexture.addControl(image2Container);

    // Create an image for Game 3
    var image3 = new BABYLON.GUI.Image("image3", "../asset/galerie/Escalade.png");
    image3.width = "150px";
    image3.height = "150px";
    image3.left = "-200px"; // Position the image next to the second image
    image3.top = "-280px";
    image3.onPointerUpObservable.add(function() {
        // Code to start Game 3
        window.location.href = "../html/OlympicWare.html#Escalade";
    });
    var image3Container = new BABYLON.GUI.Rectangle();
    image3Container.width = "150px";
    image3Container.height = "150px";
    image3Container.thickness = 2;
    image3Container.color = "white";
    image3Container.left = "-200px"; // Position the image next to the second image
    image3Container.top = "-280px";
    advancedTexture.addControl(image3);
    advancedTexture.addControl(image3Container);

    // Create an image for Game 4
    var image4 = new BABYLON.GUI.Image("image4", "../asset/galerie/Natation.png");
    image4.width = "150px";
    image4.height = "150px";
    image4.left = "0px"; // Position the image next to the third image
    image4.top = "-280px";
    image4.onPointerUpObservable.add(function() {
        // Code to start Game 4
        window.location.href = "../html/OlympicWare.html#Natation";
    });
    var image4Container = new BABYLON.GUI.Rectangle();
    image4Container.width = "150px";
    image4Container.height = "150px";
    image4Container.thickness = 2;
    image4Container.color = "white";
    image4Container.left = "0px"; // Position the image next to the third image
    image4Container.top = "-280px";
    advancedTexture.addControl(image4);
    advancedTexture.addControl(image4Container);

    // Create an image for Game 5
    var image5 = new BABYLON.GUI.Image("image5", "../asset/galerie/Voile.png");
    image5.width = "150px";
    image5.height = "150px";
    image5.left = "200px"; // Position the image next to the third image
    image5.top = "-280px";
    image5.onPointerUpObservable.add(function() {
        // Code to start Game 5
        window.location.href = "../html/OlympicWare.html#Voile";
    });
    var image5Container = new BABYLON.GUI.Rectangle();
    image5Container.width = "150px";
    image5Container.height = "150px";
    image5Container.thickness = 2;
    image5Container.color = "white";
    image5Container.left = "200px"; // Position the image next to the third image
    image5Container.top = "-280px";
    advancedTexture.addControl(image5);
    advancedTexture.addControl(image5Container);

    // Create an image for Game 6
    var image6 = new BABYLON.GUI.Image("image6", "../asset/galerie/Cyclisme.png");
    image6.width = "150px";
    image6.height = "150px";
    image6.left = "400px"; // Position the image next to the third image
    image6.top = "-280px";
    image6.onPointerUpObservable.add(function() {
        // Code to start Game 6
        window.location.href = "../html/OlympicWare.html#Cyclisme";
    });
    var image6Container = new BABYLON.GUI.Rectangle();
    image6Container.width = "150px";
    image6Container.height = "150px";
    image6Container.thickness = 2;
    image6Container.color = "white";
    image6Container.left = "400px"; // Position the image next to the third image
    image6Container.top = "-280px";
    advancedTexture.addControl(image6);
    advancedTexture.addControl(image6Container);

    // Create an image for Game 7
    var image7 = new BABYLON.GUI.Image("image7", "../asset/galerie/Golf.png");
    image7.width = "150px";
    image7.height = "150px";
    image7.left = "600px"; // Position the image next to the third image
    image7.top = "-280px";
    image7.onPointerUpObservable.add(function() {
        // Code to start Game 7
        window.location.href = "../html/OlympicWare.html#Golf";
    });
    var image7Container = new BABYLON.GUI.Rectangle();
    image7Container.width = "150px";
    image7Container.height = "150px";
    image7Container.thickness = 2;
    image7Container.color = "white";
    image7Container.left = "600px"; // Position the image next to the third image
    image7Container.top = "-280px";
    advancedTexture.addControl(image7);
    advancedTexture.addControl(image7Container);

    // Create an image for Game 8
    var image8 = new BABYLON.GUI.Image("image8", "../asset/galerie/Foot.png");
    image8.width = "150px";
    image8.height = "150px";
    image8.left = "-600px"; // Position the image next to the third image
    image8.top = "-35px";
    image8.onPointerUpObservable.add(function() {
        // Code to start Game 8
        window.location.href = "../html/OlympicWare.html#foot";
    });
    var image8Container = new BABYLON.GUI.Rectangle();
    image8Container.width = "150px";
    image8Container.height = "150px";
    image8Container.thickness = 2;
    image8Container.color = "white";
    image8Container.left = "-600px"; // Position the image next to the third image
    image8Container.top = "-35px";
    advancedTexture.addControl(image8);
    advancedTexture.addControl(image8Container);

    return scene;
};

const scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});
