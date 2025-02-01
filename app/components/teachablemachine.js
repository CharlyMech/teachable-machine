'use client';

import { useEffect } from "react";

const TeachableMachine = () => {
	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js";
		script.async = true;
		document.body.appendChild(script);

		const script2 = document.createElement("script");
		script2.src = "https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js";
		script2.async = true;
		document.body.appendChild(script2);

		script2.onload = () => {
			const URL = "/model/";

			let model, webcam, labelContainer, maxPredictions;

			async function init() {
				const modelURL = URL + "model.json";
				const metadataURL = URL + "metadata.json";

				model = await window.tmImage.load(modelURL, metadataURL);
				maxPredictions = model.getTotalClasses();

				const flip = true;
				webcam = new window.tmImage.Webcam(200, 200, flip);
				await webcam.setup();
				await webcam.play();
				window.requestAnimationFrame(loop);

				document.getElementById("webcam-container").appendChild(webcam.canvas);
				labelContainer = document.getElementById("label-container");
				for (let i = 0; i < maxPredictions; i++) {
					labelContainer.appendChild(document.createElement("div"));
				}
			}

			async function loop() {
				webcam.update();
				await predict();
				window.requestAnimationFrame(loop);
			}

			async function predict() {
				const prediction = await model.predict(webcam.canvas);
				for (let i = 0; i < maxPredictions; i++) {
					const classPrediction =
						prediction[i].className + ": " + prediction[i].probability.toFixed(2);
					labelContainer.childNodes[i].innerHTML = classPrediction;
				}
			}

			document.getElementById("start-button").onclick = init;
		};
	}, []);

	return (
		<div>
			<div>Teachable Machine Image Model</div>
			<button type="button" id="start-button">Start</button>
			<div id="webcam-container"></div>
			<div id="label-container"></div>
		</div>
	);
};

export default TeachableMachine;