const environment = new Environment(Constants.WIDTH, Constants.HEIGHT);
const radar = new Radar(Constants.WIDTH / 4, Constants.HEIGHT / 4);
const customEvents = new CustomEvents(environment);

let img;
let squares = [];

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

    if (mouseIsPressed) {
        let square = {
            x: mouseX - 5,
            y: mouseY - 5
        };
        squares.push(square);
        // TU DODAĆ ŻEBY W TYM MIEJSCU BYŁY ZERA NA ENV
    }

    environment.draw(img);
    image(img, 0, 0, Constants.windowWidth, Constants.windowHeight);

    for (let i = 0; i < squares.length; i++) {
        noStroke();
        fill(200, 0, 100, 100);
        rect(squares[i].x, squares[i].y, 10, 10);
    }
    noStroke();
    fill(200, 0, 100, 100);
    rect(mouseX - 5 , mouseY - 5, 10, 10);
}
