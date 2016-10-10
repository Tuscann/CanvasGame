let canvas = document.getElementById('myCanvas');
let context = canvas.getContext('2d');
let imageObj = new Image();

imageObj.onload = function() {
    context.drawImage(imageObj, 69, 50);
};
imageObj.src = 'http://www.html5canvastutorials.com/demos/assets/darth-vader.jpg';



