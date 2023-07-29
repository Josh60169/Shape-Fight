import { ctx } from "./gameCanv.js";

export default class Vector {
    constructor(x, y) {
       this.x = x;
       this.y = y;
    }

    draw(x, y) {
        ctx.beginPath();
        ctx.strokeStyle = 'green';
        ctx.moveTo(x, y);
        ctx.lineTo(x + this.x, y - this.y);
        ctx.stroke();
    }
}