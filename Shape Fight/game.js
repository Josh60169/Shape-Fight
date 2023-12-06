import { canvas, ctx, canvWidth, canvHeight } from './gameCanv.js';
import Ship from './ship.js';
import Bullet from './bullet.js';
import nextLvl from './nextLvl.js';
import Shield from './shield.js';
import {collision} from './collision.js';
import {gameOver, gameOverLoop} from './gameOver.js';
import destroy from './destroyAnim.js';
import spawnpoint from './spawnpoint.js';
import deltaTime from './deltaTime.js';
import {music, sound, startMusic, stopMusic} from './sound.js';
import Button from './button.js';

// Creates ship, arrays for bullets, and mouse
let lives = 3;
let level = 1;
let ship = new Ship(canvWidth / 2, canvHeight / 2, "lightBlue");
let shipLives = new Ship(canvWidth / 2, canvHeight / 2, "lightBlue");
let shield = new Shield(ship.x, ship.y, ship.radius, ship.angle)
let bulletArr = [];
let enemyArr = [];
let squareBullArr = [];
let pentBullArr = [];
let octBullArr = [];
let particleArr = [];
let lastInterval = Date.now();
let dt;
let fps = 1000 / 60; 
let mainTheme;
let titleMusic;
const SaveKeyHighScore = 'highScore';
let score = 0;
let showLvl = false;
let fire = new Ship(canvWidth / 2, canvHeight / 2, 'orange');
let shipEngine = new Audio("gameMusic/Ship Moving.mp3");
let restartBtn = new Button((canvWidth / 2) - 70, canvHeight / 4, "RESTART", 140, 25);
let menuBtn = new Button((canvWidth / 2) - 90, canvHeight * 3 / 4, "MAIN MENU", 180, 25);
let resetFlag, menuFlag = false;

let highScore = localStorage.getItem('highScore');

if (highScore === null) 
    highScore = 0;

function startGame() {
    lives = 3;
    level = 1;
    ship.resetShip();
    score = 0;
    
    titleMusic = stopMusic(titleMusic);
    canvas.visible = true;
    resetFlag = false;
    menuFlag = false;
    toggleScreen('start-screen', false);
    toggleScreen('gameCanvas', true);
    mainTheme = music("gameMusic/main theme.mp3");
    enemyArr = (nextLvl(enemyArr, ship, level)).slice(0);
    gameLoop();
}

function toggleScreen(id, toggle) {
    let element = document.getElementById(id);
    let display = toggle ? 'block' : 'none';
    element.style.display = display;
}

let playBtn = document.getElementById('play-btn');
playBtn.addEventListener("click", e => {
    toggleScreen('play-screen', false);
    toggleScreen('start-screen', true);

    // Plays title screen music until game starts
    titleMusic = music("gameMusic/TitleScreenSong.mp3");
});

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
    if (ship.visible) {
        bulletArr.push(new Bullet(ship.noseX, ship.noseY, ship.angle, 125 * 5, 'orange', 5));
        sound("gameMusic/Ship Gun.mp3");
    }
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

function updateScore(score, highScore) {
    ctx.fillStyle = "white";
    ctx.font = "15px 'Press Start 2P'";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(`High Score: ${highScore}`, 30, 30);
    ctx.fillText(`Score: ${score}`, 30, 50);
}

function updateButtons() {
    restartBtn.listen();
    restartBtn.draw();

    menuBtn.listen();
    menuBtn.draw();
}

