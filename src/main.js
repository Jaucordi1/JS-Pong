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
class Box {
    /**
     * Create a new box in space
     *
     * @param {Vec2} pos
     * @param {Vec2} size
     */
    constructor(pos, size) {
        this.pos = pos;
        this.size = size;
    }

    get width() {
        return this.size.x;
    }

    set width(w) {
        this.size.x = w;
    }

    get height() {
        return this.size.y;
    }

    set height(h) {
        this.size.y = h;
    }

    get left() {
        return this.pos.x;
    }

    set left(x) {
        this.pos.x = x;
    }

    get top() {
        return this.pos.y;
    }

    set top(y) {
        this.pos.y = y;
    }

    get right() {
        return this.pos.x + this.size.x - 1;
    }

    set right(x) {
        this.pos.x = x - this.size.x;
    }

    get bottom() {
        return this.pos.y + this.size.y - 1;
    }

    set bottom(y) {
        this.pos.y = y - this.size.y;
    }

    get centerX() {
        return this.pos.x + (this.size.x / 2);
    }

    set centerX(x) {
        this.pos.x = x - (this.size.x / 2);
    }

    get centerY() {
        return this.pos.y + (this.size.y / 2);
    }

    set centerY(y) {
        this.pos.y = y - (this.size.y / 2);
    }

    get center() {
        return new Vec2(this.centerX, this.centerY);
    }
}

class Entity extends Box {
    /**
     * Create a new entity
     *
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */
    constructor(x, y, width, height) {
        super(new Vec2(x, y), new Vec2(width, height));
        this.vel = new Vec2;
    }

    /**
     * Update entity position
     *
     * @param {number} deltaTime
     */
    update(deltaTime) {
        this.pos.x += this.vel.x * deltaTime;
        this.pos.y += this.vel.y * deltaTime;
    }
}
class Timer {
    /**
     * @param {number} deltaTime
     */
    constructor(deltaTime = 1 / 60) {
        this.accumulatedTime = 0;
        this.lastTime = 0;
        this.deltaTime = deltaTime;
        this.needStop = false;

        this.frameProxy = (time) => {
            this.accumulatedTime += (time - this.lastTime) / 1000;

            if (this.accumulatedTime > 1)
                this.accumulatedTime = 1;

            while (this.accumulatedTime > this.deltaTime) {
                this.frame(this.deltaTime);
                this.accumulatedTime -= deltaTime;
            }

            this.lastTime = time;

            this.enqueue();
        };
    }

    enqueue() {
        if (!this.needStop)
            requestAnimationFrame(this.frameProxy);
    }

    start() {
        this.needStop = false;
        this.enqueue();
    }

    stop() {
        this.needStop = true;
    }

    /**
     * Called each frame !
     *
     * @param {number} deltaTime
     */
    frame(deltaTime) {
        console.log("Frame :", deltaTime);
    }
}
class Pong {
    /**
     * Create a new Pong game in the given canvas
     *
     * @param {HTMLCanvasElement|HTMLElement} canvas
     */
    constructor(canvas) {
        this.canvas = canvas;

        this.ball = new Entity(WIDTH / 2, HEIGHT / 2, 20, 20);
        this.ball.centerX = WIDTH / 2;
        this.ball.centerY = HEIGHT / 2;

        this.players = [new Entity(20, HEIGHT / 2, 20, 150), new Entity(WIDTH - 40, HEIGHT / 2, 20, 150)];
        this.players.forEach(player => player.centerY = HEIGHT / 2);

        this.timer = new Timer(1 / 30);
        this.timer.frame = (deltaTime) => {
            this.frame(deltaTime);
        };
    }

    get context() {
        return this.canvas.getContext('2d');
    }

    /**
     * Start the game
     */
    start() {
        this.ball.vel.x = 200 * (Math.random() * .5);
        this.ball.vel.y = 200 * (Math.random() * .5);

        this.timer.start();
    }

    /**
     * Called each frame before drawing
     *
     * @param {number} deltaTime
     */
    update(deltaTime) {
        this.ball.update(deltaTime);
        this.players.forEach(player => player.update(deltaTime));
    }

    /**
     * Call each frame after updating
     */
    draw() {
        const ctx = this.context;

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        ctx.fillStyle = 'white';
        ctx.fillRect(this.ball.left, this.ball.top, this.ball.width, this.ball.height);
        this.players.forEach(player => ctx.fillRect(player.left, player.top, player.width, player.height));
    }

    /**
     * Called each frame !
     *
     * @param {number} deltaTime
     */
    frame(deltaTime) {
        this.update(deltaTime);
        this.draw();
    }
}

const canvas = document.getElementById('screen');
canvas.width = WIDTH;
canvas.height = HEIGHT;

const PONG = new Pong(canvas);
PONG.start();