import {canvas, ctx} from './gameCanv.js';
class Button {
    constructor(x, y, text) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 25;
        this.text = text;
    }

    draw() {
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.stroke();
        ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
        ctx.closePath();
    }

    listen() {
        canvas.addEventListener('click', e => {
            if (e.clientX >= this.x && e.clientX <= this.x + this.width && e.clientY >= this.y && e.clientY <= this.y + this.height) {
                if (canvas.visible) {
                    
                }
            } 
        });
    }
}