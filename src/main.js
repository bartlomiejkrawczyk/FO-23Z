const environment = new Environment(Constants.WIDTH, Constants.HEIGHT)
const radar = new Radar(Constants.WIDTH / 4, Constants.HEIGHT / 4);
const customEvents = new CustomEvents(environment);

let img;

function setup() {
    createCanvas(Constants.windowWidth, Constants.windowHeight).parent('canvas');
    noSmooth();
    canvas.imageSmoothingEnabled = false;
    img = createImage(Constants.WIDTH, Constants.HEIGHT);
}

function _update() {
    for (let i = 0; i < Variables.stepsPerFrame; i++) {
        radar.update(environment);
        environment.update();
        Variables.incrementTimer();
    }
}

function draw() {
    _update();
    environment.draw(img);
    image(img, 0, 0, Constants.windowWidth, Constants.windowHeight);
    noStroke();
    fill(200, 0, 100, 100);
    rect(mouseX, mouseY, 10, 10);
}