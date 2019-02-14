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
  learningRate: 0.01
});

/*
 * Neural net helper functions
 */
const collectTrainingData = (data, pong) => {
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
  }, 50);
};

const trainNetwork = (network, data) => {
  console.log("training net");
  network.train(data);
};

const activateNetWork = (network, pong) => {
  return setInterval(() => {
    const ballxNorm =
      pong.getElementPositions().ballPositionX / pongCanvas.width;
    const ballyNorm =
      pong.getElementPositions().ballPositionY / pongCanvas.height;

    const activation = network.run([ballxNorm, ballyNorm]) * pongCanvas.height;
    pong.setPadPosition(activation);
  }, 50);
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
        console.log("started collecting data");
        trainInterval = collectTrainingData(dataPoints, pongInstance);
      } else {
        console.log("stopped collecting data");
        clearInterval(trainInterval);
        trainInterval = false;

        console.log("Train network");
        trainNetwork(brainInstance, dataPoints);
      }
      break;
    case TOGGLE_NETWORK_ACTIVATION:
      if (!activationInterval) {
        console.log("started activation");
        activationInterval = activateNetWork(brainInstance, pongInstance);
      } else {
        console.log("stopped activation");
        clearInterval(activationInterval);
        activationInterval = false;
      }
      break;
    default:
      break;
  }
});
