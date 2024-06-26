const canvas = document.getElementById("start"); // Get the canvas element
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
    light.intensity = 2;
    // Sound
    var sound = new BABYLON.Sound("sound", "./asset/sons/", scene, null, {
        loop: true,
        autoplay: true
    });
    // Import mesh
    //<a href="https://fr.freepik.com/vecteurs-libre/illustration-stade-football-football-plat_13379934.htm#from_view=detail_alsolike">Image de freepik</a>
    BABYLON.SceneLoader.ImportMesh("", "./asset/import/", "Accueil.glb", scene, function (newMeshes) {
        var fond = newMeshes[0];
        fond.position = new BABYLON.Vector3(0, 0, 3.1);
        fond.scaling.x = 3.4;
        fond.scaling.y = 1.7;
    });
    // GUI
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    // Créer les anneaux
    const ring = BABYLON.MeshBuilder.CreateTorus("ring", { diameter: 2, thickness: 0.2, tessellation: 32 }, scene);
    ring.position = new BABYLON.Vector3(-2.8, 3, 3); // Set the ring in the middle
    ring.rotation.x = Math.PI / 2; // Rotate the ring vertically
    ring.scaling = new BABYLON.Vector3(0.6, 0.6, 0.6); // Make the ring smaller
    ring.material = new BABYLON.StandardMaterial("ringMaterial", scene);
    // Animer l'anneau
    scene.registerBeforeRender(function () {
        ring.rotation.y += 0.01; // Faire tourner l'anneau autour de l'axe y
        // Changer la couleur de l'anneau en fonction de son angle de rotation
        if (ring.rotation.y < Math.PI / 5) {
            ring.material.diffuseColor = new BABYLON.Color3(0, 0, 1); // Blue
        } else if (ring.rotation.y < (2 * Math.PI) / 5) {
            ring.material.diffuseColor = new BABYLON.Color3(1, 1, 0); // Yellow
        } else if (ring.rotation.y < (3 * Math.PI) / 5) {
            ring.material.diffuseColor = new BABYLON.Color3(0, 0, 0); // Black
        } else if (ring.rotation.y < (3 * Math.PI) / 5) {
            ring.material.diffuseColor = new BABYLON.Color3(0, 1, 0); // Green
        } else {
            ring.material.diffuseColor = new BABYLON.Color3(1, 0, 0); // Red
        }
        if (ring.rotation.y >= 2 * Math.PI) {
            ring.rotation.y = 0; // Recommencer la rotation de l'anneau à 0
        }
    });

    //Titre du jeu
    var title = new BABYLON.GUI.TextBlock();
    title.text = "lympicWare";
    title.color = "green";
    title.fontSize = 68;
    title.top = "-300px"; // Set the position in the y-axis
    advancedTexture.addControl(title);
    const audio = new Audio("./asset/sons/Mouse_click.wav");
    //Bouton Démarrer
    var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Commencer");
    button1.width = "150px"
    button1.height = "40px";
    button1.color = "white";
    button1.cornerRadius = 10;
    button1.background = "blue";
    button1.onPointerUpObservable.add(function () {
        audio.play();
        advancedTexture.removeControl(button1);
        var button2 = BABYLON.GUI.Button.CreateSimpleButton("but2", "Classique");
        button2.width = "150px"
        button2.height = "40px";
        button2.color = "white";
        button2.cornerRadius = 10;
        button2.background = "red";
        button2.top = "100px"; // Set the position in the y-axis
        button2.left = "-150px"; // Set the position in the x-axis
        advancedTexture.addControl(button2);

        var button3 = BABYLON.GUI.Button.CreateSimpleButton("but3", "Galerie");
        button3.width = "150px"
        button3.height = "40px";
        button3.color = "white";
        button3.cornerRadius = 10;
        button3.background = "green";
        button3.top = "100px"; // Set the position in the y-axis
        button3.left = "150px"; // Set the position in the x-axis
        advancedTexture.addControl(button3);

        button2.onPointerUpObservable.add(function () {
            audio.play();
            window.location.href = "./html/OW_ScenePrincipale.html"; // Replace with the URL of your choice 1 page
        });

        button3.onPointerUpObservable.add(function () {
            audio.play();
            window.location.href = "./html/OW_Galerie.html"; // Replace with the URL of your choice 2 page
        });

        var button4 = BABYLON.GUI.Button.CreateSimpleButton("but4", "Retour");
        button4.width = "150px"
        button4.height = "40px";
        button4.color = "white";
        button4.cornerRadius = 10;
        button4.background = "black";
        button4.top = "200px"; // Set the position in the y-axis
        advancedTexture.addControl(button4);

        button4.onPointerUpObservable.add(function () {
            audio.play();
            advancedTexture.removeControl(button2);
            advancedTexture.removeControl(button3);
            advancedTexture.addControl(button1);
            advancedTexture.removeControl(button4);
        });
    });

    advancedTexture.addControl(button1);



    return scene;

};

const scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    engine.resize();
});

// Initial resize to ensure the canvas fits the screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;