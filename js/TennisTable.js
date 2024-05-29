document.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash;

    if (hash.includes('tennis')) {
        var canvas = document.createElement("canvas");
        canvas.id = "tennis";
        const engine = new BABYLON.Engine(canvas, true);
        var createScene = async function () {
            // Créer une scène Babylon de base
            var scene = new BABYLON.Scene(engine);

            // Créer la caméra
            const camera = new BABYLON.ArcRotateCamera("camera", 1, 1, 1, new BABYLON.Vector3(0, 0, 0));
            camera.setPosition(new BABYLON.Vector3(0, 8, 10));
            camera.attachControl(canvas, false);
            camera.inputs.clear(); // Désactiver les contrôles de la caméra
            // Créer une lumière
            var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
            light.intensity = 0.7;

            // initialize plugin
            const havokInstance = await HavokPhysics();
            // pass the engine to the plugin
            const hk = new BABYLON.HavokPlugin(true, havokInstance);
            // enable physics in the scene with a gravity
            scene.enablePhysics(new BABYLON.Vector3(0, -9.8, 0), hk);

            // Charger la table
            const tableResult = await BABYLON.SceneLoader.ImportMeshAsync("", "../asset/import/", "Table.glb", scene);
            const table = tableResult.meshes[0];
            camera.target = table;
            table.position.y = 0; // Ajustez la hauteur de la table pour la positionner correctement
            const tableAggregate = new BABYLON.PhysicsAggregate(table, BABYLON.PhysicsShapeType.BOX, { mass: 0, restitution: 0.9 }, scene);

            // Créer la balle de tennis
            const ball = BABYLON.MeshBuilder.CreateSphere("ball", { diameter: 0.2, segments: 32 }, scene);
            ball.position.y = 2.8;
            ball.position.z = 3.7; // Ajuster la position de la balle

            // Ajouter un plan invisible comme déclencheur de rebond
            const reboundTrigger = BABYLON.MeshBuilder.CreatePlane("reboundTrigger", { width: 6, height: 10 }, scene);
            reboundTrigger.position.y = 1.8; // Définir la hauteur à partir de laquelle la balle peut rebondir
            reboundTrigger.isVisible = false; // Rendre le plan invisible
            reboundTrigger.rotate(BABYLON.Axis.X, Math.PI / 2, BABYLON.Space.WORLD); // Tourner le plan pour qu'il soit horizontal
            const reboundTriggerAggregate = new BABYLON.PhysicsAggregate(reboundTrigger, BABYLON.PhysicsShapeType.BOX, { mass: 0 }, scene);

            // Charger les raquettes
            const raquetteResult = await BABYLON.SceneLoader.ImportMeshAsync("", "../asset/import/", "Raquette.glb", scene);
            var raquette = raquetteResult.meshes[0];
            raquette.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
            raquette.position.y = 2;
            raquette.position.z = 4.2;
            // Utiliser PhysicsAggregate pour la raquette
            //const raquetteAggregate = new BABYLON.PhysicsAggregate(raquette, BABYLON.PhysicsShapeType.BOX, { mass: 0, restitution: 0.9 }, scene);

            var raquette2 = raquette.clone("raquette2");
            raquette2.position.z = -5.6;
            // Utiliser PhysicsAggregate pour la deuxième raquette
            //const raquette2Aggregate = new BABYLON.PhysicsAggregate(raquette2, BABYLON.PhysicsShapeType.BOX, { mass: 0, restitution: 0.9 }, scene);

            // Mouvement automatique de la deuxième raquette en fonction de la position de la balle
            scene.registerBeforeRender(function () {
                if (ball.position.z < 0) {
                    if (ball.position.x < 0) {
                        raquette2.position.x = ball.position.x;
                    } else {
                        raquette2.position.x = ball.position.x;
                    }
                }
            });

            // Gérer les entrées clavier pour déplacer la première raquette
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
                                // Incliner la raquette vers l'avant
                                raquette.rotate(BABYLON.Axis.X, 0.2, BABYLON.Space.LOCAL);

                                // Utiliser PhysicsAggregate pour la balle
                                const ballAggregate = new BABYLON.PhysicsAggregate(ball, BABYLON.PhysicsShapeType.SPHERE, { mass: 1, restitution: 0.9 }, scene);
                                ballAggregate.body.applyImpulse(new BABYLON.Vector3(0, 1, -10.4), ball.getAbsolutePosition());
                                const song = new Audio("../asset/sons/Pingpong.wav");
                                song.play();
                                // Fonction pour vérifier la collision avec le plan invisible et appliquer un rebond pour la balle
                                scene.registerBeforeRender(function () {
                                    if (ball.intersectsMesh(reboundTrigger, false)) {
                                        // Appliquer une impulsion pour simuler le rebond
                                        ballAggregate.body.applyImpulse(new BABYLON.Vector3(0, 1, 7), ball.getAbsolutePosition());
                                    }
                                });
                                break;
                        }
                }
            });
            // Détection de Collision entre la balle et les raquettes
            scene.registerBeforeRender(function () {
                const tolerance = 1; // Tolérance pour la détection de collision
                const distance = Math.abs(ball.position.z - raquette2.position.z);
                if (distance < tolerance) {
                    console.log("Collision avec la raquette 2 détectée !");
                }
                console.log("distance : " + distance);
                console.log("ball : " + ball.position.z);
                console.log("raquette : " + raquette2.position.z);
                if (ball.intersectsMesh(raquette, false)) {
                    // Inverser la direction de la balle et déplacer légèrement vers l'avant
                    ballAggregate.body.velocity.z *= -1;
                    ball.position.z += 0.1 * Math.sign(ballAggregate.body.velocity.z);

                    // Appliquer une impulsion à la balle pour lui donner un rebond
                    const impulse = new BABYLON.Vector3(0, 0, 10); // Impulsion vers l'avant
                    ballAggregate.body.applyImpulse(impulse, ball.getAbsolutePosition());
                }
                if (ball.intersectsMesh(raquette2, false)) {

                    console.log("Collision avec la raquette 2 détectée !");

                    // Inverser la direction de la balle et déplacer légèrement vers l'avant
                    ballAggregate.body.velocity.z *= -1;
                    ball.position.z += 0.1 * Math.sign(ballAggregate.body.velocity.z);

                    // Appliquer une impulsion à la balle pour lui donner un rebond
                    const impulse = new BABYLON.Vector3(0, 0, -10); // Impulsion vers l'arrière
                    ballAggregate.body.applyImpulse(impulse, ball.getAbsolutePosition());
                }
            });

            // Utiliser un délai pour ramener la raquette à sa position initiale
            setTimeout(() => {
                raquette.rotation.x = 0; // Réinitialiser la rotation de la raquette
            }, 200);

            return scene;
        };
        createScene().then((scene) => {
            engine.runRenderLoop(function () {
                if (scene) {
                    scene.render();
                }
            });
        });
        // Resize
        window.addEventListener("resize", function () {
            engine.resize();
        });

        // Montrer le canvas
        canvas.style.display = "block";
        // Set the canvas size to match the window size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.getElementById('menu').appendChild(canvas);
    }
});
