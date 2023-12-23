const RED = 0;
const GREEN = 1;
const BLUE = 2;
const ALPHA = 3;

class Environment {
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
        this.#nextValues = math.matrix(math.zeros(this.width, this.height));
    }

    draw(img) {

        img.loadPixels();
        let values = this.#values.valueOf();
        for (let x = 0; x < Constants.WIDTH; ++x)
            for (let y = 0; y < Constants.HEIGHT; ++y)
                img.set(x, y, 127 + values[x][y]);
        img.updatePixels();
    }
}
