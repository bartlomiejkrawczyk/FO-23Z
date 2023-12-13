const RED = 0;
const GREEN = 1;
const BLUE = 2;
const ALPHA = 3;

class Environment {
    static positiveAmplitude = [0, 255, 0];
    static negativeAmplitude = [255, 0, 0];

    #previousValues;
    #values;
    #nextValues;

    #obstacles;

    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.init();
    }

    setValue(x, y, v) {
        this.#values.valueOf()[x][y] = v;
    }

    init() {
        this.#previousValues = math.matrix(math.zeros(this.width, this.height));
        this.#values = math.matrix(math.zeros(this.width, this.height));
        this.#nextValues = math.matrix(math.zeros(this.width, this.height));
    }

    update() {
        let previousValues = this.#previousValues.valueOf();
        let values = this.#values.valueOf();
        let nextValues = this.#nextValues.valueOf();

        for (let x = 1; x < this.width - 1; ++x) {
            for (let y = 1; y < this.height - 1; ++y) {
                nextValues[x][y] = 2 * values[x][y] - previousValues[x][y];
                nextValues[x][y] += Variables.c2 * (values[x + 1][y] - 2 * values[x][y] + values[x - 1][y]);
                nextValues[x][y] += Variables.c2 * (values[x][y + 1] - 2 * values[x][y] + values[x][y - 1]);
                nextValues[x][y] -= Variables.damping * Variables.dt * (values[x][y] - previousValues[x][y]);
            }
        }

        // edges
        for (let x = 0; x < this.width; ++x) {
            nextValues[x][0] = nextValues[x][1];
            nextValues[x][this.height - 1] = nextValues[x][this.height - 2];
        }
        for (let y = 0; y < this.height; ++y) {
            nextValues[0][y] = nextValues[1][y];
            nextValues[this.width - 1][y] = nextValues[this.width - 2][y];
        }

        // obstacles: TODO

        this.#previousValues = this.#values;
        this.#values = this.#nextValues;
    }

    draw(img) {

        img.loadPixels();
        this.#values.forEach((value, [x, y], _) => {
            let index = (y * img.width + x) * 4;

            let colorUsed = value >= 0 ? Environment.positiveAmplitude : Environment.negativeAmplitude;
            img.pixels[index + RED] = colorUsed[RED];
            img.pixels[index + GREEN] = colorUsed[GREEN];
            img.pixels[index + BLUE] = colorUsed[BLUE];

            img.pixels[index + ALPHA] = Math.abs(value);
        });
        img.updatePixels();
    }
}
