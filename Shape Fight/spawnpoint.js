import { canvWidth, canvHeight } from './gameCanv.js';
export default function spawnpoint(shipRad) {
    let rand = Math.round(Math.random() * 4) + 1;

    console.log(0 + 5 * shipRad, Math.random() * canvHeight);
    console.log(canvWidth - 5 * shipRad, Math.random() * canvHeight);
    console.log(Math.random() * canvWidth, 0 + 5 * shipRad);
    console.log(Math.random() * canvWidth, canvHeight - 5 * shipRad);

    if (rand === 1)
        return [0 + 5 * shipRad, Math.random() * canvHeight]; // far left
    else if (rand === 2)
        return [canvWidth - 5 * shipRad, Math.random() * canvHeight]; // far right
    else if (rand === 3)
        return [Math.random() * canvWidth, 0 + 5 * shipRad]; // far top
    else 
        return [Math.random() * canvWidth, canvHeight - 5 * shipRad]; // far bottom
}