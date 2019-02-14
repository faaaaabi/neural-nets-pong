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
    initPadWidth = 10,
    initPadPosX = 30,
    initPadPosY = 250,
    initBallSize = 10
  ) {
    this.canvas = pongCanvas;
    this.CanvasContext = pongCanvasContext;
    this.backgroundColor = backgroundColor;
    this.objectColors = objectColors;
    this.ballPositionX = ballStartPositionX;
    this.ballPositionY = ballStartPositionY;
    this.ballSpeedX = ballSpeedX;
    this.ballSpeedY = ballSpeedY;
    this.padHeight = padHeight;
    this.padWidth = initPadWidth;
    this.padPosX = initPadPosX;
    this.padPosY = initPadPosY;
    this.ballSize = initBallSize;
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

  _restart = () => {
    this.ballPositionX = this.canvas.width / 2;
    this.ballPositionY = this.canvas.height / 2;
  };

  _moveEverything = () => {
    this.ballPositionX = this.ballPositionX + this.ballSpeedX;
    this.ballPositionY = this.ballPositionY + this.ballSpeedY;
    /*
     * Pad/ball collision detection
     */
    if (
      this._rectCircleColliding(
        { x: this.ballPositionX, y: this.ballPositionY, r: this.ballSize },
        {
          x: this.padPosX,
          y: this.padPosY,
          w: this.padWidth,
          h: this.padHeight
        }
      )
    ) {
      this.ballSpeedX = -this.ballSpeedX;
    }
    /*
     * Ball/wall collision detection
     */
    if (this.ballPositionX - this.ballSize < 0) {
      this.ballSpeedX = -this.ballSpeedX;
    }
    if (this.ballPositionX + this.ballSize > this.canvas.width) {
      this.ballSpeedX = -this.ballSpeedX;
    }
    if (this.ballPositionY - this.ballSize < 0) {
      this.ballSpeedY = -this.ballSpeedY;
    }
    if (this.ballPositionY + this.ballSize > this.canvas.height) {
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
    this._colorRect(
      this.padPosX,
      this.padPosY,
      this.padWidth,
      this.padHeight,
      this.objectColors
    );
    // Ball
    this._colorCircle(
      this.ballPositionX,
      this.ballPositionY,
      this.ballSize,
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

  _rectCircleColliding = (circle, rect) => {
    const distX = Math.abs(circle.x - rect.x - rect.w / 2);
    const distY = Math.abs(circle.y - rect.y - rect.h / 2);

    if (distX > rect.w / 2 + circle.r) {
      return false;
    }
    if (distY > rect.h / 2 + circle.r) {
      return false;
    }

    if (distX <= rect.w / 2) {
      return true;
    }
    if (distY <= rect.h / 2) {
      return true;
    }

    const dx = distX - rect.w / 2;
    const dy = distY - rect.h / 2;
    return dx * dx + dy * dy <= circle.r * circle.r;
  };
}

export default Pong;
