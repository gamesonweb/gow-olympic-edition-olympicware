// Retrieve the element with id "menu"
const menuElement = document.getElementById("menu");

// Create a button element
const buttonElement = document.createElement("button");
buttonElement.id = "button";
buttonElement.style.top = "30";
buttonElement.style.right = "50";
buttonElement.textContent = "Pause";
buttonElement.style.backgroundColor = "white";
buttonElement.style.width = "100px";
buttonElement.style.height = "50px";

// Add event listener to handle click event
buttonElement.addEventListener("click", () => {
    // Add sound effect
    const audio = new Audio("../asset/sons/Mouse_click.wav");
    audio.play();
    // Check if the rectangle element already exists
    const rectangleElement = document.getElementById("rectangle");
    if (rectangleElement) {
        // Remove the rectangle element if it exists
        rectangleElement.remove();
    } else {
        // Creation de la page quand le jeu est en pause
        const rectangleElement = document.createElement("div");
        rectangleElement.id = "rectangle";
        rectangleElement.style.position = "absolute";
        rectangleElement.style.top = "50%";
        rectangleElement.style.left = "50%";
        rectangleElement.style.transform = "translate(-50%, -50%)";
        rectangleElement.style.width = "900px";
        rectangleElement.style.height = "700px";
        rectangleElement.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        rectangleElement.style.borderRadius = "10px";
        rectangleElement.style.border = "2px solid black";

        // Create a title element
        const titleElement = document.createElement("h1");
        titleElement.textContent = "Pause";
        titleElement.style.color = "white";
        titleElement.style.textAlign = "center";
        titleElement.style.marginTop = "60px";

        // Create a button element
        const button1Element = document.createElement("button");
        button1Element.id = "button";
        button1Element.style.top = "30%";
        button1Element.style.left = "50%";
        button1Element.style.transform = "translate(-50%, -50%)";
        // Create an image element
        const imageElement = document.createElement("img");
        imageElement.src = "path/to/image.jpg";
        imageElement.alt = "Musique";
        imageElement.style.width = "50px";
        imageElement.style.height = "50px";
        // Append the image element to the button
        button1Element.appendChild(imageElement);
        button1Element.addEventListener("click", () => {
            const audio = new Audio("../asset/sons/Mouse_click.wav");
            audio.play();
        });

        // Create another button element
        const button2Element = document.createElement("button");
        button2Element.id = "button";
        button2Element.style.top = "50%";
        button2Element.style.right = "50%";
        button2Element.style.transform = "translate(50%, -50%)";
        const image2Element = document.createElement("img");
        image2Element.src = "../asset/icones/icons8-haut-parleur-32.png";
        image2Element.alt = "Son";
        image2Element.style.width = "50px";
        image2Element.style.height = "50px";
        button2Element.appendChild(image2Element);
        button2Element.addEventListener("click", () => {
            // Mute all sound effects
            const audioElements = document.querySelectorAll("audio");
            audioElements.forEach(audio => {
                audio.muted = true;
            });
            // Change the image of the button
            image2Element.src = "../asset/icones/icons8-pas-de-son-32.png";
            image2Element.alt = "Muted";
        });

        // Create a third button element
        const button3Element = document.createElement("button");
        button3Element.id = "button";
        button3Element.style.top = "70%";
        button3Element.style.left = "50%";
        button3Element.style.transform = "translate(-50%, -50%)";
        const image3Element = document.createElement("img");
        image3Element.src = "../asset/icones/icons8-accueil-48.png";
        image3Element.alt = "Accueil";
        image3Element.style.width = "50px";
        image3Element.style.height = "50px";
        button3Element.appendChild(image3Element);
        button3Element.addEventListener("click", () => {
            const audio = new Audio("./asset/sons/Mouse_click.wav");
            audio.play();
            window.location.href = "../index.html";
        });

        // Add the title and buttons to the rectangle element
        rectangleElement.appendChild(titleElement);
        rectangleElement.appendChild(button1Element);
        rectangleElement.appendChild(button2Element);
        rectangleElement.appendChild(button3Element);

        menuElement.appendChild(rectangleElement);
    }

});
menuElement.appendChild(buttonElement);

// Creer le menu pour afficher les succes
const succesElement = document.createElement("ul");
succesElement.id = "succes";
succesElement.style.top = "15";
succesElement.style.left = "50";
succesElement.textContent = "Succès";
succesElement.style.fontSize = "17px";
succesElement.style.backgroundColor = "white";
succesElement.style.width = "200px";
succesElement.style.height = "50px";
succesElement.style.position = "absolute";
succesElement.style.display = "flex";
succesElement.style.alignItems = "center";
succesElement.style.justifyContent = "center";

// Creer une liste déroulante
const dropdownElement = document.createElement("ul");
dropdownElement.id = "dropdown";
dropdownElement.style.position = "absolute";
dropdownElement.style.top = "125";
dropdownElement.style.left = "50%";
dropdownElement.style.width = "200px";
dropdownElement.style.height = "150px";
dropdownElement.style.transform = "translate(-50%, -50%)";
dropdownElement.style.display = "none";
dropdownElement.style.listStyleType = "none";
dropdownElement.style.backgroundColor = "rgba(255, 255, 255, 0.6)"; // Set opacity here

// Creer les elements de la liste
const listItem1 = document.createElement("li");
listItem1.textContent = "Finir la partie sans perdre d'endurance";
const listItem2 = document.createElement("li");
listItem2.textContent = "Terminer 10 mini jeux ";
const listItem3 = document.createElement("li");
listItem3.textContent = "Terminer 20 mini jeux ";
const listItem4 = document.createElement("li");
listItem4.textContent = "Terminer 50 mini jeux";
const listItem5 = document.createElement("li");
listItem5.textContent = "Terminer 100 mini jeux";

// Add list items to the dropdown
dropdownElement.appendChild(listItem1);
dropdownElement.appendChild(listItem2);
dropdownElement.appendChild(listItem3);
dropdownElement.appendChild(listItem4);
dropdownElement.appendChild(listItem5);

// Add event listeners to show./hide the dropdown
succesElement.addEventListener("mouseenter", () => {
    dropdownElement.style.display = "block";
});

succesElement.addEventListener("mouseleave", () => {
    dropdownElement.style.display = "none";
});

// Add the dropdown to the success element
succesElement.appendChild(dropdownElement);

menuElement.appendChild(succesElement);