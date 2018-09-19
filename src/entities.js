import {Box, Vec2} from "./math.js";
import {Keyboard, PRESSED} from "./inputs.js";
import {HEIGHT} from "./main.js";

export class Entity extends Box {
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

export class Player extends Entity {
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

    checkY() {
        if (this.top < 0)
            this.top = 0;
        if (this.bottom > HEIGHT)
            this.bottom = HEIGHT;
    }

    /**
     * @param {number} deltaTime
     */
    update(deltaTime) {
        this.pos.y += (this.vel.y * 200) * deltaTime;
        this.checkY();
    }
}

export class Ball extends Entity {
    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        super(x, y, 20, 20);
    }

    checkX() {

    }

    checkY() {
        if (this.top < 0 || this.bottom > HEIGHT) {
            if (this.top < 0)
                this.top = 0;
            else
                this.bottom = HEIGHT;

            this.vel.y = -this.vel.y * 1.05;
        }
    }

    /**
     * @param {number} deltaTime
     */
    update(deltaTime) {
        this.pos.x += this.vel.x * deltaTime;
        this.checkX();

        this.pos.y += this.vel.y * deltaTime;
        this.checkY();
    }
}