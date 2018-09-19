import {Entity, Player} from "./entities";

const WIDTH = window.innerWidth, HEIGHT = window.innerHeight;

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