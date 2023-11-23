import {canvas, ctx} from './gameCanv.js';
export default class Button {
    constructor(x, y, text, width, height) {
        this.initX = x;
        this.initY = y;
        this.x = x;
        this.y = y;
        this.initWidth = width;
        this.initHeight = height;
        this.width = width;
        this.height = height;
        this.text = text;
        this.fontSize = 15;
    }

    draw() {
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.font = `${this.fontSize}px 'Press Start 2P'`;
        ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
        ctx.strokeRect(this.x, this.y, this.width, this.height + this.height / 4);
        ctx.closePath();
    }

    listen() {
        canvas.addEventListener('mousemove', e => {
            if (e.clientX >= this.x && e.clientX <= this.x + this.width && e.clientY >= this.y && e.clientY <= this.y + this.height) {
                this.fontSize = 20;
                this.width = this.initWidth * 1.5;
                this.height = this.initHeight * 1.5;
                this.x = this.initX - this.width / 5;
                this.y = this.initY - this.height / 5;
            } else {
                this.fontSize = 15;
                this.width = this.initWidth;
                this.height = this.initHeight;
                this.x = this.initX;
                this.y = this.initY;
            }
        });
    }
}