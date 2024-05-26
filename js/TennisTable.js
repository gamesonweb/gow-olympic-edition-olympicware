var canvas = document.createElement("canvas");
canvas.id = "tennis";
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
const hash = window.location.hash; // Declare the hash variable and assign it the value of the URL anchor

// Add your code here matching the playground format
const createScene = function () {
    const scene = new BABYLON.Scene(engine);
    // Enable physics
    scene.enablePhysics(null, new BABYLON.CannonJSPlugin());

    // Créer la caméra
    const camera = new BABYLON.ArcRotateCamera("camera", 1, 1, 1, new BABYLON.Vector3(0, 0, 0));
    camera.setPosition(new BABYLON.Vector3(0, 4.3, 8));
    camera.attachControl(canvas, false);
    //camera.inputs.clear();
    // Create the light
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));

    BABYLON.SceneLoader.ImportMesh("", "../asset/", "Table.glb", scene, function (newMeshes) {
        var table = newMeshes[0];
        camera.target = table;
        table.physicsImpostor = new BABYLON.PhysicsImpostor(table, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
    });

    // Create the tennis ball
    const ball = BABYLON.MeshBuilder.CreateSphere("ball", { diameter: 0.2 }, scene);
    ball.position.y = 2.8;
    ball.position.z = 4.1; // Adjust the position of the ball
    BABYLON.SceneLoader.ImportMesh("", "../asset/", "Raquette.glb", scene, function (newMeshes) {
        var raquette = newMeshes[0];
        raquette.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
        raquette.position.y = 2;
        raquette.position.z = 4.2;
        raquette.physicsImpostor = new BABYLON.PhysicsImpostor(raquette, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);

        var raquette2 = raquette.clone("raquette2");
        raquette2.position.z = -5.6;
        // Mouvement automatique de la deuxième raquette en fonction de la position de la balle
        scene.registerBeforeRender(function () {
            if (ball.position.z < 0) {
                if (ball.position.x < 0) {
                    raquette2.position.x += 0.1;
                } else {
                    raquette2.position.x -= 0.1;
                }
            }
        });
        // Add keyboard input to move the first racket with its handle 
        scene.onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
                case BABYLON.KeyboardEventTypes.KEYDOWN:
                    switch (kbInfo.event.key) {
                        case "ArrowLeft":
                            raquette.position.x += 0.1;
                            ball.position.x = raquette.position.x;
                            break;
                        case "ArrowRight":
                            raquette.position.x -= 0.1;
                            ball.position.x = raquette.position.x;
                            break;
                        case "w":
                            console.log("w key pressed");
                            ball.physicsImpostor = new BABYLON.PhysicsImpostor(ball, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 2, restitution: 0.9 }, scene);
                            // Appliquer une impulsion à la balle lorsque la touche 'w' est enfoncée
                            const impulse = new BABYLON.Vector3(0, 3, -20);
                            console.log(ball.getAbsolutePosition());
                            ball.physicsImpostor.applyImpulse(impulse, ball.getAbsolutePosition()); // Appliquer l'impulsion à la balle
                            break;

                    } break;
            }
        });
    });


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


if (hash.includes('tennis')) {
    // Montrer le canvas
    canvas.style.display = "block";
    // Set the canvas size to match the window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.getElementById('menu').appendChild(canvas);

}