document.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash;

  if (hash.includes('cyclisme')) {
      var canvas = document.createElement("canvas");
      canvas.id = "cyclisme";
      const engine = new BABYLON.Engine(canvas, true);
const createScene = function () {
  engine.enableOfflineSupport = false;
  const scene = new BABYLON.Scene(engine);
  // Créer la camÃ©ra
  const camera = new BABYLON.ArcRotateCamera("camera", 0, 0, 0, new BABYLON.Vector3(0, 0, 0));
  camera.setPosition(new BABYLON.Vector3(0, 4, 9));
  camera.attachControl(canvas, false);
  camera.inputs.clear(); // Disable camera controls

  // Créer la lumière
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 1;

  var light2 = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -0.5, -1.0), scene);
  light2.position = new BABYLON.Vector3(0, 5, 5);

  // Créer la skybox
  const skybox = BABYLON.MeshBuilder.CreateBox("skybox", { size: 1000 }, scene);
  const skyboxMaterial = new BABYLON.StandardMaterial("skyboxMaterial", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0.6, 1); // Couleur bleu clair
  skybox.material = skyboxMaterial;

  // Créer le sol
  const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 10, height: 1000 }, scene);

  // Créer le matériau et texture de la route
  var roadmaterial = new BABYLON.StandardMaterial("road", scene);
  var roadmaterialpt = new BABYLON.RoadProceduralTexture("customtext", 512, scene);
  roadmaterial.diffuseTexture = roadmaterialpt;
  ground.material = roadmaterial;

  // Créer le décor rocailleux sur les côtés de la route
  const rockyMaterial = new BABYLON.StandardMaterial("rockyMaterial", scene);
  const rockyTexture = new BABYLON.Texture("../asset/textures/rocky_texture.png", scene);
  rockyMaterial.diffuseTexture = rockyTexture;

  const rockyLeft = BABYLON.MeshBuilder.CreateGroundFromHeightMap("rockyLeft", '../asset/textures/rocky_texture.png', {
    height: 1000,
    width: 5,
    subdivisions: 600,
    maxHeight: 4
  }, scene);

  const rockyRight = BABYLON.MeshBuilder.CreateGroundFromHeightMap("rockyRight", '../asset/textures/rocky_texture.png', {
    height: 1000,
    width: 5,
    subdivisions: 600,
    maxHeight: 4
  }, scene);

  rockyLeft.material = rockyMaterial;
  rockyRight.material = rockyMaterial;
  rockyLeft.position = new BABYLON.Vector3(7, -2, 0);
  rockyRight.position = new BABYLON.Vector3(-7, -2, 0);

  var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

  // Ajouter le moteur de physique à la scène
  scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());

  ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);

  // Importer le guidon et ajouter un imposteur de physique
  BABYLON.SceneLoader.ImportMesh("", "../asset/import/", "Guidon.glb", scene, function (newMeshes) {
    var guidon = newMeshes[0];
    guidon.position.y = 2.5;
    guidon.position.z = 10;
    guidon.computeWorldMatrix(true);

    // Ajouter un imposteur de physique au guidon
    guidon.physicsImpostor = new BABYLON.PhysicsImpostor(guidon, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
    camera.target.z = guidon.position.z - 6.2;

    // Gestion des événements clavier
    window.addEventListener("keydown", function (event) {
      var keyCode = event.keyCode;
      var speed = 0.1;

      if (keyCode === 37 && guidon.position.x < 3.5) {
        guidon.position.x += speed;
      } else if (keyCode === 39 && guidon.position.x > -3.5) {
        guidon.position.x -= speed;
      }

    });
    // Ajout de la vérification d'intersection dans la boucle de rendu
    /*scene.registerBeforeRender(function () {
      var tolerance = 2.5; // Tolérance pour la position en y
      var distanceY = Math.abs(guidon.position.y - ground.position.y);

      // Logs pour le débogage
      console.log(`Position guidon y: ${guidon.position.y}`);
      console.log(`Position sol y: ${ground.position.y}`);
      console.log(`Distance y: ${distanceY}`);

      if (distanceY <= tolerance) {
        console.log("ground touché");
      }

    });*/

    // Création du compteur de pièces
    var pieceCount = 0;

    // Création des pièces
    const pieceCountTotal = 150;
    const pieceSpacing = 7;
    const pieceZPosition = -600;

    var pieces = [];
    for (let i = 0; i < pieceCountTotal; i++) {
      BABYLON.SceneLoader.ImportMesh("", "../asset/import/", "Piece.glb", scene, function (newMeshes) {
        var piece = newMeshes[0];
        piece.position.y = 1;
        piece.position.x = (i % 2 === 0) ? Math.random() * 3 - 3 : Math.random() * 3;
        piece.position.z = pieceZPosition + (i * pieceSpacing);
        piece.computeWorldMatrix(true);

        // Ajouter un imposteur de physique à chaque pièce
        piece.physicsImpostor = new BABYLON.PhysicsImpostor(piece, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);

        // Ajouter la pièce au tableau des pièces
        pieces.push(piece);
      });

    }

    // Création des rochers
    const rockCount = 190;
    const rockSpacing = 4;
    const rockZPosition = -600;
    var rocks = [];

    for (let i = 0; i < rockCount; i++) {
      var rock = BABYLON.MeshBuilder.CreateSphere("rock", { diameter: 1 }, scene);
      rock.position.y = 0;
      rock.position.x = Math.random() * 7 - 3;
      rock.position.z = rockZPosition + (i * rockSpacing);
      rock.material = new BABYLON.StandardMaterial("rockMaterial", scene);
      rock.material.diffuseTexture = new BABYLON.Texture("../asset/textures/rocky_texture.png", scene);
      rock.computeWorldMatrix(true);

      // Ajouter un imposteur de physique à chaque rocher
      rock.physicsImpostor = new BABYLON.PhysicsImpostor(rock, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 0, restitution: 0.9 }, scene);
      rocks.push(rock);
    }

    var consigne = new BABYLON.GUI.TextBlock();
    consigne.text = "Evite les rochers et collecte les pièces pour gagner des points !";
    consigne.color = "white";
    consigne.fontSize = 18;
    consigne.textWrapping = true;
    consigne.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    consigne.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    advancedTexture.addControl(consigne);

    setTimeout(function () {
      advancedTexture.removeControl(consigne);
      var text = new BABYLON.GUI.TextBlock();
    text.text = "Pièces: " + pieceCount;
    text.color = "white";
    text.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    text.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    advancedTexture.addControl(text);

// Ajout de la vérification d'intersection dans la boucle de rendu
scene.registerBeforeRender(function () {
  guidon.position.z -= 0.2;
  camera.target.z = guidon.position.z - 6.2;
  //pieces.rotate(BABYLON.Axis.Z, 0.1);
  var tolerance_piece = 2; // Tolérance pour la distance en 3D
  var tolerance_rocher = 2.5; // Tolérance pour la position en y

  // Vérification de l'intersection avec les pièces
  for (let i = pieces.length - 1; i >= 0; i--) {
    var piece = pieces[i];
    var distance = BABYLON.Vector3.Distance(guidon.position, piece.position);
    if (distance <= tolerance_piece) {
      pieceCount++;
      text.text = "Pièces: " + pieceCount;
      //console.log("Pièces: " + pieceCount);
      piece.dispose(); // Supprimer la pièce de la scène
      pieces.splice(i, 1); // Retirer la pièce du tableau
      // Ajouter un son lorsqu'une pièce est collectée
      const audio = new Audio("../asset/sons/collectcoin.wav");
      audio.play();
    }
  }


  // Vérification de l'intersection avec les rochers
  for (let i = rocks.length - 1; i >= 0; i--) {
    var rock = rocks[i];
    var distance = BABYLON.Vector3.Distance(guidon.position, rock.position);
    /*console.log(`Distance rocher: ${distance}`);
    console.log(`Position rocher y: ${rock.position}`);
    console.log(`Position guidon y: ${guidon.position}`);
*/
    if (distance <= tolerance_rocher) {
      console.log("Collision avec un rocher !");
 
      // Réinitialiser la position du guidon
      guidon.position.x = 0;
      guidon.position.z = 10;
    }
  }
});
    }, 5000);
    // Arrêter l'audio
  audio.pause();

  });

  setTimeout(function () {
    window.history.back();
  }, 10000);

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