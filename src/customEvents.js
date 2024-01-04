class CustomEvents {
    constructor(environment, radar, running) {
        document.addEventListener('DOMContentLoaded', function () {
            var stepsPerFrameValueDisplay = document.getElementById('stepsPerFrameValue');
            var omegaValueDisplay = document.getElementById('omegaValue');
            var speakerSpacingValueDisplay = document.getElementById('speakerSpacingValue');

            document.getElementById('stepsPerFrameInput').addEventListener('input', evt => {
                Variables.stepsPerFrame = int(evt.target.value);
                stepsPerFrameValueDisplay.textContent = Variables.stepsPerFrame;
            });

            document.getElementById('omegaInput').addEventListener('input', evt => {
                Variables.omega = int(evt.target.value);
                omegaValueDisplay.textContent = Variables.omega;
            });

            document.getElementById('speakerSpacingInput').addEventListener('input', evt => {
                Variables.speakerSpacing = int(evt.target.value);
                speakerSpacingValueDisplay.textContent = Variables.speakerSpacing;
            });
        });

        document.getElementById('restartButton').addEventListener('click', evt => {
            environment.init();
            radar.reset();
            Variables.reset();
            Variables.running = false;
            var startButton = document.getElementById('startButton');
            startButton.value = 'Start';
            startButton.style.backgroundColor = '#2ecc71';
        });

        document.getElementById('startButton').addEventListener('click', evt => {
            Variables.running = !Variables.running;

            var startButton = document.getElementById('startButton');
            if (Variables.running) {
                startButton.value = 'Stop';
                startButton.style.backgroundColor = '#e74c3c';
            } else {
                startButton.value = 'Start';
                startButton.style.backgroundColor = '#2ecc71';
            }
        });
    }
}