import {canvas, ctx} from './gameCanv.js';
import Vector from './vector.js';
export function collision(oneX, oneY, oneRad, oneName, twoX, twoY, twoRad, twoName, shieldAng) {
     if (oneName === 'shield') { // check if there is a collision with the shield

        // One vertex of shield
        const vertOne = {
            x: oneX + Math.cos(shieldAng + Math.PI/2) * oneRad,
            y: oneY - Math.sin(shieldAng + Math.PI/2) * oneRad  
        };

        // Other vertex of shield
        const vertTwo = {
            x: oneX + Math.cos(shieldAng - Math.PI/2) * oneRad, 
            y: oneY - Math.sin(shieldAng - Math.PI/2) * oneRad 
        };

        const topMidpoint = {
            x: oneX + Math.cos(shieldAng) * oneRad,
            y: oneY - Math.sin(shieldAng) * oneRad
        };


        // Preperation for finding corners
        const size = {x: oneRad * 2, y: oneRad};
        const halfSize = {x: size.x * 0.5, y: size.y * 0.5};
        const center = { // center of the 
            x: oneX + (oneRad / 2) * Math.cos(shieldAng),
            y: oneY - (oneRad / 2) * Math.sin(shieldAng)
        };

        // Point that the corners pivot around (used for finding corners)
        const pivot = {x: center.x, y: center.y};

        const playerRotatedCorners = [
            rotate({x: center.x - halfSize.x, y: center.y - halfSize.y}, pivot, shieldAng + Math.PI / 2),
            rotate({x: center.x - halfSize.x, y: center.y + halfSize.y}, pivot, shieldAng + Math.PI / 2),
            rotate({x: center.x + halfSize.x, y: center.y + halfSize.y}, pivot, shieldAng + Math.PI / 2),
            rotate({x: center.x + halfSize.x, y: center.y - halfSize.y}, pivot, shieldAng + Math.PI / 2)
        ];

        for (let i = 0; i < 4; i++) {
            if (i === 0) {
                ctx.strokeStyle = 'blue';
                ctx.strokeRect(playerRotatedCorners[i].x - 10, playerRotatedCorners[i].y - 10, 20, 20);
            } else if (i === 1) {
                ctx.strokeStyle = 'white';
                ctx.strokeRect(playerRotatedCorners[i].x - 10, playerRotatedCorners[i].y - 10, 20, 20);
            } else  if (i === 2) {
                ctx.strokeStyle = 'orange';
                ctx.strokeRect(playerRotatedCorners[i].x - 10, playerRotatedCorners[i].y - 10, 20, 20);
            } else {
                ctx.strokeStyle = 'green';
                ctx.strokeRect(playerRotatedCorners[i].x - 10, playerRotatedCorners[i].y - 10, 20, 20);
            }
        }

        // Player vectors
        let v1 = new Vector(-(playerRotatedCorners[0].y - playerRotatedCorners[1].y), -(playerRotatedCorners[0].x - playerRotatedCorners[1].x));
        let v2 = new Vector(-(playerRotatedCorners[2].y - playerRotatedCorners[1].y), -(playerRotatedCorners[2].x - playerRotatedCorners[1].x));
        v1.draw(center.x, center.y, 'red', 2);
        v2.draw(center.x, center.y, 'red', 1);

        ctx.strokeStyle = "lightBlue";
        ctx.strokeRect(center.x - 10, center.y - 10, 20, 20);

        // Checks for the type of enemy and finds top left vertex, width, and height
        let enemyHitbox;
        if (twoName === 'square' || twoName === 'bullet') {
            enemyHitbox = {
                x: twoX,
                y: twoY,
                width: 2 * twoRad,
                height: 2 * twoRad
            };
        } else {
            enemyHitbox = {
                x: twoX - twoRad,
                y: twoY - twoRad,
                width: 2 * twoRad,
                height: 2 * twoRad
            };
        }
        
        const enemyCorners = [
            {x: enemyHitbox.x, y: enemyHitbox.y}, 
            {x: enemyHitbox.x + enemyHitbox.width, y: enemyHitbox.y}, 
            {x: enemyHitbox.x, y: enemyHitbox.y + enemyHitbox.height}, 
            {x: enemyHitbox.x + enemyHitbox.width, y: enemyHitbox.y + enemyHitbox.height}
        ];

        // enemy vectors
        let enemyV1 = new Vector(-enemyHitbox.width, 0);
        let enemyV2 = new Vector(0, -enemyHitbox.height);
        ctx.strokeStyle = 'yellow';
        ctx.strokeRect(enemyHitbox.x, enemyHitbox.y, enemyHitbox.width, enemyHitbox.height);
        enemyV1.draw(enemyHitbox.x + enemyHitbox.width / 2, enemyHitbox.y + enemyHitbox.height / 2, 'orange', 1);
        enemyV2.draw(enemyHitbox.x + enemyHitbox.width / 2, enemyHitbox.y + enemyHitbox.height / 2, 'orange', 1);

        // // This is here to draw out the bounds of the collision, the top left of the collision bounds, the vertices of the shield, and the midpoint of the shield
        ctx.save(); // Save the current state of the context
        ctx.translate(oneX, oneY); // Move the origin to the rectangle's position
        ctx.rotate(-shieldAng + 90 * Math.PI / 180); // Rotate the context
        ctx.strokeStyle = 'yellow';
        ctx.strokeRect(-oneRad, -oneRad, 2 * oneRad, oneRad); // Draw the rectangle at the new origin
        ctx.restore(); // Restore the context to its previous state   


        // projecting vectors
        const vectors = [v1, v2, enemyV1, enemyV2];
        for (let i = 0; i < 4; i++) {
            let pMin = undefined;
            let pMax = undefined;
            let eMin = undefined;
            let eMax = undefined;
            let min = undefined;
            let max = undefined;
            let pDis;
            let eDis;
            // If the vector goes straight up
            if (vectors[i].x === 0) {
                // Find the minimum and maximum of each hitbox
                for (let j = 0; j < 4; j++) {
                    // Player hitbox
                    if (playerRotatedCorners[j].y < pMin || pMin === undefined)
                        pMin = playerRotatedCorners[j].y;
                    else if (playerRotatedCorners[j].y > pMax || pMax === undefined)
                        pMax = playerRotatedCorners[j].y;

                    // Enemy hitbox
                    if (enemyCorners[j].y < eMin || eMin === undefined)
                        eMin = enemyCorners[j].y;
                    else if (enemyCorners[j].y > eMax || eMax === undefined)
                        eMax = enemyCorners[j].y;

                    // Checks if player or enemy point is absolute minimum
                    if (playerRotatedCorners[j].y < min || min === undefined)
                        min = playerRotatedCorners[j].y;

                    if (enemyCorners[j].y < min || min === undefined)
                        min = enemyCorners[j].y;

                    // Checks if player or enemy point is absolute maximum
                    if (playerRotatedCorners[j].y > max || max === undefined)
                        max = playerRotatedCorners[j].y;

                    if (enemyCorners[j].y > max || max === undefined)
                        max = enemyCorners[j].y;
                }

                pDis = pMax - pMin;
                eDis = eMax - eMin;

                if (pDis + eDis <= max - min)
                    return false;

            } else if (vectors[i].y === 0) { // Else if the vector is a horizontal line
                // Find the minimum and maximum of each hitbox
                for (let j = 0; j < 4; j++) {
                    // Player hitbox
                    if (playerRotatedCorners[j].x < pMin || pMin === undefined)
                        pMin = playerRotatedCorners[j].x;
                    else if (playerRotatedCorners[j].x > pMax || pMax === undefined)
                        pMax = playerRotatedCorners[j].x;

                    // Enemy hitbox
                    if (enemyCorners[j].x < eMin || eMin === undefined)
                        eMin = enemyCorners[j].x;
                    else if (enemyCorners[j].x > eMax || eMax === undefined)
                        eMax = enemyCorners[j].x;

                    // Checks if player or enemy point is absolute minimum
                    if (playerRotatedCorners[j].x < min || min === undefined)
                        min = playerRotatedCorners[j].x;

                    if (enemyCorners[j].x < min || min === undefined)
                        min = enemyCorners[j].x;

                    // Checks if player or enemy point is absolute maximum
                    if (playerRotatedCorners[j].x > max || max === undefined)
                        max = playerRotatedCorners[j].x;

                    if (enemyCorners[j].x > max || max === undefined)
                        max = enemyCorners[j].x;
                }

                pDis = pMax - pMin;
                eDis = eMax - eMin;

                if (pDis + eDis <= max - min)
                    return false;
            } else { // Else the line is a sloped line

                // Project every player and enemy corner
                let slope = vectors[i].y / vectors[i].x;;
                let xVals = [];
                let enemyXVals = [];
                
                for (let j = 0; j < playerRotatedCorners.length; j++) {
                    let yInt = playerRotatedCorners[j].y - (playerRotatedCorners[j].x * slope);
                    xVals.push((-yInt / slope));
                    
                    let enemyYInt = enemyCorners[j].y - (enemyCorners[j].x * slope);
                    enemyXVals.push((-enemyYInt / slope));
                }

                // Find the minimum and maximum player, enemy, and absolute corner projections
                for (let k = 0; k < 4; k++) {
                    // Checks if player corner is minimum or maximum
                    if (xVals[k] < pMin || pMin === undefined)
                        pMin = xVals[k];
                    else if (xVals[k] > pMax || pMax === undefined)
                        pMax = xVals[k];

                    // Checks if enemy corner is minimum or maximum
                    if (enemyXVals[k] < eMin || eMin === undefined)
                        eMin = enemyXVals[k];
                    else if (enemyXVals[k] > eMax || eMax === undefined)
                        eMax = enemyXVals[k];

                    // Updates absolute minimum
                    if (xVals[k] < min || min === undefined)
                        min = xVals[k];

                    if (enemyXVals[k] < min || min === undefined)
                        min = enemyXVals[k];

                    // Updates absolute maximum
                    if (xVals[k] > max || max === undefined)
                        max = xVals[k];

                    if (enemyXVals[k] > max || max === undefined)
                        max = enemyXVals[k];
                }

                pDis = pMax - pMin;
                eDis = eMax - eMin;

                if (pDis + eDis <= max - min)
                    return false;
            }
        }
        return true;

    } else { // Checks for collision of ship
        let distance = Math.sqrt(Math.pow((oneX - twoX), 2) + Math.pow((oneY - twoY), 2));

        // If there is a collision
        if (distance < oneRad + twoRad) 
            return true;
    }

    // If it reaches this, there is no collision
    return false;
}

export function rotate(vector, pivot, angle) {
    let tmp = {x: vector.x - pivot.x, y: vector.y - pivot.y};
    return {
        x: tmp.x * Math.cos(-angle) - tmp.y * Math.sin(-angle) + pivot.x,
        y: tmp.x * Math.sin(-angle) + tmp.y * Math.cos(-angle) + pivot.y
    };
}