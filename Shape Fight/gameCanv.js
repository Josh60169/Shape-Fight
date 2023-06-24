// This file completely sets up the canvas
export let canvas = document.querySelector('#gameCanvas');
export let ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// Might want to move this later
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

export let canvWidth = canvas.width;
export let canvHeight = canvas.height;