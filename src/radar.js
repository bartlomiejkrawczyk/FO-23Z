class Radar {
    static DEFAULT_WAVE_EMITTERS = 100

    #x;
    #y;
    #rotation;

    #waveEmitters;

    #spacing;

    #omega = 10.0;
    #amplitude;

    #impulsDuration;
    #awaitSignal = false;
    #timeout;

    constructor(x, y, rotation = 0.2, spacing = 1.0, amplitude = Constants.AMPLITUDE, waveEmitters = Radar.DEFAULT_WAVE_EMITTERS) {
        this.#x = Math.round(x);
        this.#y = Math.round(y);
        this.#rotation = rotation;
        this.#waveEmitters = waveEmitters;
        this.#spacing = spacing;
        this.#amplitude = amplitude;
        this.#impulsDuration = 0;
        this.impuls();
    }

    update(environment) {
        // Rotate the dx, dy vector based on the rotation value
        const cosRotation = cos(this.#rotation);
        const sinRotation = sin(this.#rotation);
        const tanRotation = tan(this.#rotation);

        const dx = this.#spacing * cosRotation;
        const dy = this.#spacing * sinRotation;

        // Start in the middle and update values for every wave emitter
        let x1 = this.#x;
        let y1 = this.#y;
        let x2 = this.#x;
        let y2 = this.#y;

        if (this.#awaitSignal) {
            this.#timeout -= Variables.dt;
            let measurement = environment.getValue(this.#x, this.#y);
            if (measurement > 2) {
                console.log(measurement);
            }
            this.#timeout = math.max(this.#timeout, 0);
            if (this.#timeout == 0) {
                this.#awaitSignal = false;
                this.rotate();
                this.impuls();
            }
        }

        if (this.#impulsDuration > 0) {
            for (let i = 0; i < this.#waveEmitters / 2; ++i) {
                environment.setValue(Math.round(x1), Math.round(y1), this.#amplitude * sin(this.#omega * Variables.time));
                environment.setValue(Math.round(x2), Math.round(y2), this.#amplitude * sin(this.#omega * Variables.time));
                x1 += dx;
                x2 -= dx;
                y1 += dy;
                y2 -= dy;
            }
        } else if (!this.#awaitSignal) {
            this.#awaitSignal = true;
            this.#timeout = 5.0;
        }

        // Set values to 0 for points under the line with the specified rotation
        for (let x = 0; x < Constants.WIDTH; ++x) {
            for (let y = 0; y < Constants.HEIGHT; ++y) {
                // Calculate the y-coordinate of the line for the given x-coordinate and rotation
                const lineY = this.#y + tanRotation * (x - this.#x);

                // If the point is under the line, set its value to 0
                if (y > lineY && tanRotation > 0) {
                    environment.setValue(x, y, 0);
                } else if (y < lineY && tanRotation < 0) {
                    environment.setValue(x, y, 0);
                }
            }
        }

        this.#impulsDuration -= Variables.dt;
        this.#impulsDuration = math.max(this.#impulsDuration, 0);
    }

    impuls() {
        console.log("Impuls");
        this.#impulsDuration = 2 * (1.0 / this.#omega) * Math.PI;
    }

    rotate() {
        this.#rotation += Constants.ROTATION;
    }
}
