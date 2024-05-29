document.addEventListener('DOMContentLoaded', (event) => {
    const hash = window.location.hash;

    if (hash.includes('halterophilie')) {
        var canvas = document.createElement("canvas");
        canvas.id = "halterophilie";
        const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

        var createScene = function () {
            var scene = new BABYLON.Scene(engine);

            var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 30, 80), scene);
            camera.setTarget(BABYLON.Vector3.Zero());
            camera.attachControl(canvas, true);
            camera.inputs.clear(); // Disable camera controls

            var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

            var skybox = BABYLON.MeshBuilder.CreateBox("skybox", { size: 1000 }, scene);
            var skyboxMaterial = new BABYLON.StandardMaterial("skyboxMaterial", scene);
            skyboxMaterial.backFaceCulling = false;

            var dynamicTexture = new BABYLON.DynamicTexture("dynamicTexture", 1024, scene, true);
            var context = dynamicTexture.getContext();
            context.fillStyle = "green"; // Background color
            context.fillRect(0, 0, 1024, 1024); // Fill the background
            context.font = "bold 60px Arial";
            context.fillStyle = "white";
            context.textAlign = "center";
            context.translate(512, 512); // Move the origin to the center of the canvas
            context.scale(-1, 1); // Flip the text
            context.fillText("OlympicWare", 0, 0); // Center the text in the middle of the texture
            dynamicTexture.update();
            skyboxMaterial.diffuseTexture = dynamicTexture;
            skybox.material = skyboxMaterial;

            var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 1000, height: 100 }, scene);
            ground.material = new BABYLON.StandardMaterial("groundMaterial", scene);
            ground.material.diffuseColor = new BABYLON.Color3(0.76, 0.69, 0.57);
            ground.checkCollisions = true;

            BABYLON.SceneLoader.ImportMesh("", "../asset/", "Halteres.glb", scene, function (newMeshes) {
                var haltere = newMeshes[0];
                haltere.position.y = 1;
            });

            BABYLON.SceneLoader.ImportMesh("", "../asset/import/", "Halterophilie.glb", scene, function (newMeshes) {
                console.log(newMeshes);
                var athlete = newMeshes[0];
                athlete.position.y = 0;
                athlete.position.z = 15;

                var soulever = scene.getAnimationGroupByName("Souleve");
                soulever.start(true, 1.0, soulever.from, soulever.to, false);
                setTimeout(() => {
                    var pose = scene.getAnimationGroupByName("Souleve.002");
                    pose.start(true);

                    var cylindres = newMeshes.filter(mesh => mesh.name.startsWith("Cylindre_"));
                    console.log(cylindres);

                    cylindres.forEach((mesh, index) => {
                        animateMesh(mesh);
                    });

                    // Déplacer l'athlète avec les touches du clavier
                    window.addEventListener("keydown", (event) => {
                        switch (event.key) {
                            case 'ArrowRight':
                                if (athlete.position.x > -35) {
                                    athlete.position.x -= 1;
                                }console.log(athlete.position.x);
                                break;
                            case 'ArrowLeft':
                                if (athlete.position.x < 35) {
                                    athlete.position.x += 1;
                                }console.log(athlete.position.x);
                                break;
                        }
                    });

                }, 5000);

                
            });

            return scene;
        }

        function animateMesh(mesh) {
            var frameRate = 10;
            var xSlide = new BABYLON.Animation("xSlide", "position.z", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

            var keyFrames = [];

            keyFrames.push({
                frame: 0,
                value: -Math.PI / 4
            });

            keyFrames.push({
                frame: frameRate,
                value: Math.PI / 4
            });

            keyFrames.push({
                frame: 2 * frameRate,
                value: -Math.PI / 4
            });

            xSlide.setKeys(keyFrames);

            mesh.animations.push(xSlide);
            scene.beginAnimation(mesh, 0, 2 * frameRate, true);
        }

        const scene = createScene(); // Appeler la fonction createScene

        engine.runRenderLoop(function () {
            scene.render();
        });

        window.addEventListener("resize", function () {
            engine.resize();
        });

        canvas.style.display = "block";
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.getElementById('menu').appendChild(canvas);
    }
});
