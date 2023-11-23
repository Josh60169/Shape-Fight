export function gameOver(music) {
    music.pause();
    music.currentTime = 0;
}

export function gameOverLoop(canvas, ctx, canvWidth, canvHeight, updateButtons, startGame, toggleScreen, music, resetFlag, menuFlag, titleMusic, mainTheme, menuBtn, restartBtn) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvWidth, canvHeight);

    ctx.fillStyle = 'white';
    ctx.font = "30px 'Press Start 2P'";
    ctx.textAlign = "center";
    ctx.textBaseLine = "middle";
    ctx.fillText("GAME OVER", canvWidth / 2, canvHeight / 2);

    updateButtons();

    canvas.addEventListener('click', e => {
        if (e.clientX >= menuBtn.x && e.clientX <= menuBtn.x + menuBtn.width && e.clientY >= menuBtn.y && e.clientY <= menuBtn.y + menuBtn.height)
            menuFlag = true;
        else 
            menuFlag = false;

        if (e.clientX >= restartBtn.x && e.clientX <= restartBtn.x + restartBtn.width && e.clientY >= restartBtn.y && e.clientY <= restartBtn.y + restartBtn.height)
            resetFlag = true;
        else 
            resetFlag = false;
    });

    if (!resetFlag && !menuFlag)
        requestAnimationFrame(() => gameOverLoop(canvas, ctx, canvWidth, canvHeight, updateButtons, startGame, toggleScreen, music, resetFlag, menuFlag, titleMusic, mainTheme, menuBtn, restartBtn));
    else if (resetFlag) {
        mainTheme = music("gameMusic/main theme.mp3");
        startGame();
    } else {
        toggleScreen('start-screen', true);
        toggleScreen('gameCanvas', false);
        titleMusic = music("gameMusic/TitleScreenSong.mp3");
    }
}