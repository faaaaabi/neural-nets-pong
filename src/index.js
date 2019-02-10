import Pong from "./pong";

const pongCanvas = document.getElementById("pongCanvas");
const pongCanvasContext = pongCanvas.getContext("2d");
const pongInstance = new Pong(pongCanvas, pongCanvasContext);

pongInstance.startAnimation();

pongCanvas.addEventListener("mousemove", e => {
  pongInstance.setPadPosition(e.clientY);
});
