import { ctx, canvWidth, canvHeight } from './gameCanv.js';
import border from './border.js';
import {stopMusic, startMusic} from './sound.js';
export default class Ship {
    // Properties of spaceship
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.radius = 20;
        this.speed = 250;
        this.velX = 0;
        this.velY = 0;
        this.visible = true;
        this.angle = 90 / 180 * Math.PI;
        this.color = color;
        this.noseX = this.x + Math.cos(this.angle) * this.radius || this.angle;
        this.noseY = this.y - Math.sin(this.angle) * this.radius || this.angle;
        this.name = 'ship';
        this.shipFire = false;
        this.fireOn = false;
        this.timer = 0;
    }

    // Manages Controls and updates position of spaceship
    update(mouseX, mouseY, keys, dt) {
        [this.x, this.y] = border(this.x, this.y, this.radius);
        // If the mouse is not on top of the ship radius, point towards mouse pointer
        if (Math.abs(this.x - mouseX) > (this.radius - 6) && Math.abs(this.y - mouseY) > (this.radius - 6)) {
            this.angle = Math.atan2(this.noseY - mouseY, mouseX - this.x) || 90 / 180 * Math.PI;
        }
        
        if (keys['w']) {
            this.velX = Math.cos(this.angle) * this.speed;
            this.velY = Math.sin(this.angle) * this.speed;
            this.shipFire = true;
            this.fireOn ? this.fireOn = false : this.fireOn = true;
        } else {
            this.velX *= 0.99;
            this.velY *= 0.99;
            this.shipFire = false;
        }

        this.x += this.velX * dt;
        this.y -= this.velY * dt;

        this.noseX = this.x + Math.cos(this.angle) * this.radius;
        this.noseY = this.y - Math.sin(this.angle) * this.radius;
    }
    
    // Draws spaceship on screen
    draw() {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.moveTo(this.noseX, this.noseY);
        ctx.lineTo(
            this.x + Math.cos(this.angle + Math.PI / 1.3) * this.radius, 
            this.y - Math.sin(this.angle + Math.PI / 1.3) * this.radius
        );
        ctx.lineTo(
            this.x + Math.cos(this.angle + Math.PI / 1.3 + ((2 * Math.PI) - (this.angle + Math.PI / 1.3) + (this.angle - Math.PI / 1.3))) * this.radius,
            this.y - Math.sin(this.angle + Math.PI / 1.3 + ((2 * Math.PI) - (this.angle + Math.PI / 1.3) + (this.angle - Math.PI / 1.3))) * this.radius
        );
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }

    // draws fire that comes out of ship
    drawFire(ship, fps) {
        if (this.timer % Math.round(fps / 4) === 0) {
            if (ship.shipFire) {
                this.visible = true;
                this.angle = ship.angle + Math.PI;

                if (this.fireOn) {
                    this.radius = 15;
                    this.fireOn = false
                } else {
                    this.radius = 10;
                    this.fireOn = true;
                }

                this.x = ship.x - (ship.radius + ship.radius / 3) * -Math.cos(this.angle);
                this.y = ship.y + (ship.radius + ship.radius / 3) * -Math.sin(this.angle);
                this.noseX = this.x + Math.cos(this.angle) * this.radius;
                this.noseY = this.y - Math.sin(this.angle) * this.radius;
                this.draw();
            }
        }
        this.timer++;
    }

    drawLives(lives) {
        let initX = this.x;
        for (let i = 0; i < lives; i++) {
            this.draw();
            this.x += this.radius * 1.2;
        }

        this.x = initX;
    }

    fireSound(sound) {
        if (this.shipFire)
            sound = startMusic(sound, 0.4);
        else 
            sound = stopMusic(sound);   

        return sound;
    }

    resetShip() {
        this.x = canvWidth / 2;
        this.y = canvHeight / 2;
        this.radius = 20;
        this.speed = 250;
        this.velX = 0;
        this.velY = 0;
        this.visible = true;
        this.angle = 90 / 180 * Math.PI;
        this.color = 'lightBlue';
        this.noseX = this.x + Math.cos(this.angle) * this.radius || this.angle;
        this.noseY = this.y - Math.sin(this.angle) * this.radius || this.angle;
        this.name = 'ship';
        this.shipFire = false;
        this.fireOn = false;
        this.timer = 0;
    }
}