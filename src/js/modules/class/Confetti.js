export default class Confetti {
  constructor(canvas, x, y, size, emoji, speed) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.x = x;
    this.y = y;
    this.size = size;
    this.emoji = emoji;
    this.speed = speed;
  }

  update() {
    this.y += this.speed;

    if (this.y > this.canvas.height) {
      this.y = 0 - this.size;
      this.x = Math.random() * this.canvas.width;
    }
  }

  draw() {
    this.ctx.font = `${this.size}px Arial`;
    this.ctx.fillText(this.emoji, this.x, this.y);
  }
}
