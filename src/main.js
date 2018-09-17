const WIDTH = window.innerWidth, HEIGHT = window.innerHeight;

class Vec2 {
    /**
     * Create a new Vector
     *
     * @param {number} x X coordinate
     * @param {number} y Y coordinate
     */
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    /**
     * Set coordinates to "x" and "y"
     *
     * @param {number} x New X coordinate
     * @param {number} y New Y coordinate
     */
    set(x, y) {
        this.x = x;
        this.y = y;
    }
}
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