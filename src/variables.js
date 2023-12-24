class Variables {

    static #stepsPerFrame = 5;
    static #dt = 1.0 / 60.0 / Variables.#stepsPerFrame;
    static #omega = 80.0;
    static #speakerSpacing = 2.0;
    /**
     * Magic number so that the simulation works correctly
     */
    static #velocityMultiplier = 1.0 / this.#omega;
    static #velocity = Variables.#calculateVelocity();
    static #c2 = Variables.#calculateC2();
    static #damping = 0.8;
    static #time = 0.0;

    static get stepsPerFrame() {
        return Variables.#stepsPerFrame;
    }

    static get dt() {
        return Variables.#dt;
    }

    static get omega() {
        return Variables.#omega;
    }

    static set omega(value) {
        Variables.#omega = value;
        Variables.#recalculateValues();
    }

    static get speakerSpacing() {
        return Variables.#speakerSpacing;
    }

    static set speakerSpacing(value) {
        Variables.#speakerSpacing = value;
        Variables.#recalculateValues();
    }

    static get velocity() {
        return Variables.#velocity;
    }

    static get c2() {
        return Variables.#c2;
    }

    static get damping() {
        return Variables.#damping;
    }
    static set damping(value) {
        Variables.#damping = value;
    }

    static get time() {
        return Variables.#time;
    }

    static #recalculateValues() {
        Variables.#velocity = Variables.#calculateVelocity();
        Variables.#c2 = Variables.#calculateC2();
    }

    static #calculateVelocity() {
        return Variables.#omega / (2 * Math.PI) * (2 * Variables.#speakerSpacing) * Variables.#velocityMultiplier;
    }

    static #calculateC2() {
        return Variables.#velocity * Variables.#velocity
            * Variables.#dt * Variables.#dt
            / (Constants.dx * Constants.dy);
    }

    static reset() {
        Variables.#time = 0;
        Variables.#recalculateValues();
    }

    static incrementTimer() {
        Variables.#time += Variables.#dt;
    }
}
