import brain from "brain.js";
import Pong from "./pong";
import getKey from "./utils/getKey";
import {
  TOGGLE_DATA_COLLECTION,
  TOGGLE_NETWORK_ACTIVATION
} from "./utils/keyConstants";

/*
 * Init Pong
 */
const pongCanvas = document.getElementById("pongCanvas");
const pongCanvasContext = pongCanvas.getContext("2d");
const pongInstance = new Pong(pongCanvas, pongCanvasContext, "#3a5b63");

const numDataPointsElement = document.getElementById("numDatapoints");
const networkActivationElement = document.getElementById("networkActivation");
const networkTrainStatElement = document.getElementById("trainStatus");
numDataPointsElement.textContent = 0;
networkActivationElement.textContent = "off";

pongInstance.startAnimation();

/*
 * Init neural net
 */
const dataPoints = [];
let trainInterval = null;
let activationInterval = null;

const brainInstance = new brain.NeuralNetwork({
  hiddenLayers: [3, 2],
  outputSize: 1,
  activation: "sigmoid",
  learningRate: 0.01,
  decayRate: 0.999
});

/*
 * Neural net helper functions
 */
const collectTrainingData = (data, pong, callback) => {
  return setInterval(() => {
    const {
      ballPositionX,
      ballPositionY,
      padPosY
    } = pong.getElementPositions();
    const ballPositionXNorm = ballPositionX / pongCanvas.width;
    const ballPositionYNorm = ballPositionY / pongCanvas.height;
    const currentPadPosition = padPosY / pongCanvas.height;

    data.push({
      input: [ballPositionXNorm, ballPositionYNorm],
      output: [currentPadPosition]
    });

    callback(data.length);
  }, 100);
};

const trainNetwork = async (network, data, trainCallback) => {
  console.log("training net");
  network.trainAsync(data, {
    iterations: 10000,
    callback: trainCallback,
    callbackPeriod: 100
  });
};

const activateNetWork = (network, pong) => {
  return setInterval(() => {
    const ballxNorm =
      pong.getElementPositions().ballPositionX / pongCanvas.width;
    const ballyNorm =
      pong.getElementPositions().ballPositionY / pongCanvas.height;

    const activation = network.run([ballxNorm, ballyNorm]) * pongCanvas.height;
    pong.setPadPosition(activation);
  }, 20);
};

/*
 * User Interaction
 */
pongCanvas.addEventListener("mousemove", event => {
  if (!activationInterval) {
    pongInstance.setPadPosition(event.clientY);
  }
});

document.addEventListener("keypress", event => {
  switch (getKey(event)) {
    case TOGGLE_DATA_COLLECTION:
      if (!trainInterval) {
        console.log("Started collecting data");
        trainInterval = collectTrainingData(
          dataPoints,
          pongInstance,
          dataLength => {
            numDataPointsElement.textContent = dataLength;
          }
        );
      } else {
        console.log("Stopped collecting data");
        clearInterval(trainInterval);
        trainInterval = false;

        console.log("Train network");
        trainNetwork(brainInstance, dataPoints, trainData => {
          networkTrainStatElement.textContent = `
          Iteration: ${trainData.iterations}, 
          error: ${trainData.error}
          `;
        });
      }
      break;
    case TOGGLE_NETWORK_ACTIVATION:
      if (!activationInterval) {
        console.log("Started activation");
        activationInterval = activateNetWork(brainInstance, pongInstance);
        networkActivationElement.textContent = "on";
      } else {
        console.log("Stopped activation");
        clearInterval(activationInterval);
        activationInterval = false;
        networkActivationElement.textContent = "off";
      }
      break;
    default:
      break;
  }
});
