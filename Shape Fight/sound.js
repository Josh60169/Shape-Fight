// Music functions control the music being played
export function music(file) {
    let myMusic = new Audio(file);
    myMusic.loop = true;
    myMusic.volume = 0.5;
    myMusic.play();
    return myMusic;
}

export function stopMusic(music) {
    music.pause();
    music.currentTime = 0;
    return music;
}

export function startMusic(music, volume) {
    music.volume = volume;
    music.loop = true;
    music.play();
    return music;
}

export function sound(soundId) {
    let sound = new Audio(soundId);
    sound.play();
}