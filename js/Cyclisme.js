var canvas = document.createElement("canvas");
canvas.id = "cyclisme";
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine 
const hash = window.location.hash;

const createScene = function () {
  engine.enableOfflineSupport = false;
  const scene = new BABYLON.Scene(engine);
  // CrÃ©er la camÃ©ra
  const camera = new BABYLON.ArcRotateCamera("camera", 0, 0, 0, new BABYLON.Vector3(0, 0, 0));
  camera.setPosition(new BABYLON.Vector3(0, 4, 9));
  camera.attachControl(canvas, false);
  camera.inputs.clear(); // Disable camera controls

  // CrÃ©er la lumiÃ¨re
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 1;

  var light2 = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -0.5, -1.0), scene);
  light2.position = new BABYLON.Vector3(0, 5, 5);

  // CrÃ©er la skybox
  const skybox = BABYLON.MeshBuilder.CreateBox("skybox", { size: 1000 }, scene);
  const skyboxMaterial = new BABYLON.StandardMaterial("skyboxMaterial", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0.6, 1); // Couleur bleu clair
  skybox.material = skyboxMaterial;

  // CrÃ©er le sol
  const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 10, height: 1000 }, scene);
  // ground.material = new BABYLON.StandardMaterial("groundMaterial", scene);

  var roadmaterial = new BABYLON.StandardMaterial("road", scene);
  var roadmaterialpt = new BABYLON.RoadProceduralTexture("customtext", 512, scene);
  roadmaterial.diffuseTexture = roadmaterialpt;
  ground.material = roadmaterial;
  // CrÃ©er le dÃ©cor rocailleux sur les cÃ´tÃ©s de la route
  const rockyMaterial = new BABYLON.StandardMaterial("rockyMaterial", scene);
  const rockyTexture = new BABYLON.Texture("../asset/textures/rocky_texture.png", scene); // Remplacez "textures/rocky.jpg" par le chemin de votre texture rocailleuse
  rockyMaterial.diffuseTexture = rockyTexture;

  const rockyLeft = new BABYLON.MeshBuilder.CreateGroundFromHeightMap('', '../asset/textures/rocky_texture.png', {
    height: 1000,
    width: 5,
    subdivisions: 600,
    maxHeight: 4
  });

  const rockyRight = new BABYLON.MeshBuilder.CreateGroundFromHeightMap('', '../asset/textures/rocky_texture.png', {
    height: 1000,
    width: 5,
    subdivisions: 600,
    maxHeight: 4
  });

  rockyLeft.material = rockyMaterial;
  rockyRight.material = rockyMaterial;
  rockyLeft.position = new BABYLON.Vector3(7, -2, 0);
  rockyRight.position = new BABYLON.Vector3(-7, -2, 0);

  var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

  // Import the guidon mesh
  BABYLON.SceneLoader.ImportMesh("", "../asset/import/", "Guidon.glb", scene, function (newMeshes) {
    // Access the imported mesh
    var guidon = newMeshes[0];
    guidon.position.y = 2.5;
    guidon.position.z = 10;
    guidon.computeWorldMatrix(true);

    // Keyboard input event listener
    window.addEventListener("keydown", function (event) {
      var keyCode = event.keyCode;
      var speed = 0.1; // Adjust the speed as needed

      // Move the guidon mesh to the left within the width of the road
      if (keyCode === 37 && guidon.position.x < 3.5) {
        guidon.position.x += speed;
      }
      // Move the guidon mesh to the right within the width of the road
      else if (keyCode === 39 && guidon.position.x > -3.5) {
        guidon.position.x -= speed;
      }
    });

    scene.registerBeforeRender(function () {
      guidon.position.z -= 0.1; // Adjust the speed as needed
      camera.target.z = guidon.position.z - 6.2;
    });

    // Create multiple pieces
    const pieceCount = 20;
    const pieceSpacing = 7; // Adjust the spacing as needed
    const pieceZPosition = -90; // Adjust the z position as needed

    for (let i = 0; i < pieceCount; i++) {
      BABYLON.SceneLoader.ImportMesh("", "../asset/import/", "Piece.glb", scene, function (newMeshes) {
        var piece = newMeshes[2];
        piece.position.y = 1;
        piece.position.x = (i % 2 === 0) ? Math.random() * 3 - 3 : Math.random() * 3; // Random x position within the width of the road, alternating between left and right
        piece.position.z = pieceZPosition + (i * pieceSpacing); // Adjust the spacing between pieces
        piece.computeWorldMatrix(true);

        // CrÃ©er un texte
        // Variables for counting pieces
        var pieceCount = 0;
        var text = new BABYLON.GUI.TextBlock();
        text.text = "PiÃ¨ces:" + pieceCount;
        text.color = "white";
        text.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        text.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        advancedTexture.addControl(text);

        // Check collision between guidon and piece
        scene.registerBeforeRender(function () {
          if (guidon.intersectsMesh(piece, false)) {
            pieceCount++;
            text.text = "PiÃ¨ces: " + pieceCount;
            console.log("PiÃ¨ces: " + guidon.position.equalsWithEpsilon(piece.position, 0.001));
          }

        });

      });
    }

    // Create rocks on the road
    const rockCount = 90;
    const rockSpacing = 7; // Adjust the spacing as needed
    const rockZPosition = -400; // Adjust the z position as needed

    for (let i = 0; i < rockCount; i++) {
      var rock = BABYLON.MeshBuilder.CreateSphere("rock", { diameter: 1 }, scene);
      rock.position.y = 0;
      rock.position.x = Math.random() * 6 - 3; // Random x position within the width of the road
      rock.position.z = rockZPosition + (i * rockSpacing); // Adjust the spacing between rocks
      rock.material = new BABYLON.StandardMaterial("rockMaterial", scene);
      rock.material.diffuseTexture = new BABYLON.Texture("../asset/textures/rocky_texture.png", scene); // Set the texture for the rock
    }

    rock.computeWorldMatrix(true);

    scene.registerBeforeRender(function () {
      if (guidon.intersectsMesh(rock)) {
        var text2 = new BABYLON.GUI.TextBlock();
        text2.text = "Game Over";
        text2.color = "red";
        advancedTexture.addControl(text2);
        console.log("Game Over");
      }
    });


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

if (hash.includes('cyclisme')) {
  // Show the canvas
  canvas.style.display = "block";
  // Set the canvas size to match the window size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.getElementById('menu').appendChild(canvas);
}