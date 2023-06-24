import { canvWidth, canvHeight } from './gameCanv.js';
export default function spawnpoint(shipRad) {
    let rand = Math.round(Math.random() * 3 + 1);

    if (rand === 1)
        return [canvWidth / 2 - (Math.random() * 2 * shipRad + 10 * shipRad), Math.random() * canvHeight]; // from start of x axis to 5-8 times the ship radius (left)
    else if (rand === 2)
        return [canvWidth / 2 + (Math.random() * 2 * shipRad + 10 * shipRad), Math.random() * canvHeight] // range from anywhere on the far right to 5 times the ship radius to the right
    else if (rand === 3)
        return [Math.random() * canvWidth, canvHeight / 2 - (Math.random() * 10 * shipRad + 2 * shipRad)];
    else 
        return [Math.random() * canvWidth, canvHeight / 2 + (Math.random() * 10 * shipRad + 2 * shipRad)];
}