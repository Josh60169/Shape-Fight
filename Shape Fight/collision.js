import {canvas, ctx} from './gameCanv.js';
export default function collision(oneX, oneY, oneRad, oneName, twoX, twoY, twoRad, twoName, shieldAng) {
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
        }

        const shieldMidY = oneY - Math.sin(shieldAng) * oneRad; 
        const shieldMidX = oneX + Math.cos(shieldAng) * oneRad;

        const rectOne = {
            get x() {
                // If the shield is facing more up and down
                if (Math.round(Math.sin(shieldAng)) === -1 || Math.round(Math.sin(shieldAng)) === 1) 
                    return vertOne.x < vertTwo.x ? vertOne.x : vertTwo.x;
                else // If the shield is facing more left or right
                    return vertOne.x < shieldMidX ? vertOne.x : shieldMidX;   
            },

            get y() {
                // If the shield is facing more up and down
                if (Math.round(Math.sin(shieldAng)) === -1 || Math.round(Math.sin(shieldAng)) === 1) 
                    return vertOne.y < shieldMidY ? vertOne.y : shieldMidY;
                else // If the shield is facing more left or right
                    return vertOne.y < vertTwo.y ? vertOne.y : vertTwo.y;
            },

            get width() {
                // If the shield is facing more up and down
                if (Math.round(Math.sin(shieldAng)) === -1 || Math.round(Math.sin(shieldAng)) === 1) 
                    return Math.abs(vertTwo.x - vertOne.x);
                else // If the shield is facing more left or right
                    return Math.abs(vertTwo.x - shieldMidX);
            },

            get height() {
                // If the shield is facing more up and down
                if (Math.round(Math.sin(shieldAng)) === -1 || Math.round(Math.sin(shieldAng)) === 1) 
                    return Math.abs(vertOne.y - shieldMidY);
                else // If the shield is facing more left or right
                    return Math.abs(vertOne.y - vertTwo.y);
            }
        };

        // Checks for the type of enemy and finds the top left x and y point
        let rectTwo;
        if (twoName === 'square' || twoName === 'bullet') {
            rectTwo = {
                x: twoX,
                y: twoY,
                width: 2 * twoRad,
                height: 2 * twoRad
            };

        } else {
            rectTwo = {
                x: twoX - twoRad,
                y: twoY - twoRad,
                width: 2 * twoRad,
                height: 2 * twoRad
            };
        }

        // This is here to draw out the bounds of the collision, the top left of the collision bounds, the vertices of the shield, and the midpoint of the shield
        ctx.strokeStyle = 'yellow';
        ctx.strokeRect(rectOne.x, rectOne.y, rectOne.width, rectOne.height);
        ctx.strokeRect(rectOne.x - 10, rectOne.y - 10, 20, 20);
        ctx.strokeRect(vertTwo.x - 10, vertTwo.y - 10, 20, 20);
        ctx.strokeRect(vertOne.x - 10, vertOne.y - 10, 20, 20)
        ctx.strokeRect(shieldMidX - 10, shieldMidY - 10, 20, 20);

        // Checks for collision using AABB 
        if (rectOne.x < rectTwo.x + rectTwo.width && rectOne.x + rectOne.width > rectTwo.x && rectOne.y < rectTwo.y + rectTwo.height && rectOne.y + rectOne.height > rectTwo.y) 
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