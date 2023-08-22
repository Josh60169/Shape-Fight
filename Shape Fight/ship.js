import { ctx, canvWidth, canvHeight } from './gameCanv.js';
import border from './border.js';
export default class Ship {
    // Properties of spaceship
    constructor() {
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
        } else {
            this.velX *= 0.99;
            this.velY *= 0.99;
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
        //ctx.moveTo(this.x + Math.cos(this.angle) * this.radius, this.y - Math.sin(this.angle) * this.radius);
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
}