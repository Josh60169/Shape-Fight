import { canvas, ctx, canvWidth, canvHeight } from './gameCanv.js';
import Ship from './ship.js';
import Bullet from './bullet.js';
import nextLvl from './nextLvl.js';
import Shield from './shield.js';
import collision from './collision.js';
import gameOver from './gameOver.js';
import destroy from './destroyAnim.js';

// Creates ship, arrays for bullets, and mouse
let lives = 3;
let level = 1;
let ship = new Ship();
let shield = new Shield(ship.x, ship.y, ship.radius, ship.angle)
const bulletArr = [];
let enemyArr = [];
let squareBullArr = [];
let pentBullArr = [];
let octBullArr = [];
let particleArr = [];

// Keeps track of mouse position
const mouse = {
    x: undefined,
    y: undefined
};

// Listens for any keypresses
const keyPresses = [];
document.body.addEventListener('keydown', e => {
    keyPresses[e.key] = true;
});

// Listens for the release of a button (and start updating shield)
document.body.addEventListener('keyup', e => {
    if (keyPresses[' ']) {
        shield.update(ship.x, ship.y, ship.angle, true);
    }
    keyPresses[e.key] = false;
});

// Updates Mouse Position
document.body.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Fires bullet when left mouse button is clicked
document.body.addEventListener('click', e => {
    bulletArr.push(new Bullet(ship.noseX, ship.noseY, ship.angle, 5, 'orange', 5));
});

// Expires bullet after a certain time
function bulletExpired(arr, expDate) {
    loop1:
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].time >= expDate) {
            arr.splice(i, 1);
            break loop1;
        } 
    }
    return arr;
}

// Renders the game 
function gameLoop() {
    // Clears screen
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvWidth, canvHeight);    

    if (ship.visible === true) {
        // Updates position of ship and draws it
        ship.update(mouse.x, mouse.y, keyPresses);
        ship.draw();

        shield.update(ship.x, ship.y, ship.angle, false);
        shield.draw();
        
        // Generate enemies when there are none left
        if (enemyArr.length === 0) {
            enemyArr = (nextLvl(enemyArr, ship, level)).slice(0);
            level++;
        }
        
        // Updates player's bullet
        if (bulletArr.length !== 0) {
            for (let i = 0; i < bulletArr.length; i++) {
                bulletArr[i].update();
                bulletArr[i].draw();
            }
            bulletExpired(bulletArr, 125);
        }

        // Updates square enemy bullets
        if (squareBullArr.length !== 0) {
            for (let j = 0; j < squareBullArr.length; j++) {
                squareBullArr[j].update();
                squareBullArr[j].draw();
            }
            bulletExpired(squareBullArr, 250);
        }

        // Updates pentagon enemy bullets
        if (pentBullArr.length !== 0) {
            for (let k = 0; k < pentBullArr.length; k++) {
                pentBullArr[k].update();
                pentBullArr[k].draw();
            }
            bulletExpired(pentBullArr, 2000);
        }

        // Updates octagon enemy bullets
        if (octBullArr.length !== 0) {
            for (let l = 0; l < octBullArr.length; l++) {
                octBullArr[l].update();
                octBullArr[l].draw();
            }
            bulletExpired(octBullArr, 800);
        }

        // Updates each enemy position and redraws each one
        loop3:
        for (let p = 0; p < enemyArr.length; p++) {

            // Updates enemy position
            enemyArr[p].update(ship.x, ship.y);
            enemyArr[p].draw();

            // Handles enemy firing
            if (enemyArr[p].name === "square") 
                enemyArr[p].fire(squareBullArr);
            else if (enemyArr[p].name === "pentagon")
                enemyArr[p].fire(pentBullArr);
            else if (enemyArr[p].name === "octagon")
                enemyArr[p].fire(octBullArr);

            // Tests for collision between the enemy and the shield and ship
            if (collision(shield.cx, shield.cy, shield.radius, shield.name, enemyArr[p].x, enemyArr[p].y, enemyArr[p].radius, enemyArr[p].name, shield.angle)) {
                particleArr = destroy(enemyArr[p].x, enemyArr[p].y, 5, particleArr);
                enemyArr.splice(p, 1);
                break loop3;
            } else if (collision(ship.x, ship.y, ship.radius, ship.name, enemyArr[p].x, enemyArr[p].y, enemyArr[p].radius, enemyArr[p].name, shield.angle)) {
                particleArr = destroy(ship.x, ship.y, 50, particleArr);
                lives--;

                if (lives === 0) 
                    ship.visible = false;

                ship.x = canvWidth / 2;
                ship.y = canvHeight / 2;
            } 
        }
    }
    
    // Updates explosion particles if there are any
    if (particleArr.length !== 0) {
        loop2:
        for (let k = 0; k < particleArr.length; k++) {
            particleArr[k].update();

            if (Math.round(particleArr[k].velX) === 0 && Math.round(particleArr[k].velY) === 0) {
                particleArr.splice(k, 1);
                break loop2;
            }

            particleArr[k].draw();
        }
    }

    // Keeps game going as long as live count isn't zero and the explosion particles haven't finished animating
    if (lives !== 0 || particleArr.length !== 0)
        requestAnimationFrame(gameLoop);
}
gameLoop();