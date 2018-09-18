const WIDTH = window.innerWidth, HEIGHT = window.innerHeight;
const PRESSED = Symbol('pressed'), RELEASED = Symbol('released');

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

    get len() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    set len(value) {
        const f = value / this.len;
        this.x *= f;
        this.y *= f;
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

    /**
     *
     * @param {Box} box
     */
    overlaps(box) {
        return this.left < box.right
            && this.right > box.left
            && this.top < box.bottom
            && this.bottom > box.top;
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

    collide(entity) {
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

class Keyboard {
    constructor() {
        this.holdedKeys = new Map();
        this.keyStates = new Map();
    }

    /**
     * @param {string} code
     * @param {function} callback
     */
    register(code, callback) {
        if (this.holdedKeys.has(code))
            this.holdedKeys.delete(code);

        this.holdedKeys.set(code, callback);
    }

    /**
     * @param {Event} event
     */
    event(event) {
        const {code} = event;

        if (!this.holdedKeys.has(code))
            return;

        event.preventDefault();

        const keyState = event.type === 'keydown' ? PRESSED : RELEASED;

        if (this.keyStates.get(code) === keyState)
            return;

        this.keyStates.set(code, keyState);
        this.holdedKeys.get(code)(keyState);
    }

    listen() {
        ["keydown", "keyup"].forEach(eventName => window.addEventListener(eventName, (e) => this.event(e)));
    }
}
class Player extends Entity {
    /**
     * Create a new Player entity
     *
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        super(x, y, 20, 150);

        this.score = 0;
        this.keyboard = new Keyboard();
    }

    /**
     * @param {string} key
     */
    set up(key) {
        this.keyboard.register(key, (keyState) => {
            this.vel.y += (keyState === PRESSED) ? -1 : 1;
        });
    }

    /**
     * @param {string} key
     */
    set down(key) {
        this.keyboard.register(key, (keyState) => {
            this.vel.y += (keyState === PRESSED) ? 1 : -1;
        });
    }

    collide(ball) {
        if (this.left < ball.right && this.right > ball.left && this.top < ball.bottom && this.bottom > ball.top) {
            ball.vel.x = -ball.vel.x * 1.05;
            const len = ball.vel.len;
            ball.vel.y += this.vel.y * .2;
            ball.vel.len = len;
        }
    }

    /**
     * @param {number} deltaTime
     */
    update(deltaTime) {
        this.pos.y += (this.vel.y * 200) * deltaTime;
        PONG.checkY(this);
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
        this.players = [new Player(20, HEIGHT / 2), new Player(WIDTH - 40, HEIGHT / 2)];

        this.timer = new Timer(1 / 30);
        this.timer.frame = (deltaTime) => {
            this.frame(deltaTime);
        };

        this.players[0].up = 'KeyW';
        this.players[0].down = 'KeyS';
        this.players[1].up = 'ArrowUp';
        this.players[1].down = 'ArrowDown';

        this.players.forEach(player => player.keyboard.listen());
    }

    get context() {
        return this.canvas.getContext('2d');
    }

    check(entity) {
        if (this.ball.overlaps(entity)) {
            entity.collide(this.ball);
        }
    }

    /**
     * @param {Player} player
     */
    checkY(player) {
        if (player.top < 0)
            player.top = 0;
        if (player.bottom > HEIGHT)
            player.bottom = HEIGHT;
    }

    /**
     * Start the game
     */
    start() {
        this.reset();

        this.ball.vel.x = 200 * (Math.random() * .5);
        this.ball.vel.y = 200 * (Math.random() * .5);

        this.timer.start();
    }

    /**
     * Freeze the ball and place it at the center, also centering players on Y-axis
     */
    reset() {
        this.ball.vel.set(0, 0);
        this.ball.centerX = WIDTH / 2;
        this.ball.centerY = HEIGHT / 2;

        this.players.forEach(player => player.centerY = HEIGHT / 2);
    }

    /**
     * Called each frame before drawing
     *
     * @param {number} deltaTime
     */
    update(deltaTime) {
        this.ball.update(deltaTime);

        if (this.ball.right < 0 || this.ball.left > WIDTH) {
            // GOAL
            ++this.players[(this.ball.vel.x < 0) ? 1 : 0].score;
            this.start();
        }

        if (this.ball.top < 0 || this.ball.bottom > HEIGHT) {
            if (this.ball.top < 0)
                this.ball.top = 0;
            else
                this.ball.bottom = HEIGHT;

            this.ball.vel.y = -this.ball.vel.y * 1.05;
        }

        this.players.forEach(player => player.update(deltaTime));
        this.players.forEach(player => this.check(player));
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

        ctx.textAlign = 'center';
        ctx.font = (HEIGHT / 10) + 'px Arial';
        ctx.fillText(this.players[0].score, WIDTH / 4, 100);
        ctx.fillText(this.players[1].score, WIDTH / 4 * 3, 100);
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