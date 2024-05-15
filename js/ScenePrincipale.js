
const canvas = document.getElementById("perso"); // Obtenir l'élément canvas
const engine = new BABYLON.Engine(canvas, true); // Générer le moteur 3D BABYLON

const createScene = function () {
  // Character animations by Mixamo: https://www.mixamo.com/
  engine.enableOfflineSupport = false;
  const scene = new BABYLON.Scene(engine);
  // Créer la caméra
  const camera = new BABYLON.ArcRotateCamera("camera", 0, 0, 0, new BABYLON.Vector3(0, 0, 0));
  camera.setPosition(new BABYLON.Vector3(0, 1, 7));
  camera.attachControl(canvas, false);
  camera.inputs.clear(); // Disable camera controls

  // Créer la lumière
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.6;
  light.specular = BABYLON.Color3.Black();

  var light2 = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -0.5, -1.0), scene);
  light2.position = new BABYLON.Vector3(0, 5, 5);

  // Créer la skybox
  const skybox = BABYLON.MeshBuilder.CreateBox("skybox", { size: 1000 }, scene);
  const skyboxMaterial = new BABYLON.StandardMaterial("skyboxMaterial", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0.6, 1); // Couleur bleu clair
  skybox.material = skyboxMaterial;

  // Créer le sol
  const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 10, height: 50 }, scene);
  ground.material = new BABYLON.StandardMaterial("groundMaterial", scene);
  ground.material.diffuseColor = new BABYLON.Color3(0.4, 0.2, 0); // Couleur marron

  // Créer les limites de la piste
  for (let i = 0; i < 5; i++) {
    const boundary = BABYLON.MeshBuilder.CreateLines("boundary" + (i + 1), { points: [new BABYLON.Vector3(i - 2, 0, -25), new BABYLON.Vector3(i - 2, 0, 25)], updatable: true }, scene);
    boundary.color = new BABYLON.Color3(1, 1, 1); // Couleur blanche
    boundary.scaling = new BABYLON.Vector3(2, 1, 1); // Augmenter la hauteur de la limite
  }

  // Créer les buissons et les arbres
  for (let i = 0; i < 50; i++) {
    const bush = BABYLON.MeshBuilder.CreateBox("bush" + (i + 1), { size: 0 }, scene);
    bush.position = new BABYLON.Vector3(5.5, 0, i - 24.5);
    bush.material = new BABYLON.StandardMaterial("bushMaterial" + (i + 1), scene);
    bush.material.diffuseColor = new BABYLON.Color3(0, 0.5, 0); // Couleur vert foncé

    const tree = BABYLON.MeshBuilder.CreateCylinder("tree" + (i + 1), { height: 8, diameterTop: 0.8, diameterBottom: 4 }, scene);
    tree.position = new BABYLON.Vector3(7, 0, i - 24.5);
    tree.material = new BABYLON.StandardMaterial("treeMaterial" + (i + 1), scene);
    tree.material.diffuseColor = new BABYLON.Color3(0.5, 0.2, 0); // Couleur marron

    const leaves = BABYLON.MeshBuilder.CreateSphere("leaves" + (i + 1), { diameter: 6 }, scene);
    leaves.position = new BABYLON.Vector3(7, 6, i - 24.5);
    leaves.material = new BABYLON.StandardMaterial("leavesMaterial" + (i + 1), scene);
    leaves.material.diffuseColor = new BABYLON.Color3(0, 0.8, 0); // Couleur verte

    const bush2 = BABYLON.MeshBuilder.CreateBox("bush2" + (i + 1), { size: 0 }, scene);
    bush2.position = new BABYLON.Vector3(-5.5, 0, i - 24.5);
    bush2.material = new BABYLON.StandardMaterial("bushMaterial" + (i + 1), scene);
    bush2.material.diffuseColor = new BABYLON.Color3(0, 0.5, 0); // Couleur vert foncé
  }

  // Load hero character and play animation
  BABYLON.SceneLoader.ImportMesh("", "/asset/import/", "Perso.glb", scene, function (newMeshes, particleSystems, skeletons, animationGroups) {
    var hero = newMeshes[0];

    //Scale the model down        
    hero.scaling.scaleInPlace(1.5);

    //Lock camera on the character 
    camera.target = hero;

    //Get the Run animation Group
    const runAnim = scene.getAnimationGroupByName("Run");

    //Play the Samba animation  
    runAnim.start(true, 1.0, runAnim.from, runAnim.to, false);

  });
  // Animer la scène
  scene.registerBeforeRender(function () {
    // Déplacer le sol
    ground.position.z += 0.05;
    // Déplacer les buissons et les arbres
    for (let i = 0; i < 5; i++) {
      const boundary = scene.getMeshByName("boundary" + (i + 1));
      boundary.position.z += 0.05;

      const bush = scene.getMeshByName("bush" + (i + 1));
      bush.position.z += 0.05;

      const tree = scene.getMeshByName("tree" + (i + 1));
      tree.position.z += 0.05;

      const leaves = scene.getMeshByName("leaves" + (i + 1));
      leaves.position.z += 0.05;

      const bush2 = scene.getMeshByName("bush2" + (i + 1));
      bush2.position.z += 0.05;

      // Réinitialiser la position des objets lorsqu'ils atteignent un certain point
      if (bush.position.z > 1) {
        boundary.position.z = -9.5;
        ground.position.z = -9.5;
        bush.position.z = -9.5;
        tree.position.z = -9.5;
        leaves.position.z = -9.5;
        bush2.position.z = -9.5;
      }
    }
  });

  // Créer les anneaux
  for (let i = 0; i < 5; i++) {
    const ring = BABYLON.MeshBuilder.CreateTorus("ring" + (i + 1), { diameter: 2, thickness: 0.2, tessellation: 32 }, scene);
    ring.position = new BABYLON.Vector3(i - 2, 0.12, 3); // Set the rings in the middle
    ring.rotation.x = Math.PI / 2; // Rotate the ring vertically
    ring.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1); // Make the ring smaller
    ring.material = new BABYLON.StandardMaterial("ringMaterial" + (i + 1), scene);
    if (i === 0) {
      ring.material.diffuseColor = new BABYLON.Color3(0, 0, 1); // Couleur bleue
    } else if (i === 1) {
      ring.material.diffuseColor = new BABYLON.Color3(1, 0, 0); // Couleur rouge
    } else if (i === 2) {
      ring.material.diffuseColor = new BABYLON.Color3(0, 1, 0); // Couleur verte
    } else if (i === 3) {
      ring.material.diffuseColor = new BABYLON.Color3(1, 1, 0); // Couleur jaune
    } else if (i === 4) {
      ring.material.diffuseColor = new BABYLON.Color3(0, 0, 0); // Couleur noire
    }
    // Animer les anneaux
    scene.registerBeforeRender(function () {
      ring.rotation.y += 0.01; // Rotate the ring around the y-axis
    });
  }

  // Au bout de 5 secondes, rediriger vers un site au hasard avec un paramètre aléatoire
  const params = ["arc", "tennis", "natation","golf","foot","escalade","voile","halterophilie "]; // Tableau des paramètres possibles
  const randomParam = params[Math.floor(Math.random() * params.length)]; // Sélectionner un paramètre aléatoire
  let redirectionCounter = 0; // Compteur de redirections

  const redirect = function () {
    if (redirectionCounter < 8) { // Vérifier si le nombre de redirections est inférieur à 8
      window.location.href = "/html/OlympicWare.html#" + randomParam;
      redirectionCounter++;
      console.log("Nombre de redirections: " + redirectionCounter); // Afficher le nombre de redirections
      counterElement.textContent = " Nombre de redirections: " + redirectionCounter;
    }
    else {
      console.log("Nombre de redirections maximum atteint.");
      window.location.href = "/html/OW_Lancement.html";
    }
  };

  //setTimeout(redirect, 5000); // Rediriger après 5 secondes


  // Ajouter un compteur de temps
  let counter = 5;
  const counterElement = document.createElement("div");
  counterElement.style.position = "absolute";
  counterElement.style.top = "10px";
  counterElement.style.right = "10px";
  counterElement.style.fontSize = "24px";
  counterElement.style.color = "white";
  document.body.appendChild(counterElement);

  const countdown = setInterval(function () {
    counter--;
    counterElement.textContent = "Redirection dans " + counter + " secondes";

    if (counter === 0) {
      clearInterval(countdown);
      redirectionCounter++;
      console.log("Nombre de redirections: " + redirectionCounter);
    }
  }, 1000);

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