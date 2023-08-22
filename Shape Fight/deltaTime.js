export default function deltaTime(lastInterval) {
    let currentInterval = Date.now();
    let dt = (currentInterval - lastInterval) / 1000;
    console.log(dt);
    return [currentInterval, dt];
}