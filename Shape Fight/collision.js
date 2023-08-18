import Vector from './vector.js';

export function collision(oneX, oneY, oneRad, oneName, twoX, twoY, twoRad, twoName, shieldAng) {
     if (oneName === 'shield') { 

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

        // Player vectors
        let v1 = new Vector(-(playerRotatedCorners[0].y - playerRotatedCorners[1].y), -(playerRotatedCorners[0].x - playerRotatedCorners[1].x));
        let v2 = new Vector(-(playerRotatedCorners[2].y - playerRotatedCorners[1].y), -(playerRotatedCorners[2].x - playerRotatedCorners[1].x));

        // Checks for the type of enemy and finds top left vertex, width, and height
        let enemyHitbox;
        if (twoName === 'square') {
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

        // projecting vectors
        const vectors = [v1, v2, enemyV1, enemyV2];
    
        for (let j = 0; j < vectors.length; j++) {
            let min1, max1;
            [min1, max1] = projection(playerRotatedCorners, vectors[j].unit());

            let min2, max2;
            [min2, max2] = projection(enemyCorners, vectors[j].unit());

            if (min1 > max2 || min2 > max1)
                return false;
        }

        // If all projections ovelap, there is a collision
        return true;

    } else if (oneName === 'ship') { // Checks for collision of ship
        let distance = Math.sqrt(Math.pow((oneX - twoX), 2) + Math.pow((oneY - twoY), 2));

        // If there is a collision
        if (distance < oneRad + twoRad) 
            return true;

    } else if (oneName === 'bullet' || twoName === 'bullet') {
        let distance;
        if (twoName === 'square') {
            distance = Math.sqrt(Math.pow((oneX - twoX + twoRad / 2), 2) + Math.pow((oneY - twoY - twoRad / 2), 2));
        } else {
            distance = Math.sqrt(Math.pow((oneX - twoX), 2) + Math.pow((oneY - twoY), 2));
        }
            
        // If there is a collision
        if (distance < oneRad + twoRad) 
            return true; 
    } 

    // If it reaches this, there is no collision
    return false;
}

function rotate(vector, pivot, angle) {
    let tmp = {x: vector.x - pivot.x, y: vector.y - pivot.y};
    return {
        x: tmp.x * Math.cos(-angle) - tmp.y * Math.sin(-angle) + pivot.x,
        y: tmp.x * Math.sin(-angle) + tmp.y * Math.cos(-angle) + pivot.y
    };
}

function projection(verticies, axis) {
    let min = undefined;
    let max = undefined;
    let axisVector = new Vector(axis.x, axis.y);
    
    for (let i = 0; i < verticies.length; i++) {
        let projection = axisVector.dot(verticies[i].x, verticies[i].y);

        if (projection < min || min === undefined) 
            min = projection;
        
        if  (projection > max || max === undefined)
            max = projection;
    }

    return [min, max];
}