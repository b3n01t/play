
const YouLoose = (currentTime) => {
    running = true;
    const diff = currentTime - lastFrameTime;
    if (diff < 1 / targetFPS) {
        reqAnimationID = requestAnimationFrame(GameLoop);
        return;
    } else {
        lastFrameTime = currentTime;
        frame++;
    }
}