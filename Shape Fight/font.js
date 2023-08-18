// load in 8 bit font
export let eightBit = new FontFace('Press Start 2P', "url(https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap)");
eightBit.load().then((font) => {
    document.fonts.add(font);
    console.log("font loaded");
});
