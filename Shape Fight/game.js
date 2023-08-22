import { canvas, ctx, canvWidth, canvHeight } from './gameCanv.js';
import Ship from './ship.js';
import Bullet from './bullet.js';
import nextLvl from './nextLvl.js';
import Shield from './shield.js';
import {collision} from './collision.js';
import gameOver from './gameOver.js';
import destroy from './destroyAnim.js';
import spawnpoint from './spawnpoint.js';
import deltaTime from './deltaTime.js';

// Import font used
// let eightBit = new FontFace('Press Start 2P', "url(https://fonts.gstatic.com/s/pressstart2p/v15/e3t4euO8T-267oIAQAu6jDQyK3nYivN04w.woff2)", format('woff2'));
// eightBit.load().then((font) => {
//     document.fonts.add(font);
//     console.log("font loaded");
// });

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
let lastInterval = Date.now();
let dt;
let fps = 1000 / 60; 

function startGame() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.visible = true;
    toggleScreen('start-screen', false);
    toggleScreen('gameCanvas', true);
    gameLoop();
}

function toggleScreen(id, toggle) {
    let element = document.getElementById(id);
    let display = toggle ? 'block' : 'none';
    element.style.display = display;
}

let startButton = document.getElementById('start-button');
startButton.addEventListener("click", e => {
    startGame();
});

let tutButton = document.getElementById('how-to-play');
tutButton.addEventListener("click", e => {
    toggleScreen('start-screen', false);
    toggleScreen('instructions', true);
});

let backBtn = document.getElementById('back-btn');
backBtn.addEventListener("click", e => {
    toggleScreen('instructions', false);
    toggleScreen('start-screen', true);
});

let creditsBtn = document.getElementById('credits-btn');
creditsBtn.addEventListener("click", e => {
    toggleScreen('start-screen', false);
    toggleScreen('credits-screen', true);
});

let creditsBkBtn = document.getElementById('credits-back-btn');
creditsBkBtn.addEventListener("click", e => {
    toggleScreen('credits-screen', false);
    toggleScreen('start-screen', true);
});

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
canvas.addEventListener('click', e => {
    bulletArr.push(new Bullet(ship.noseX, ship.noseY, ship.angle, 125 * 5, 'orange', 5));
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

function gameLoop() {
    // Clears screen
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvWidth, canvHeight);    

    // Calculate delta time
    [lastInterval, dt] = deltaTime(lastInterval);
    if (dt > fps) {
        lastInterval -= (dt % fps);
    } else if (dt < fps) {
        lastInterval += (dt % fps);
    }

    // Updates explosion particles if there are any
    if (particleArr.length !== 0) {
        loop2:
        for (let k = 0; k < particleArr.length; k++) {
            particleArr[k].update(dt);

            if (Math.round(particleArr[k].velX) === 0 && Math.round(particleArr[k].velY) === 0) {
                particleArr.splice(k, 1);
                break loop2;
            }

            particleArr[k].draw();
        }
    }

    if (ship.visible === true) {
        // Updates position of ship and draws it
        ship.update(mouse.x, mouse.y, keyPresses, dt);
        ship.draw();

        shield.update(ship.x, ship.y, ship.angle, false);
        shield.draw();
        
        // Generate enemies when there are none left
        if (enemyArr.length === 0) {
            enemyArr = (nextLvl(enemyArr, ship, level)).slice(0);
            level++;
            particleArr = [];
        }
        
        // Updates player's bullet
        if (bulletArr.length !== 0) {
            loop4:
            for (let i = 0; i < bulletArr.length; i++) {
                bulletArr[i].update(dt);
                bulletArr[i].draw();
                
                for (let j = 0; j < enemyArr.length; j++) {
                    if (collision(bulletArr[i].x, bulletArr[i].y, bulletArr[i].radius, 'bullet', enemyArr[j].x, enemyArr[j].y, enemyArr[j].radius, enemyArr[j].name, shield.angle)) {
                        particleArr = destroy(enemyArr[j].x, enemyArr[j].y, 5, particleArr);
                        enemyArr.splice(j, 1);
                        bulletArr.splice(i, 1);
                        break loop4;
                    }
                }
            }

            bulletExpired(bulletArr, 125);
        }

        // Updates square enemy bullets
        if (squareBullArr.length !== 0) {
            for (let j = 0; j < squareBullArr.length; j++) {
                squareBullArr[j].update(dt);
                squareBullArr[j].draw();
                
                if (collision(squareBullArr[j].x, squareBullArr[j].y, squareBullArr[j].radius, 'bullet', ship.x, ship.y, ship.radius, ship.name, shield.angle)) {
                    particleArr = destroy(ship.x, ship.y, 50, particleArr);
                    lives--;

                    if (lives === 0) 
                        ship.visible = false;

                    enemyArr = [];
                    enemyArr = nextLvl(enemyArr, ship, level);
                }
            }
            bulletExpired(squareBullArr, 250);
        }

        // Updates pentagon enemy bullets
        if (pentBullArr.length !== 0) {
            for (let k = 0; k < pentBullArr.length; k++) {
                pentBullArr[k].update(dt);
                pentBullArr[k].draw();

                if (collision(pentBullArr[k].x, pentBullArr[k].y, pentBullArr[k].radius, 'bullet', ship.x, ship.y, ship.radius, ship.name, shield.angle)) {
                    particleArr = destroy(ship.x, ship.y, 50, particleArr);
                    lives--;

                    if (lives === 0) 
                        ship.visible = false;

                    enemyArr = [];
                    enemyArr = nextLvl(enemyArr, ship, level);
                }
            }
            bulletExpired(pentBullArr, 2000);
        }

        // Updates octagon enemy bullets
        if (octBullArr.length !== 0) {
            for (let l = 0; l < octBullArr.length; l++) {
                octBullArr[l].update(dt);
                octBullArr[l].draw();

                if (collision(octBullArr[l].x, octBullArr[l].y, octBullArr[l].radius, 'bullet', ship.x, ship.y, ship.radius, ship.name, shield.angle)) {
                    particleArr = destroy(ship.x, ship.y, 50, particleArr);
                    lives--;

                    if (lives === 0) 
                        ship.visible = false;

                    enemyArr = [];
                    enemyArr = nextLvl(enemyArr, ship, level);
                }
            }
            bulletExpired(octBullArr, 800);
        }

        // Updates each enemy position and redraws each one
        loop3:
        for (let p = 0; p < enemyArr.length; p++) {

            // Updates enemy position
            enemyArr[p].update(ship.x, ship.y, dt);
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
                if (Math.round(Math.random()) === 1) {
                    // kill the enemy
                    particleArr = destroy(enemyArr[p].x, enemyArr[p].y, 5, particleArr);
                    enemyArr.splice(p, 1);
                } else {
                    [enemyArr[p].x, enemyArr[p].y] = spawnpoint(ship.radius)
                }
                break loop3;

            } else if (collision(ship.x, ship.y, ship.radius, ship.name, enemyArr[p].x, enemyArr[p].y, enemyArr[p].radius, enemyArr[p].name, shield.angle)) {

                particleArr = destroy(ship.x, ship.y, 50, particleArr);
                lives--;

                if (lives === 0) 
                    ship.visible = false;

                enemyArr = [];
                enemyArr = nextLvl(enemyArr, ship, level);
            } 
        }
    }

    // Keeps game going as long as live count isn't zero and the explosion particles haven't finished animating
    if (lives !== 0 || particleArr.length !== 0)
        requestAnimationFrame(gameLoop);
}