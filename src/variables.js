class Variables {

    static #stepsPerFrame = 5;
    static #dt = 1 / 60 / Variables.#stepsPerFrame;
    static #velocity = 0.5;
    static #c2 = Variables.#calculateC2();
    static #damping = 0;
    static #time = 0;

    static get stepsPerFrame() {
        return Variables.#stepsPerFrame;
    }

    static get dt() {
        return Variables.#dt;
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
        Variables.#c2 = Variables.#calculateC2();
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
