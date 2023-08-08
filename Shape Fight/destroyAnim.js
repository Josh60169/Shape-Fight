import Particle from './explosionParticles.js';
import { ctx } from './gameCanv.js';

export default function destroy(cx, cy, numOfPar, arr) {
    for (let i = 0; i < numOfPar; i++)
        arr.push(new Particle(cx, cy, '#E25822'));
    return arr;
}