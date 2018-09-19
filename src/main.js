import {Ball, Player} from "./entities.js";

export const WIDTH = window.innerWidth, HEIGHT = window.innerHeight;

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
                Timer.frame(this.deltaTime);
                this.accumulatedTime -= deltaTime;
            }

            this.lastTime = time;

            this.enqueue();
        };
    }

    /**
     * Called each frame !
     *
     * @param {number} deltaTime
     */
    static frame(deltaTime) {
        console.log("Frame :", deltaTime);
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
}
class Pong {
    /**
     * Create a new Pong game in the given canvas
     *
     * @param {HTMLCanvasElement|HTMLElement} canvas
     */
    constructor(canvas) {
        this.canvas = canvas;

        this.ball = new Ball(WIDTH / 2, HEIGHT / 2);
        this.ball.checkX = () => {
            if (this.ball.right < 0 || this.ball.left > WIDTH) {
                // GOAL
                if (++this.players[(this.ball.vel.x < 0) ? 1 : 0].score > 2) {
                    this.winner = (this.ball.vel.x < 0) ? 1 : 0;
                    this.reset();
                    setTimeout(() => {
                        this.players.forEach(player => player.score = 0);
                        this.winner = -1;
                        this.start();
                    }, 3000);
                } else
                    this.start();
            }
        };
        this.players = [new Player(20, HEIGHT / 2), new Player(WIDTH - 40, HEIGHT / 2)];

        this.timer = new Timer(1 / 30);
        Timer.frame = (deltaTime) => {
            this.frame(deltaTime);
        };

        this.players[0].up = 'KeyW';
        this.players[0].down = 'KeyS';
        this.players[1].up = 'ArrowUp';
        this.players[1].down = 'ArrowDown';

        this.players.forEach(player => player.keyboard.listen());

        this.winner = -1;
    }

    get context() {
        return this.canvas.getContext('2d');
    }

    check(entity) {
        if (this.ball.overlaps(entity))
            entity.collide(this.ball);
    }

    /**
     * Start the game
     */
    start() {
        this.reset();

        this.ball.vel.x = 300 * (Math.random() * ((Math.random() >= 0.5) ? 1 : -1));
        this.ball.vel.y = 300 * (Math.random() * ((Math.random() >= 0.5) ? 1 : -1));

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

        if (this.ball.top < 0 || this.ball.bottom > HEIGHT) {
            if (this.ball.top < 0)
                this.ball.top = 0;
            else
                this.ball.bottom = HEIGHT;

            this.ball.vel.y = -this.ball.vel.y * 1.1;
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

        if (this.winner > -1) {
            if (this.winner > 0)
                ctx.fillStyle = 'red';
            else
                ctx.fillStyle = 'green';
        } else
            ctx.fillStyle = 'white';
        ctx.fillText(this.players[0].score, WIDTH / 4, 100);

        if (this.winner > -1) {
            if (this.winner > 0)
                ctx.fillStyle = 'green';
            else
                ctx.fillStyle = 'red';
        } else
            ctx.fillStyle = 'white';
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

window.addEventListener('mousemove', event => {
    const scale = event.offsetY / event.target.getBoundingClientRect().height;

    const player = (PONG.ball.vel.x < 0)
        ? PONG.players[(PONG.winner > -1) ? PONG.winner : ((PONG.ball.right > WIDTH - 45) ? 1 : 0)]
        : PONG.players[(PONG.winner > -1) ? PONG.winner : ((PONG.ball.left < 45) ? 0 : 1)];
    player.pos.y = HEIGHT * scale - player.height / 2;
});