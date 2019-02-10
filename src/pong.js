class Pong {
  constructor(
    pongCanvas,
    pongCanvasContext,
    backgroundColor = "#3a5b63",
    objectColors = "#FFFFFF",
    ballStartPositionX = 70,
    ballStartPositionY = 70,
    ballSpeedX = 7,
    ballSpeedY = 6,
    padHeight = 100,
    initPadPosY = 250,
    framesPerSecond = 30
  ) {
    this.canvas = pongCanvas;
    this.CanvasContext = pongCanvasContext;
    this.backgroundColor = backgroundColor;
    this.objectColors = objectColors;
    this.ballPositionX = ballStartPositionX;
    this.ballPositionY = ballStartPositionY;
    this.ballSpeedX = ballSpeedX;
    this.ballSpeedY = ballSpeedY;
    this.framesPerSecond = framesPerSecond;
    this.padHeight = padHeight;
    this.padPosY = initPadPosY;
    this.animation = null;
    window.requestAnimationFrame(this._drawEverything);
  }

  startAnimation = () => {
    console.log("[Pong]: Animation started");
    this._animate();
  };

  stopAnimation = () => {
    console.log("[Pong]: Animation stopped");
    window.cancelAnimationFrame(this.animation);
  };

  setPadPosition = padPosY => {
    const rect = this.canvas.getBoundingClientRect();
    this.padPosY = padPosY - rect.top - this.padHeight / 2;
  };

  getElementPositions = () => {
    return {
      ballPositionX: this.ballPositionX,
      ballPositionY: this.ballPositionY,
      padPosY: this.padPosY
    };
  };

  _animate = () => {
    this._moveEverything();
    this._drawEverything();
    this.animation = window.requestAnimationFrame(this._animate);
  };

  _moveEverything = () => {
    this.ballPositionX = this.ballPositionX + this.ballSpeedX;
    this.ballPositionY = this.ballPositionY + this.ballSpeedY;

    if (this.ballPositionX < 0) {
      this.ballSpeedX = -this.ballSpeedX;
    }
    if (this.ballPositionX > this.canvas.width) {
      this.ballSpeedX = -this.ballSpeedX;
    }
    if (this.ballPositionY < 0) {
      this.ballSpeedY = -this.ballSpeedY;
    }
    if (this.ballPositionY > this.canvas.height) {
      this.ballSpeedY = -this.ballSpeedY;
    }
  };

  _drawEverything = () => {
    // Background
    this._colorRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height,
      this.backgroundColor
    );
    // Pad
    this._colorRect(10, this.padPosY, 10, this.padHeight, this.objectColors);
    // Ball
    this._colorCircle(
      this.ballPositionX,
      this.ballPositionY,
      10,
      this.objectColors
    );
  };

  _colorCircle = (centerX, centerY, radius, drawColor) => {
    this.CanvasContext.fillStyle = drawColor;
    this.CanvasContext.beginPath();
    this.CanvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    this.CanvasContext.fill();
  };

  _colorRect = (leftX, topY, width, height, drawColor) => {
    this.CanvasContext.fillStyle = drawColor;
    this.CanvasContext.fillRect(leftX, topY, width, height);
  };
}

export default Pong;