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

    frame(deltaTime) {
        console.log("Frame :", deltaTime);
    }
}
class Pong {
    constructor(canvas) {
        this.canvas = canvas;

        this.ball = new Box(new Vec2(WIDTH / 2, HEIGHT / 2), new Vec2(20, 20));
        this.ball.centerX = WIDTH / 2;
        this.ball.centerY = HEIGHT / 2;

        this.players = [new Box(new Vec2(20, HEIGHT / 2), new Vec2(20, 150)), new Box(new Vec2(WIDTH - 40, HEIGHT / 2), new Vec2(20, 150))];
        this.players.forEach(player => player.centerY = HEIGHT / 2);

        this.timer = new Timer(1 / 30);
        this.timer.frame = (deltaTime) => {
            this.frame(deltaTime);
        };
    }

    get context() {
        return this.canvas.getContext('2d');
    }

    start() {
        this.timer.start();
    }

    update(deltaTime) {

    }
    draw() {
        const ctx = this.context;

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        ctx.fillStyle = 'white';
        ctx.fillRect(this.ball.left, this.ball.top, this.ball.width, this.ball.height);
        this.players.forEach(player => ctx.fillRect(player.left, player.top, player.width, player.height));
    }

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