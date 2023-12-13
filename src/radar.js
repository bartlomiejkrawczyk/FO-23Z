class Radar {
    static DEFAULT_WAVE_EMITTERS = 100

    #x;
    #y;
    #rotation;

    #wave_emitters;

    #spacing;

    #omega = 5;
    #amplitude;

    constructor(x, y, rotation = 0, spacing = 1, amplitude = Constants.AMPLITUDE, wave_emitters = Radar.DEFAULT_WAVE_EMITTERS) {
        this.#x = x;
        this.#y = y;
        this.#rotation = rotation;
        this.#wave_emitters = wave_emitters;
        this.#spacing = spacing;
        this.#amplitude = amplitude;
    }

    update(environment) {
        environment.setValue(this.#x, this.#y, this.#amplitude * sin(this.#omega * Variables.time))
    }
}
