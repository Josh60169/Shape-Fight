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

    dot(v1x, v2x, v1y, v2y) {
        return [v1x * v2x, v1y * v2y];
    }
}