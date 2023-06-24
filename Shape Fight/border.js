import { canvas, ctx, canvWidth, canvHeight } from './gameCanv.js';
export default function border(posX, posY, rad) {
    if (posX < 0) 
        posX = canvWidth - rad;
    else if (posX > canvWidth)
        posX = rad;
    else if (posY < 0) 
        posY = canvHeight - rad;
    else if (posY > canvHeight)
        posY = rad;
    return [posX, posY];
}