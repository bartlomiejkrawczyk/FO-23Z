const environment = new Environment(Constants.WIDTH, Constants.HEIGHT);
const radar = new Radar(Constants.WIDTH / 4, Constants.HEIGHT / 4);
const customEvents = new CustomEvents(environment, radar);

let img;
let squares = [];

function setup() {
    createCanvas(Constants.windowWidth, Constants.windowHeight).parent('canvas');
    noSmooth();
    canvas.imageSmoothingEnabled = false;
    img = createImage(Constants.WIDTH, Constants.HEIGHT);
}

function _update() {
    if (!Variables.running)
        return;
    for (let i = 0; i < Variables.stepsPerFrame; i++) {
        radar.update(environment);
        environment.update();
        Variables.incrementTimer();
    }
}

function handleMousePress() {
    let centerX = Math.round(mouseX / Constants.SCALE);
    let centerY = Math.round(mouseY / Constants.SCALE);
    console.log(centerX);
    for (let x = 0; x < Constants.CURSOR_SIZE / 2; ++x) {
        for (let y = 0; y < Constants.CURSOR_SIZE / 2; ++y) {
            environment.addObstacle(centerX + x, centerY + y);
            environment.addObstacle(centerX + x, centerY - y);
            environment.addObstacle(centerX - x, centerY + y);
            environment.addObstacle(centerX - x, centerY - y);
        }
    }
}

function draw() {

    if (mouseIsPressed) {
        handleMousePress();
        // environment.init();
        // radar.reset();
        // TU DODAĆ ŻEBY W TYM MIEJSCU BYŁY ZERA NA ENV
    } else {
        _update();
    }

    environment.draw(img);
    image(img, 0, 0, Constants.windowWidth, Constants.windowHeight);
    radar.draw();

    noStroke();
    fill(200, 0, 100, 100);
    rect(mouseX - 5, mouseY - 5, 10, 10);
}
