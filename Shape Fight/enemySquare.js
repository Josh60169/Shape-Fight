import { canvas, ctx, canvWidth, canvHeight } from './gameCanv.js';
import Bullet from './bullet.js';
import spawnpoint from './spawnpoint.js';

export default class EnemySquare {
    constructor(shipRad, speed) {
        [this.x, this.y] = spawnpoint(shipRad);
        this.radius = 15;
        this.color = 'red';
        this.speed = speed;
        this.angle;
        this.time = 0;
        this.fireRate = Math.round(Math.random() * (1500 - 1000) + 1000);
        this.name = 'square'; // Used for identification with square.fire()
        this.hp = 2;
    }

    update(shipX, shipY) {
        this.angle = Math.atan2(this.y - shipY, shipX - this.x);
        this.x += Math.cos(this.angle) * this.radius * this.speed;
        this.y -= Math.sin(this.angle) * this.radius * this.speed;
        this.time++;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.radius * 2, this.radius * 2);
    }

    fire(arr) {
        if (this.time % this.fireRate === 0) 
            arr.push(new Bullet(this.x, this.y, this.angle, 2, 'lightGreen', 5));
        return arr;
    }
}