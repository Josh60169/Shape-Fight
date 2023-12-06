import { canvWidth, canvHeight } from './gameCanv.js';
export default function spawnpoint(shipRad) {
    let rand = Math.round(Math.random() * 4) + 1;

    console.log(shipRad, Math.random() * canvHeight);
    console.log(canvWidth - shipRad, Math.random() * canvHeight);
    console.log(Math.random() * canvWidth, shipRad);
    console.log(Math.random() * canvWidth, canvHeight - shipRad);

    if (rand === 1)
        return [0, 0]; // far left
    else if (rand === 2)
        return [0, 0]; // far right
    else if (rand === 3)
        return [0, 0]; // far top
    else 
        return [0, 0]; // far bottom
}