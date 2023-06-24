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

        // Rectangle around shield
        const rectOne =  {
            width: Math.abs(vertTwo.x - vertOne.x),
            height: Math.abs(vertTwo.y - shieldMidY),
            x: vertOne.x < vertTwo.x ? vertOne.x : vertTwo.x,
            y: vertOne.y < shieldMidY ? vertOne.y : shieldMidY 
        };

        // Checks for the type of enemy and finds the top left x and y point
        let rectTwo;
        if (twoName === 'square' || twoName === 'bullet') {
            rectTwo = {
                x: Math.abs(twoX),
                y: Math.abs(twoY),
                width: 2 * twoRad,
                height: 2 * twoRad
            };

        } else {
            rectTwo = {
                x: Math.abs(twoX - twoRad),
                y: Math.abs(twoY - twoRad),
                width: 2 * twoRad,
                height: 2 * twoRad
            };
        }
        
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