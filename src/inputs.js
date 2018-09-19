export const PRESSED = Symbol('pressed'), RELEASED = Symbol('released');

export class Keyboard {
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