function gameLoop() {
    // Clears screen
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvWidth, canvHeight);    

    // update the score
    if (score > highScore) {
        highScore = score
        localStorage.setItem(SaveKeyHighScore, highScore);
    }
    updateScore(score, highScore);

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

    if (ship.visible) {
        ctx.beginPath();
        ctx.strokeStyle = 'yellow';
        ctx.strokeRect(-10, -10, 20, 20);
        // Updates position of ship and draws it
        ship.update(mouse.x, mouse.y, keyPresses, dt);
        ship.draw();
        fire.drawFire(ship, fps);
        ship.fireSound(shipEngine);

        shipLives.drawLives();

        shield.update(ship.x, ship.y, ship.angle, false);
        shield.draw();
        
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
                        score++;
                        break loop4;
                    }
                }
            }

            bulletExpired(bulletArr, 0.8);
        }

        // checks if the level has been completed
        if (enemyArr.length === 0) {
            // Triggers the level text
            showLvl = true;
            
            // Sets up next level
            bulletArr = [];
            pentBullArr = [];
            squareBullArr = [];
            octBullArr = [];
            ship.visible = false;

            // Plays sound and stops music (will be restarted after setTimeout count expires)
            mainTheme = stopMusic(mainTheme);
            sound("gameMusic/Level Completed.mp3");

            setTimeout(() => {
                level++;
                enemyArr = nextLvl(enemyArr, ship, level);
                particleArr = [];
                ship.visible = true;
                mainTheme = startMusic(mainTheme, 0.5);
            }, 2000);
        }

        // Updates square enemy bullets
        if (squareBullArr.length !== 0) {
            for (let j = 0; j < squareBullArr.length; j++) {
                squareBullArr[j].update(dt);
                squareBullArr[j].draw();
                
                if (collision(squareBullArr[j].x, squareBullArr[j].y, squareBullArr[j].radius, 'bullet', ship.x, ship.y, ship.radius, ship.name, shield.angle)) {
                    particleArr = destroy(ship.x, ship.y, 50, particleArr);
                    lives--;
                    sound("gameMusic/ship death.mp3");
                    mainTheme = stopMusic(mainTheme);
                    ship.shipFire = false;
                    ship.fireSound(shipEngine);
                    
                    // Reset bullets and enemies
                    enemyArr = [];
                    bulletArr = [];
                    pentBullArr = [];
                    squareBullArr = [];
                    octBullArr = [];
                    ship.visible = false;

                    if (lives === 0) {
                        ship.visible = false;
                        gameOver(mainTheme);
                    } else {
                        setTimeout(() => {
                            enemyArr = nextLvl(enemyArr, ship, level);
                            particleArr = [];
                            ship.visible = true;
                            mainTheme = startMusic(mainTheme, 0.5);
                        }, 2000);
                    }
                }
            }
            bulletExpired(squareBullArr, 2);
        }

        // Updates pentagon enemy bullets
        if (pentBullArr.length !== 0) {
            for (let k = 0; k < pentBullArr.length; k++) {
                pentBullArr[k].update(dt);
                pentBullArr[k].draw();

                if (collision(pentBullArr[k].x, pentBullArr[k].y, pentBullArr[k].radius, 'bullet', ship.x, ship.y, ship.radius, ship.name, shield.angle)) {
                    particleArr = destroy(ship.x, ship.y, 50, particleArr);
                    lives--;
                    sound("gameMusic/ship death.mp3");
                    mainTheme = stopMusic(mainTheme);
                    ship.shipFire = false;
                    ship.fireSound(shipEngine);

                    // Reset bullets and enemies
                    enemyArr = [];
                    bulletArr = [];
                    pentBullArr = [];
                    squareBullArr = [];
                    octBullArr = [];
                    ship.visible = false;

                    if (lives === 0) {
                        ship.visible = false;
                        gameOver(mainTheme);
                    } else {
                        setTimeout(() => {
                            enemyArr = nextLvl(enemyArr, ship, level);
                            particleArr = [];
                            ship.visible = true;
                            mainTheme = startMusic(mainTheme, 0.5);
                        }, 2000);
                    }
                }
            }
            bulletExpired(pentBullArr, 7);
        }

        // Updates octagon enemy bullets
        if (octBullArr.length !== 0) {
            for (let l = 0; l < octBullArr.length; l++) {
                octBullArr[l].update(dt);
                octBullArr[l].draw();

                if (collision(octBullArr[l].x, octBullArr[l].y, octBullArr[l].radius, 'bullet', ship.x, ship.y, ship.radius, ship.name, shield.angle)) {
                    particleArr = destroy(ship.x, ship.y, 50, particleArr);
                    lives--;
                    sound("gameMusic/ship death.mp3");
                    mainTheme = stopMusic(mainTheme);
                    ship.shipFire = false;
                    ship.fireSound(shipEngine);

                    // Reset bullets and enemies
                    enemyArr = [];
                    bulletArr = [];
                    pentBullArr = [];
                    squareBullArr = [];
                    octBullArr = [];
                    ship.visible = false;

                    if (lives === 0) {
                        ship.visible = false;
                        gameOver(mainTheme);
                    } else {
                        setTimeout(() => {
                            enemyArr = nextLvl(enemyArr, ship, level);
                            particleArr = [];
                            ship.visible = true;
                            mainTheme = startMusic(mainTheme, 0.5);
                        }, 2000);
                    }
                }
            }
            bulletExpired(octBullArr, 10);
        }

        // Updates each enemy position and redraws each one
        loop3:
        for (let p = 0; p < enemyArr.length; p++) {

            // Updates enemy position
            enemyArr[p].update(ship.x, ship.y, dt);
            enemyArr[p].draw();

            // Handles enemy firing
            if (enemyArr[p].name === "square") {
                enemyArr[p].fire(squareBullArr);
            } else if (enemyArr[p].name === "pentagon") {
                enemyArr[p].fire(pentBullArr);
            } else if (enemyArr[p].name === "octagon") {
                enemyArr[p].fire(octBullArr);
            }

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
                // kill player
                particleArr = destroy(ship.x, ship.y, 50, particleArr);
                lives--;
                sound("gameMusic/ship death.mp3");
                mainTheme = stopMusic(mainTheme);
                ship.shipFire = false;
                ship.fireSound(shipEngine);

                // Reset bullets and enemies
                enemyArr = [];
                bulletArr = [];
                pentBullArr = [];
                squareBullArr = [];
                octBullArr = [];
                ship.visible = false;

                if (lives === 0) {
                    ship.visible = false;
                    gameOver(mainTheme);
                } else {
                    setTimeout(() => {
                        enemyArr = nextLvl(enemyArr, ship, level);
                        particleArr = [];
                        ship.visible = true;
                        mainTheme = startMusic(mainTheme, 0.5);
                    }, 2000);
                }
            } 
        }
    }

    // checks if the level text should be shown
    if (showLvl) {
        ctx.fillStyle = "white";
        ctx.font = "30px 'Press Start 2P'";
        ctx.textAlign = "center"
        ctx.textBaseline = "middle";
        ctx.fillText(`LEVEL ${level + 1}`, canvWidth / 2, canvHeight / 2);
        setTimeout(() => {showLvl = false}, 1900);
    }

    // Keeps game going as long as live count isn't zero and the explosion particles haven't finished animating
    if (lives !== 0 || particleArr.length !== 0)
        requestAnimationFrame(gameLoop);
    else 
        gameOverLoop(canvas, ctx, canvWidth, canvHeight, updateButtons, startGame, toggleScreen, music, resetFlag, menuFlag, titleMusic, mainTheme, menuBtn, restartBtn);
}