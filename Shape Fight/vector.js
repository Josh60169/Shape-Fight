import { ctx } from "./gameCanv.js";

export default class Vector {
    constructor(x, y) {
       this.x = x;
       this.y = y;
    }

    draw(x, y, color, mult) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.moveTo(x + this.x * mult, y - this.y * mult);
        ctx.lineTo(x - this.x * mult, y + this.y * mult);

        ctx.stroke();
    }

    dot(vx, vy) {
        return this.x * vx + this.y * vy;
    }

    unit() {
        let mag = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
        return {x: this.x / mag, y: this.y / mag};
    }
}