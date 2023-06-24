import { ctx } from './gameCanv.js';
export default class Particle {
    constructor(x, y, color) {
        this.angle = Math.random() * 2 * Math.PI;
        this.x = x;
        this.y = y;
        this.radius = 2;
        this.color = color;
        this.speed = 2.5;
        this.velX = Math.cos(this.angle) * this.speed;
        this.velY = Math.sin(this.angle) * this.speed;
        this.visible = true;
    }

    update() {
        this.velX *= 0.99;
        this.velY *= 0.99;

        this.x += this.velX;
        this.y -= this.velY;
    }

    draw() {
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }
} 