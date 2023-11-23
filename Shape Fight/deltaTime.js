export default function deltaTime(lastInterval) {
    let currentInterval = Date.now();
    let dt = (currentInterval - lastInterval) / 1000;
    return [currentInterval, dt];
}