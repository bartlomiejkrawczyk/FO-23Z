class CustomEvents {
    constructor(environment) {
        document.addEventListener('DOMContentLoaded', function () {
            var stepsPerFrameValueDisplay = document.getElementById('stepsPerFrameValue');
            var omegaValueDisplay = document.getElementById('omegaValue');
            var speakerSpacingValueDisplay = document.getElementById('speakerSpacingValue');

            document.getElementById('stepsPerFrameInput').addEventListener('input', evt => {
                Variables.stepsPerFrame = evt.target.value * 127;
                stepsPerFrameValueDisplay.textContent = Variables.stepsPerFrame;
            });

            document.getElementById('omegaInput').addEventListener('input', evt => {
                Variables.omega = evt.target.value;
                omegaValueDisplay.textContent = Variables.omega;
            });

            document.getElementById('speakerSpacingInput').addEventListener('input', evt => {
                Variables.speakerSpacing = int(evt.target.value);
                speakerSpacingValueDisplay.textContent = Variables.speakerSpacing;
            });
        });

        document.getElementById('restartButton').addEventListener('click', evt => {
            environment.init();
        });
    }
}