// Create a canvas element
const canvas = document.getElementById('arc');
canvas.width = innerWidth - 100;
canvas.height = innerHeight - 100;
const ctx = canvas.getContext('2d');

// Create a moving point
let x = canvas.width / 2;
let y = canvas.height / 2;
let dx = 0.75;
let dy = 0.75;

function animate() {
    requestAnimationFrame(animate);
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the sky
    ctx.fillStyle = 'skyblue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw the target
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 150, 0, Math.PI * 2);
    ctx.fillStyle = 'white'; 
    ctx.fill();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 130, 0, Math.PI * 2);
    ctx.fillStyle = 'black'; 
    ctx.fill();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 100, 0, Math.PI * 2);
    ctx.fillStyle = 'blue'; 
    ctx.fill();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 65, 0, Math.PI * 2);
    ctx.fillStyle = 'red'; 
    ctx.fill();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 30, 0, Math.PI * 2);
    ctx.fillStyle = 'yellow'; 
    ctx.fill();
    ctx.closePath();
    
    // Update the position of the point
    x += dx;
    y += dy;
    
    // Reverse the direction if the point reaches the edge of the target
    if (x + 10 > canvas.width / 2 + 100 || x - 10 < canvas.width / 2 - 100) {
        dx = -dx;
    }
    if (y + 10 > canvas.height / 2 + 145 || y - 10 < canvas.height / 2 - 145) {
        dy = -dy;
    }
    
    // Draw the moving point
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fillStyle = 'transparent'; 
    ctx.strokeStyle = 'black'; // Set the border color to black
    ctx.lineWidth = 2; // Set the border width
    ctx.fill();
    ctx.stroke(); // Draw the border

    // Draw a straight line inside the moving point
    ctx.beginPath();
    ctx.moveTo(x - 15, y);
    ctx.lineTo(x + 15, y);
    ctx.strokeStyle = 'black'; // Set the line color to black
    ctx.lineWidth = 2; // Set the line width
    ctx.stroke(); // Draw the line

    ctx.beginPath();
    ctx.moveTo(x, y - 15);
    ctx.lineTo(x, y + 15);
    ctx.strokeStyle = 'black'; // Set the line color to black
    ctx.lineWidth = 2; // Set the line width
    ctx.stroke(); // Draw the line
    ctx.closePath();

    // Draw the moving point
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'transparent'; 
    ctx.strokeStyle = 'black'; // Set the border color to black
    ctx.lineWidth = 2; // Set the border width
    ctx.fill();
    ctx.stroke(); // Draw the border
    ctx.closePath();


}
 // Récupérer l'ancre URL
 const hash = window.location.hash;
 // Vérifier si l'ancre URL contient le mot 'tennis'
 if (hash.includes('arc')) {
    // Afficher l'ancre URL dans la console
    console.log(hash);

    // Montrer le canvas
    canvas.style.display = "block";
    animate();

 }


