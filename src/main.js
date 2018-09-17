const WIDTH = window.innerWidth, HEIGHT = window.innerHeight;

class Pong {
    constructor(canvas) {
        this.canvas = canvas;
    }

    get context() {
        return this.canvas.getContext('2d');
    }

    draw() {
        const ctx = this.context;

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }
}

const canvas = document.getElementById('screen');
canvas.width = WIDTH;
canvas.height = HEIGHT;

const PONG = new Pong(canvas);
PONG.draw();