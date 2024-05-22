// Mettre un systeme type guitar hero pour le fun du gameplay
var canvas = document.createElement("canvas");
canvas.id = "natation";
const engine = new BABYLON.Engine(canvas, true); // Générer le moteur 3D BABYLON
const hash = window.location.hash;

const createScene = function () {
    const scene = new BABYLON.Scene(engine);

    // Créer et positionner une caméra libre (non-mesh)
    const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
    camera.attachControl(canvas, true);
    camera.inputs.clear(); // Désactiver les contrôles de la caméra
    // Créer une lumière, visant 0,1,0 - vers le ciel (non-mesh)
    const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 1;

    // GUI
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    //Titre du jeu
    var title = new BABYLON.GUI.TextBlock();
    title.text = "Dépasse le nageur !";
    title.color = "white";
    title.fontSize = 68;
    title.top = "-300px"; // Set the position in the y-axis
    advancedTexture.addControl(title);

    // Créer une piscine
    const pool = BABYLON.MeshBuilder.CreateBox("pool", { width: 11.5, height: 0.1, depth: 20 }, scene);
    pool.position.y = -6; // Positionner la piscine en hauteur
    pool.material = new BABYLON.StandardMaterial("poolMaterial", scene);

    // Dupliquer la piscine à droite
    const poolRight = pool.clone("poolRight");
    poolRight.position.x = 5; // Positionner la piscine à droite 
    poolRight.rotation.z = Math.PI / 2; // Tourner la piscine de 180 degrés
    // Dupliquer la piscine à gauche
    const poolLeft = poolRight.clone("poolLeft");
    poolLeft.position.x = -5; // Positionner la piscine à gauche

    const poolUp = pool.clone("poolUp");
    poolUp.position.z = 10.5;
    poolUp.position.y = -10;
    poolUp.rotation.x = Math.PI / 2;

    const poolDown = poolUp.clone("poolDown");
    poolDown.position.z = -10.5;

    // Créer un matériau en marbre
    var marbleMaterial = new BABYLON.StandardMaterial("marble", scene);
    var marbleTexture = new BABYLON.MarbleProceduralTexture("marbleTexture", 512, scene);
    marbleTexture.numberOfTilesHeight = 8;
    marbleTexture.numberOfTilesWidth = 9;
    marbleMaterial.ambientTexture = marbleTexture;
    marbleMaterial.diffuseColor = new BABYLON.Color3(0, 0.5, 1); // Couleur bleue

    pool.material = marbleMaterial;
    poolRight.material = marbleMaterial;
    poolLeft.material = marbleMaterial;
    poolUp.material = marbleMaterial;
    poolDown.material = marbleMaterial;


    // Ajouter de l'eau dans la piscine
    const water = BABYLON.MeshBuilder.CreateBox("water", { width: 9.8, height: 0.9, depth: 19.8 }, scene);
    water.position.y = -0.42; // Positionner l'eau légèrement au-dessus du fond de la piscine
    water.material = new BABYLON.StandardMaterial("waterMaterial", scene);
    water.material.diffuseTexture = new BABYLON.Texture("../asset/textures/waterbump.png", scene); // Ajouter une texture à l'eau
    water.material.alpha = 0.6; // Transparence de l'eau
    water.waterColor = new BABYLON.Color3(0.1, 0.1, 0.6);

    // Créer des rectangles au rebord de la piscine
    const rectangle = BABYLON.MeshBuilder.CreatePlane("rectangle", { width: 10.5, height: 2 }, scene);
    rectangle.position.x = 0;
    rectangle.position.y = 0; // Positionner au rebord de la piscine
    rectangle.position.z = 10;
    rectangle.rotation.x = Math.PI / 2; // Rotation à la verticale
    rectangle.material = new BABYLON.StandardMaterial("rectangleMaterial", scene);
    rectangle.material.diffuseColor = new BABYLON.Color3(1, 1, 1); // Couleur blanche
    // Dupliquer le premier rectangle
    const rectangle2 = rectangle.clone("rectangle2");
    rectangle2.position.z = -10;
    // Dupliquer le premier rectangle à une autre position et rotation
    const rectangle3 = rectangle.clone("rectangle3");
    rectangle3.position.x = -5; // Positionner à gauche de la piscine
    rectangle3.position.y = 0;
    rectangle3.position.z = 0;
    rectangle3.rotation.y = Math.PI / 2; // Rotation à 90 degrés
    rectangle3.scaling = new BABYLON.Vector3(2.1, 1, 1); // Agrandir le rectangle

    // Dupliquer le troisieme rectangle à une autre position 
    const rectangle4 = rectangle3.clone("rectangle4");
    rectangle4.position.x = 5; // Positionner à droite de la piscine


    // Créer des mini sphères rouges sur toute la longueur de la piscine
    const sphereMaterial = new BABYLON.StandardMaterial("sphereMaterial", scene);
    sphereMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0); // Couleur rouge

    const sphereRadius = 0.2; // Rayon des sphères
    const sphereCount = 20; // Nombre de sphères à créer

    for (let i = 0; i < sphereCount; i++) {
        const sphere = BABYLON.MeshBuilder.CreateSphere("sphere" + i, { diameter: sphereRadius * 2 }, scene);
        sphere.position.x = -3; // Positionner les sphères le long de la piscine
        sphere.position.y = 0; // Positionner les sphères légèrement au-dessus du fond de la piscine
        sphere.position.z = -8.5 + (i * (17 / (sphereCount - 1)));
        sphere.material = sphereMaterial;
    }

    // Dupliquer les sphères à droite
    for (let i = 0; i < sphereCount; i++) {
        const sphere = BABYLON.MeshBuilder.CreateSphere("sphereRight" + i, { diameter: sphereRadius * 2 }, scene);
        sphere.position.x = 3; // Positionner les sphères à droite de la piscine
        sphere.position.y = 0; // Positionner les sphères légèrement au-dessus du fond de la piscine
        sphere.position.z = -8.5 + (i * (17 / (sphereCount - 1)));
        sphere.material = sphereMaterial;
    }

    // Dupliquer les sphères au centre
    for (let i = 0; i < sphereCount; i++) {
        const sphere = BABYLON.MeshBuilder.CreateSphere("sphereLeft" + i, { diameter: sphereRadius * 2 }, scene);
        sphere.position.x = 0; // Positionner les sphères au centre de la piscine
        sphere.position.y = 0; // Positionner les sphères légèrement au-dessus du fond de la piscine
        sphere.position.z = -8.5 + (i * (17 / (sphereCount - 1)));
        sphere.material = sphereMaterial;
    }

    // Keyboard events
    var inputMap = {};
    scene.actionManager = new BABYLON.ActionManager(scene);
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));

    // Load hero character and play animation
    BABYLON.SceneLoader.ImportMesh("", "../asset/", "Nageur3.glb", scene, function (newMeshes, particleSystems, skeletons, animationGroups) {
        var swimmer = newMeshes[0];
        swimmer.position = new BABYLON.Vector3(1.5, -1.3, -8.6); // Positionner le nageur au centre de la piscine
        var swimmer2 = swimmer.clone("swimmer2");
        swimmer2.position = new BABYLON.Vector3(-1.5, -1.3, -8.6); // Positionner le nageur à gauche de la piscine
        // Get the specific animation from the animation group
        var wait = scene.getAnimationGroupByName("Wait");
        // Start the animation
        wait.start(true, 1.0, wait.from, wait.to, false);

    // Afficher le message pendant 5 secondes
    setTimeout(function () {
        advancedTexture.removeControl(title); // Supprimer le message
        wait.stop(); // Stop the animation
        // Get the specific animation from the animation group
        var swim2 = scene.getAnimationGroupByName("Swim.001");
        // Start the animation
        swim2.start(true, 1.0, swim2.from, swim2.to, false);
        // Move the swimmer forward during the animation
        scene.registerBeforeRender(function () {
            if (swimmer2.position.z < poolUp.position.z - 3.5 + poolUp.scaling.z / 2 - swimmer2.scaling.z / 2) {
                swimmer2.position.z += 0.02; // Adjust the value to control the speed of movement
            } else {
                swim2.stop(); // Stop the animation when the swimmer reaches the pool
            }
        });
        // Get the specific animation from the animation group
        var swim = scene.getAnimationGroupByName("Swim.001");
        var swimmer = newMeshes[0];
        swimmer.position = new BABYLON.Vector3(1.5, -1.3, -8.6); 

        let isSwimming = false;
        scene.onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
                case BABYLON.KeyboardEventTypes.KEYDOWN:
                    switch (kbInfo.event.key) {
                        case "s":
                            if (!isSwimming) {
                                swim.start(true, 1.0, swim.from, swim.to, false);
                                isSwimming = true;
                            }
                            break;
                    }
                    break;
                case BABYLON.KeyboardEventTypes.KEYUP:
                    switch (kbInfo.event.key) {
                        case "s":
                        case "S":
                            if (isSwimming) {
                                swim.stop();
                                isSwimming = false;
                            }
                            break;
                    }
                    break;
            }
            // Move the swimmer forward during the animation
            scene.registerBeforeRender(function () {
                if (isSwimming) {
                    if (swimmer.position.z < poolUp.position.z - 3.5 + poolUp.scaling.z / 2 - swimmer.scaling.z / 2) {
                        swimmer.position.z += 0.01; // Adjust the value to control the speed of movement
                    }
                }
            });
        });

    }, 5000);
    });



    camera.position = new BABYLON.Vector3(0, 3.5, -15); // Eloigner la caméra de la piscine
    camera.target = water.position; // Cibler la piscine avec la caméra

    return scene;
};

const scene = createScene(); // Appeler la fonction createScene

// Enregistrer une boucle de rendu pour afficher la scène en continu
engine.runRenderLoop(function () {
    scene.render();
});

// Surveiller les événements de redimensionnement du navigateur/canvas
window.addEventListener("resize", function () {
    engine.resize();
});

if (hash.includes('natation')) {
    // Show the canvas
    canvas.style.display = "block";
    // Set the canvas size to match the window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.getElementById('menu').appendChild(canvas);
}