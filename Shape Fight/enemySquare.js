import { canvas, ctx, canvWidth, canvHeight } from './gameCanv.js';
import Bullet from './bullet.js';
import spawnpoint from './spawnpoint.js';
import {sound} from './sound.js';

export default class EnemySquare {
    constructor(shipRad, speed) {
        [this.x, this.y] = spawnpoint(shipRad);
        this.radius = 15;
        this.color = 'lightGreen';
        this.speed = speed;
        this.angle;
        this.time = 0;
        this.fireRate = Math.round(Math.random() * (1500 - 1000) + 1000);
        this.name = 'square'; // Used for identification with square.fire()
    }

    update(shipX, shipY, dt) {
        this.angle = Math.atan2(this.y - shipY, shipX - this.x);
        this.x += Math.cos(this.angle) * this.radius * this.speed * dt;
        this.y -= Math.sin(this.angle) * this.radius * this.speed * dt;
        this.time++;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.radius * 2, this.radius * 2);
    }

    fire(arr) {
        if (this.time % this.fireRate === 0)  {
            arr.push(new Bullet(this.x, this.y, this.angle, 125 * 2, 'lightGreen', 5));
            sound('gameMusic/Square Firing.mp3');
        }
        return arr;
    }
}