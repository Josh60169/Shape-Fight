export function gameOver(music) {
    music.pause();
    music.currentTime = 0;
}

export function gameOverLoop(canvas, ctx, canvWidth, canvHeight, updateButtons, startGame, toggleScreen, music, resetFlag, menuFlag, titleMusic, menuBtn, restartBtn) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvWidth, canvHeight);

    ctx.fillStyle = 'white';
    ctx.font = "30px 'Press Start 2P'";
    ctx.textAlign = "center";
    ctx.textBaseLine = "middle";
    ctx.fillText("GAME OVER", canvWidth / 2, canvHeight / 2);

    updateButtons();

    canvas.addEventListener('click', e => {
        let rect = canvas.getBoundingClientRect();
        let xpos = e.clientX - rect.left;
        let ypos = e.clientY - rect.top; 

        if (xpos >= menuBtn.x && xpos <= menuBtn.x + menuBtn.width && ypos >= menuBtn.y && ypos <= menuBtn.y + menuBtn.height)
            menuFlag = true;
        else 
            menuFlag = false;

        if (xpos >= restartBtn.x && xpos <= restartBtn.x + restartBtn.width && ypos >= restartBtn.y && ypos <= restartBtn.y + restartBtn.height)
            resetFlag = true;
        else 
            resetFlag = false;
    });

    if (!resetFlag && !menuFlag)
        requestAnimationFrame(() => gameOverLoop(canvas, ctx, canvWidth, canvHeight, updateButtons, startGame, toggleScreen, music, resetFlag, menuFlag, titleMusic, menuBtn, restartBtn));
    else if (resetFlag) 
        startGame();
    else {
        toggleScreen('start-screen', true);
        toggleScreen('gameCanvas', false);
        titleMusic = music("gameMusic/TitleScreenSong.mp3");
    }
}