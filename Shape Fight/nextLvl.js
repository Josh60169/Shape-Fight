import { canvWidth, canvHeight } from './gameCanv.js';
import EnemySquare from "./enemySquare.js";
import EnemyCircle from "./enemyCircle.js";
import EnemyPent from "./enemyPentagon.js";
import EnemyOct from "./enemyOctagon.js";

// generates enemys and resets position of ship
export default function nextLvl(arr, ship, lvl) {
    ship.x = canvWidth / 2;
    ship.y = canvHeight / 2;

    for (let i = 0; i < (8 + Math.round(lvl * 0.1)); i++) {
        const rand = Math.random() * 99 + 1; // Generates number 1-100
        if (rand <= 50) 
            arr.push(new EnemySquare(ship.radius, 150 * .02 + (lvl * 0.001)));
        else if (rand <= 80)
            arr.push(new EnemyCircle(ship.radius, 150 * .05 + (lvl * 0.001)));
        else if (rand <= 95)
            arr.push(new EnemyPent(ship.radius, 150 *.008 + (lvl * 0.001)));
        else 
            arr.push(new EnemyOct(ship.radius, 150 * .005 + (lvl * 0.001)));
    }
    return arr;
}