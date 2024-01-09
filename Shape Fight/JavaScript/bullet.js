import { canvas, ctx, canvWidth, canvHeight } from './gameCanv.js';
import border from './border.js';
export default class Bullet {
    constructor(noseX, noseY, angle, speed, color, radius) {
        this.x = noseX;
        this.y = noseY;
        this.radius = radius;
        this.speed = speed;
        this.angle = angle;
        this.color = color;
        this.time = 0;
        this.name = 'bullet';
    }

    update(dt) {
        [this.x, this.y] = border(this.x, this.y, this.radius);
        this.x += Math.cos(this.angle) * this.speed * dt;
        this.y -= Math.sin(this.angle) * this.speed * dt;
        this.time += dt;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.radius, this.radius);
    }
}