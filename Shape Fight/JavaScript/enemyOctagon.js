import {ctx} from './gameCanv.js';
import Bullet from './bullet.js';
import spawnpoint from './spawnpoint.js';
import {sound} from './sound.js';
import octFire from '../gameMusic/Octagon Firing.mp3';

export default class EnemyOct {
    constructor(shipRad, speed) {
        [this.x, this.y] = spawnpoint(shipRad);
        this.radius = 50;
        this.color = 'orange';
        this.speed = speed; 
        this.angle;
        this.time = 0;
        this.fireRate = Math.round(Math.random() * (1800 - 1500) + 1500);
    }

    update(shipX, shipY, dt) {
        this.angle = Math.atan2(this.y - shipY, shipX - this.x);
        this.x += Math.cos(this.angle) * this.radius * this.speed * dt;
        this.y -= Math.sin(this.angle) * this.radius * this.speed * dt;
        this.pointOne = []
        this.time++;
        this.name = "octagon";
        this.hp = 10;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;

        ctx.beginPath();
        let ptDis = 2 * Math.PI / 8; // point distance
        
        // finds location of each point and draws line to it 
        for (let i = 0; i < 8; i++) {
            ctx.lineTo(
                this.x + Math.cos(this.angle + ptDis * i) * this.radius, 
                this.y - Math.sin(this.angle + ptDis * i) * this.radius
            );
        }
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }

    fire(arr) {
        if (this.time % this.fireRate === 0) {
            let ptDis = 2 * Math.PI / 8; // point distance
            for (let j = 0; j < 8; j++) {
                arr.push(
                    new Bullet(
                        this.x + Math.cos(this.angle + ptDis * j) * this.radius, 
                        this.y - Math.sin(this.angle + ptDis * j) * this.radius, this.angle + ptDis * j, 125 * 1.5, 'lightGreen', 12
                    )
                );

                sound(octFire);
            }
        }
        return arr;
    }
}