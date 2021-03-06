export class Vec2 {
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

export class Box {
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