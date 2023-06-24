import { canvas, ctx, canvWidth, canvHeight } from './gameCanv.js';
export default class Shield {
    constructor(shipX, shipY, shipRad, shipAng) {
        this.angle = shipAng;
        this.cx = shipX;
        this.cy = shipY;
        this.color = 'blue';
        this.rotSpeed = 0.1;
        this.radius = shipRad * 2.5;
        this.name = 'shield';
    }

    update(shipX, shipY, shipAng, spaceBarPressed) {
        if (spaceBarPressed) {
            this.angle = shipAng;
        }

        this.cx = shipX;
        this.cy = shipY;
    }
    
    draw() {
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.save();
        ctx.translate(this.cx, this.cy);
        ctx.rotate(-this.angle + Math.PI / 2);
        ctx.arc(0, 0, this.radius, 0, Math.PI, true);
        ctx.stroke();
        ctx.restore();
        ctx.lineWidth = 1;
        ctx.closePath();
    }
}
