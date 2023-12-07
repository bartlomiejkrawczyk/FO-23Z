// równanie fali 2D

const H = 128;
const L = 2 * H;
let u = new Array(L); // u(t)
let u_next = new Array(L); // u(t)
let u_prev = new Array(L); // u(t)

let img;
const SCALE = 2;
let A = 10 * 127;
let omega = 1;
let t = 0;
const steps_per_frame = 5;
const dt = 1 / 60 / steps_per_frame;

let speakerSpacing = 1;
const waveSpeed = (omega / (2 * Math.PI)) * (2 * speakerSpacing);
const v = waveSpeed; // prędkość fazowa
const dx = 1 / L;
const c2 = v * v * dt * dt / dx / dx;
const alpha = 0.2; // tłumienie

const frequency = omega / (2 * Math.PI);
//const waveSpeed = Math.sqrt(c2 * dx * dx / dt / dt);
const wavelength = waveSpeed / frequency;

let timeout = 0;

let omega_radar = 0;
let radar_direction;

let speakersCount = 10;
let wallSize = 5;

// Events
document.getElementById('restartButton').addEventListener('click', evt => {
  for (let x = 0; x < L; ++x)
    for (let y = 0; y < L; ++y) {
      u[x][y] = 0;
      u_next[x][y] = 0;
      u_prev[x][y] = 0;
    }
  timeout = 0;
  t = 0;
});
document.addEventListener('DOMContentLoaded', function() {
  var amplitudeValueDisplay = document.getElementById('amplitudeValue');
  var omegaValueDisplay = document.getElementById('omegaValue');
  var spacingValueDisplay = document.getElementById('spacingValue');
  var omegaRadarValueDisplay = document.getElementById('omegaRadarValue');
  var speakersCountValueDisplay = document.getElementById('speakersCountValue');

  document.getElementById('amplitudeInput').addEventListener('input', evt => {
    A = evt.target.value * 127;
    amplitudeValueDisplay.textContent = A;
  });

  document.getElementById('omegaInput').addEventListener('input', evt => {
    omega = evt.target.value / 10;
    omegaValueDisplay.textContent = omega;
  });

  document.getElementById('spacingInput').addEventListener('input', evt => {
    speakerSpacing = int(evt.target.value);
    spacingValueDisplay.textContent = speakerSpacing;
  });

  document.getElementById('omegaRadarInput').addEventListener('input', evt => {
    omega_radar = int(evt.target.value);
    radar_direction = createVector(cos(radians(omega_radar)), sin(radians(omega_radar)));
    omegaRadarValueDisplay.textContent = omega_radar;
  });

  document.getElementById('speakersCountInput').addEventListener('input', evt => {
    speakersCount = int(evt.target.value);
    speakersCountValueDisplay.textContent = speakersCount;
  });
});


function setup() {
  radar_direction = createVector(cos(radians(omega_radar)), sin(radians(omega_radar)));
  createCanvas(L * SCALE, L * SCALE);
  img = createImage(L, L);

  for (let i = 0; i < L; ++i) {
    u[i] = new Array(L);
    u_next[i] = new Array(L);
    u_prev[i] = new Array(L);
  }

  for (let x = 0; x < L; ++x)
    for (let y = 0; y < L; ++y) {
      u[x][y] = 0;
      u_next[x][y] = 0;
      u_prev[x][y] = 0;
    }
}

function _update() {

  for (let x = 1; x < L - 1; ++x)
    for (let y = 1; y < L - 1; ++y) {
      u_next[x][y] = 2 * u[x][y] - u_prev[x][y];
      u_next[x][y] += c2 * (u[x + 1][y] - 2 * u[x][y] + u[x - 1][y]);
      u_next[x][y] += c2 * (u[x][y + 1] - 2 * u[x][y] + u[x][y - 1]);
      u_next[x][y] -= alpha * dt * (u[x][y] - u_prev[x][y]);
    }

  // brzegi
  for (let x = 0; x < L; ++x) {
    u_next[x][0] = u_next[x][1];
    u_next[0][x] = u_next[1][x];
    u_next[x][L - 1] = u_next[x][L - 2];
    u_next[L - 1][x] = u_next[L - 2][x];
  }

  for (let x = 0; x < L; ++x) {
    u_prev[x] = u[x].slice();
    u[x] = u_next[x].slice();
  }
}

function draw() {

  timeout += 1;

  const d = 8;
  const offset =int((L%d)/2);

  for (let step = 0; step < steps_per_frame; ++step) {
    if (timeout < omega * Math.PI) {
      let currentSpeaker = createVector(L/2, L/2);
      for(let speaker = 0; speaker < speakersCount; speaker++) {
        currentSpeaker.add(radar_direction);
        const x = Math.round(currentSpeaker.x);
        const y = Math.round(currentSpeaker.y);
        u[x][y] = A * sin(omega * t);
      }
      currentSpeaker = createVector(L/2, L/2);
      for(let speaker = 0; speaker < speakersCount; speaker++) {
        currentSpeaker.sub(radar_direction);
        const x = Math.round(currentSpeaker.x);
        const y = Math.round(currentSpeaker.y);
        u[x][y] = A * sin(omega * t);
      }
    }

    let wall = createVector(L/2, L/2);
    for(let speaker = 0; speaker < speakersCount * 2; speaker++) {
      wall.add(radar_direction);
      console.log(radar_direction);
      // for(let currentSize = 0; currentSize < wallSize; currentSize++)
      const x = Math.round(wall.x) + (radar_direction.y <= 0 ? 1 : -1);
      const y = Math.round(wall.y) + (radar_direction.x <= 0 ? 1 : -1);
      u[x][y] = 0;
    }
    // wall = createVector(L/2, L/2);
    // for(let speaker = 0; speaker < speakersCount; speaker++) {
    //   wall.sub(radar_direction);
    //   const x = Math.round(wall.x) + (radar_direction.x <= 0 ? 1 : -1);
    //   const y = Math.round(wall.y) + (radar_direction.y <= 0 ? 1 : -1);
    //   u[x][y] = 0;
    // }

    _update()
    t += dt;
  }
  img.loadPixels();
  for (let x = 0; x < L; ++x)
    for (let y = 0; y < L; ++y)
      img.set(x, y, 127 + u[x][y]);

  img.updatePixels();
  image(img, 0, 0, L * SCALE, L * SCALE);
}