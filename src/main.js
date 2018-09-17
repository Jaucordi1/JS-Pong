const WIDTH = window.innerWidth, HEIGHT = window.innerHeight;

const canvas = document.getElementById('screen');
canvas.width = WIDTH;
canvas.height = HEIGHT;

const context = canvas.getContext('2d');

context.fillStyle = 'black';
context.fillRect(0, 0, WIDTH, HEIGHT);