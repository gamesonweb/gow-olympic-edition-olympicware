document.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash;

  if (hash.includes('arc')) {
    var canvas = document.createElement("canvas");
    canvas.id = "arc";
    const engine = new BABYLON.Engine(canvas, true);
    
    const createScene = function () {
      const scene = new BABYLON.Scene(engine);
      // Create the camera
      const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 3, 20, new BABYLON.Vector3(0, 0, 0));
      camera.attachControl(canvas, true);
      camera.inputs.clear(); // Disable camera controls

      // Create the light
      const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));
      light.intensity = 2;

      function createTarget(scene) {
        const target = new BABYLON.TransformNode("target", scene);

        const ellipse = BABYLON.MeshBuilder.CreateDisc("ellipse", { radius: 5, tessellation: 32 }, scene);
        ellipse.parent = target;
        ellipse.material = new BABYLON.StandardMaterial("ellipseMaterial", scene);
        ellipse.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
        
        const smallerEllipses = [];
        const colors = [new BABYLON.Color3(0, 0, 0), new BABYLON.Color3(0, 0, 1), new BABYLON.Color3(1, 0, 0), new BABYLON.Color3(1, 1, 0)];
        const radiusStep = 1;

        for (let i = 0; i < 4; i++) {
            const smallerEllipse = BABYLON.MeshBuilder.CreateDisc("smallerEllipse" + i, { radius: 5 - (i + 1) * radiusStep, tessellation: 32 }, scene);
            smallerEllipse.parent = target;
            smallerEllipse.material = new BABYLON.StandardMaterial("smallerEllipseMaterial" + i, scene);
            smallerEllipse.material.diffuseColor = colors[i];
            smallerEllipses.push(smallerEllipse);

        }
        return target;
    }

    const target = createTarget(scene);

    function positionTargetRandomly() {
        const minX = -15, maxX = 15, minY = 0, maxY = 6;
        target.position.x = Math.random() * (maxX - minX) + minX;
        target.position.y = Math.random() * (maxY - minY) + minY;
        target.position.z = 10;
    }

    setInterval(positionTargetRandomly, 2000);

      // Create a small transparent circle with black outline
      const smallCircle = BABYLON.MeshBuilder.CreateDisc("smallCircle", { radius: 0.7, tessellation: 32 }, scene);
      smallCircle.position.z = 10;
      smallCircle.material = new BABYLON.StandardMaterial("smallCircleMaterial", scene);
      smallCircle.material.diffuseColor = new BABYLON.Color3(0, 0.6, 0); // Set the color of the circle
      smallCircle.material.alpha = 0.5; // Set the transparency of the circle
      smallCircle.material.wireframe = true; // Display the circle as wireframe

      // Add a timer to return to the previous page after 20 seconds
      setTimeout(function() {
        window.history.back();
      }, 20000);

      // Add event listener for mouse movement
      canvas.addEventListener("mousemove", function () {

        // Create a picking ray from the mouse coordinates
        let ray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), null);
        // Perform a pick operation with the ray
        let hit = scene.pickWithRay(ray);
        // Get the picked point from the hit result
        let pickedPoint = hit.pickedPoint;

        // Update the position of the small circle
        smallCircle.position.x = pickedPoint.x;
        smallCircle.position.y = pickedPoint.y;
      });
      let score = 0;
      // Add event listener for mouse click
      canvas.addEventListener("click", function () {
        const audio = new Audio("../asset/sons/arrow-shot.wav");
        audio.play();
        // Create a picking ray from the mouse coordinates
        let ray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), null);
        // Perform a pick operation with the ray
        let hit = scene.pickWithRay(ray);
        // Get the picked point from the hit result
        let pickedPoint = hit.pickedPoint;

        BABYLON.SceneLoader.ImportMesh("", "../asset/import/", "Fleche.glb", scene, function (newMeshes) {
          var fleche = newMeshes[0];
          fleche.position.x = pickedPoint.x;
          fleche.position.y = pickedPoint.y;
          fleche.position.z = 4;

              score++;


        });
      });

    

      return scene;
    };

    const scene = createScene(); // Call the createScene function

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