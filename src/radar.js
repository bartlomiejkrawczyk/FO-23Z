class Radar {
    static DEFAULT_WAVE_EMITTERS = 21;

    #x;
    #y;
    #rotation;

    #waveEmitters;

    #amplitude;

    #impulsDuration;
    #awaitSignal = false;
    #duration;
    #durationMin;
    #currentMin;
    #durationMax;
    #currentMax;
    #timeout;

    constructor(x, y, rotation = 0.0, amplitude = Constants.AMPLITUDE, waveEmitters = Radar.DEFAULT_WAVE_EMITTERS) {
        this.#x = Math.round(x);
        this.#y = Math.round(y);
        this.#rotation = rotation;
        this.#waveEmitters = waveEmitters;
        this.#amplitude = amplitude;
        this.#impulsDuration = 0;
        this.initiate_impuls();
    }

    reset() {
        this.#impulsDuration = 0;
        this.#awaitSignal = false;
        this.#duration = 0;
        this.#durationMin = 0;
        this.#currentMin = 0;
        this.#durationMax = 0;
        this.#currentMax = 0;
        this.#timeout = 0;
        this.initiate_impuls();
    }

    update(environment) {
        if (this.#awaitSignal) {
            this.#timeout -= Variables.dt;
            this.#duration += Variables.dt;
            this.detect(environment);
            this.#timeout = math.max(this.#timeout, 0);
            if (this.#timeout == 0) {
                this.#awaitSignal = false;
                this.rotate();
                this.initiate_impuls();
            }
        } else {
            if (this.#impulsDuration > 0) {
                this.sendWave(environment);
            } else {
                this.enterDetectionMode();
            }
        }

        this.clearEnvironmentBehindRadar(environment);

        this.#impulsDuration -= Variables.dt;
        this.#impulsDuration = math.max(this.#impulsDuration, 0);
    }

    detect(environment) {
        let measurement = environment.getValue(this.#x, this.#y);
        if (measurement > this.#currentMax && this.#duration > 50 * Variables.dt) {
            this.#currentMax = measurement;
            this.#durationMax = this.#duration;
            // console.log("Duration for " + this.#currentMax + " is " + this.#duration + " it equals to " + (this.#duration - (1.0 / Variables.omega) * Math.PI) * Variables.velocity);
        }
        if (measurement < this.#currentMin && this.#duration > 50 * Variables.dt) {
            this.#currentMin = measurement;
            this.#durationMin = this.#duration;
            // console.log("Duration for " + this.#currentMin + " is " + this.#duration + " it equals to " + (this.#duration) * Variables.velocity);
        }
    }

    initiate_impuls() {
        console.log("Impuls");
        this.#impulsDuration = 2 * (1.0 / Variables.omega) * Math.PI;
    }

    sendWave(environment) {
        const cosRotation = cos(this.#rotation);
        const sinRotation = sin(this.#rotation);

        const dx = Variables.speakerSpacing * cosRotation;
        const dy = Variables.speakerSpacing * sinRotation;

        // Start in the middle and update values for every wave emitter
        let x1 = this.#x;
        let y1 = this.#y;
        let x2 = this.#x;
        let y2 = this.#y;
        const signalValue = this.#amplitude * sin(Variables.omega * Variables.time);
        for (let i = 0; i < this.#waveEmitters / 2; ++i) {
            environment.setValue(Math.round(x1), Math.round(y1), signalValue);
            environment.setValue(Math.round(x2), Math.round(y2), signalValue);
            x1 += dx;
            x2 -= dx;
            y1 += dy;
            y2 -= dy;
        }
    }

    enterDetectionMode() {
        this.#awaitSignal = true;
        this.#timeout = math.max(Constants.WIDTH, Constants.HEIGHT) / Variables.velocity / 100;
        this.#duration = 0;
        this.#durationMax = 0;
        this.#currentMax = 0;
        this.#durationMin = 0;
        this.#currentMin = 0;
    }

    clearEnvironmentBehindRadar(environment) {
        // Rotate the dx, dy vector based on the rotation value
        const cosRotation = cos(this.#rotation);
        const tanRotation = tan(this.#rotation);
        // Set values to 0 for points under the line with the specified rotation
        for (let x = 0; x < Constants.WIDTH; ++x) {
            for (let y = 0; y < Constants.HEIGHT; ++y) {
                // Calculate the y-coordinate of the line for the given x-coordinate and rotation
                const lineY = this.#y + tanRotation * (x - this.#x);

                // If the point is on the opposite side of the line, set its value to 0
                if ((y > lineY && cosRotation > 0) || (y < lineY && cosRotation < 0)) {
                    environment.setValue(x, y, 0);
                }
            }
        }
    }

    rotate() {
        this.#rotation += Constants.ROTATION;
        if (this.#rotation > 2 * Math.PI) {
            this.#rotation = this.#rotation - 2 * Math.PI;
        }
    }
}
