import {canvas, ctx} from './gameCanv.js';
import Vector from './vector.js';
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
        };

        const midpoint = {
            x: oneX + Math.cos(shieldAng) * oneRad,
            y: oneY - Math.sin(shieldAng) * oneRad
        };


        const rectOne = {
            x: (vertOne.x + 2 * oneRad) * Math.cos(shieldAng) - (vertOne.y - oneRad) * Math.sin(shieldAng),
            y: (vertOne.x + 2 * oneRad) * Math.sin(shieldAng) + (vertOne.y - oneRad) * Math.cos(shieldAng),
            width: 2 * oneRad,
            height: oneRad
        };
        console.log(rectOne.x, rectOne.y);

        // draws rectOne
        ctx.strokeStyle = 'red';
        ctx.strokeRect(rectOne.x - 10, rectOne.y - 10, 20, 20);
        ctx.strokeStyle = 'green';
        ctx.strokeRect(vertOne.x - 10, vertOne.y - 10, 20, 20);

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


        let vect1 = new Vector(rectOne.width * Math.cos(shieldAng), rectOne.height * Math.sin(shieldAng));
        vect1.draw(rectOne.x, rectOne.y);  

        // This is here to draw out the bounds of the collision, the top left of the collision bounds, the vertices of the shield, and the midpoint of the shield
        ctx.save(); // Save the current state of the context
        ctx.translate(oneX, oneY); // Move the origin to the rectangle's position
        ctx.rotate(-shieldAng + 90 * Math.PI/180); // Rotate the context
        ctx.strokeStyle = 'yellow';
        ctx.strokeRect(-oneRad, -oneRad, rectOne.width, rectOne.height); // Draw the rectangle at the new origin
        ctx.restore(); // Restore the context to its previous state     
    } else { // Checks for collision of ship
        let distance = Math.sqrt(Math.pow((oneX - twoX), 2) + Math.pow((oneY - twoY), 2));

        // If there is a collision
        if (distance < oneRad + twoRad) 
            return true;
    }

    // If it reaches this, there is no collision
    return false;
}