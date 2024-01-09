import {ctx} from './gameCanv.js';
import spawnpoint from './spawnpoint.js';

export default class EnemyCircle {
    constructor(shipRad, speed) {
        [this.x, this.y] = spawnpoint(shipRad);
        this.radius = 25;
        this.color = 'white';
        this.speed = speed;
        this.angle;
        this.name = 'circle' // Used for identification
    }

    update(shipX, shipY, dt) {
        this.angle = Math.atan2(this.y - shipY, shipX - this.x);
        this.x += Math.cos(this.angle) * this.radius * this.speed * dt;
        this.y -= Math.sin(this.angle) * this.radius * this.speed * dt;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
    }
}