class Constants {
    static WIDTH = 256;
    static HEIGHT = 256;

    static AMPLITUDE = 127;

    static SCALE = 2;
    static CURSOR_SIZE = 5;

    static ROTATION = Math.PI / 8 + 0.2;

    static get windowWidth() {
        return Constants.WIDTH * Constants.SCALE;
    }

    static get windowHeight() {
        return Constants.HEIGHT * Constants.SCALE
    }

    static get dx() {
        return 1 / Constants.WIDTH;
    }

    static get dy() {
        return 1 / Constants.HEIGHT;
    }
}
