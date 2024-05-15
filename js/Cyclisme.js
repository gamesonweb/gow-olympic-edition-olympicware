var canvas = document.createElement("canvas");
canvas.id = "cyclisme";
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine 
const hash = window.location.hash;

const createScene = function () {
  engine.enableOfflineSupport = false;
  const scene = new BABYLON.Scene(engine);
  // Créer la caméra
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
  // ground.material = new BABYLON.StandardMaterial("groundMaterial", scene);
  
  var roadmaterial = new BABYLON.StandardMaterial("road", scene);
  var roadmaterialpt = new BABYLON.RoadProceduralTexture("customtext", 512, scene);
  roadmaterial.diffuseTexture = roadmaterialpt;
   ground.material = roadmaterial;
  // Créer le décor rocailleux sur les côtés de la route
  const rockyMaterial = new BABYLON.StandardMaterial("rockyMaterial", scene);
  const rockyTexture = new BABYLON.Texture("/asset/textures/rocky_texture.png", scene); // Remplacez "textures/rocky.jpg" par le chemin de votre texture rocailleuse
  rockyMaterial.diffuseTexture = rockyTexture;

  const rockyLeft = new BABYLON.MeshBuilder.CreateGroundFromHeightMap('', '/asset/textures/rocky_texture.png',{
  height: 1000,
  width: 5,
  subdivisions: 600,
  maxHeight: 4
  });

  const rockyRight = new BABYLON.MeshBuilder.CreateGroundFromHeightMap('', '/asset/textures/rocky_texture.png',{
    height: 1000,
    width: 5,
    subdivisions: 600,
    maxHeight: 4
    });

  rockyLeft.material = rockyMaterial;
  rockyRight.material = rockyMaterial;
  rockyLeft.position = new BABYLON.Vector3(7, -2, 0);
  rockyRight.position = new BABYLON.Vector3(-7, -2, 0);

 
  // Import the guidon mesh
  BABYLON.SceneLoader.ImportMesh("", "/asset/import/", "Guidon.glb", scene, function (newMeshes) {
    // Access the imported mesh
    var guidon = newMeshes[0];
    guidon.position.y = 2.5;
    guidon.position.z = 6;

    // Keyboard input event listener
    window.addEventListener("keydown", function(event) {
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

    scene.registerBeforeRender(function() {
      //guidon.position.z -= 0.1; // Adjust the speed as needed
      camera.target.z = guidon.position.z-6;
    });

    // Create multiple pieces
    for (let i = 0; i < 5; i++) {
      BABYLON.SceneLoader.ImportMesh("", "/asset/import/", "Piece.glb", scene, function (newMeshes) {
        var piece = newMeshes[0];
        piece.position.y = 1.8;
        piece.position.x = Math.random() * 6 - 3; // Random x position within the width of the road
        piece.position.z = Math.random() * 10 - 20; // Random z position behind the guidon

        // Create rotation animation
        var animation = new BABYLON.Animation("rotationAnimation", "rotation.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        var keys = [];
        keys.push({
          frame: 0,
          value: 0
        });
        keys.push({
          frame: 30,
          value: Math.PI * 2
        });
        animation.setKeys(keys);

        // Apply animation to the piece
        piece.animations = [];
        piece.animations.push(animation);
        scene.beginAnimation(piece, 0, 30, true);
      });
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

if (hash.includes('cyclisme')) {
    // Show the canvas
    canvas.style.display = "block";
    // Set the canvas size to match the window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.getElementById('menu').appendChild(canvas);
    }