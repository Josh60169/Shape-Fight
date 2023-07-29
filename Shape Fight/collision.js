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

        const center = {
            x: oneX,
            y: oneY - oneRad / 2
        };

        const rectOne = {
            get x() {
                let v1UnrotatedX = (((vertOne.x - center.x) * Math.cos(Math.PI / 2) - (vertOne.y - center.y) * Math.sin(Math.PI / 2)) + center.x);
                let v1UnrotatedY = (((vertOne.x - center.x) * Math.sin(Math.PI / 2) + (vertOne.y - center.y) * Math.cos(Math.PI / 2)) + center.y);
                let x = v1UnrotatedX + 2 * oneRad;
                let y = v1UnrotatedY + oneRad;
                return (((x - center.x) * Math.cos(shieldAng) - (y - center.y) * Math.sin(shieldAng)) + center.x);
            }, 

            get y() {
                let v1UnrotatedX = (((vertOne.x - center.x) * Math.cos(Math.PI / 2) - (vertOne.y - center.y) * Math.sin(Math.PI / 2)) + center.x);
                let v1UnrotatedY = (((vertOne.x - center.x) * Math.sin(Math.PI / 2) + (vertOne.y - center.y) * Math.cos(Math.PI / 2)) + center.y);
                let x = v1UnrotatedX + 2 * oneRad;
                let y = v1UnrotatedY + oneRad;
                ctx.strokeStyle = 'blue';
                ctx.strokeRect(v1UnrotatedX - 10, v1UnrotatedY - 10, 20, 20);
                return (((x - center.x) * Math.sin(shieldAng) + (y - center.y) * Math.cos(shieldAng)) + center.y);
            },

            width: 2 * oneRad,
            height: oneRad
        };


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