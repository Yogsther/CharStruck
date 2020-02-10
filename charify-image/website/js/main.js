/**
 * WEBSITE MAIN, NOT GAME
 */

const SETTINGS = {
    DEBUG: false,
    LOG_KEYS: false,
    GOD_MODE: false,
    EDITOR: true,
    PAUSED: false,
    DISABLE_COLLISIONS: false,
    DRAW_HITBOXES: true,
    DRAW_PATH_FIDNING: false,
    DRAW_PATHS: true
};

var STATS = {};

var frames = 0;
var world = [];
var timer = 0;
var mapIndex = 0;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var SCALE = 1;

var camera = { x: 0, y: 0 };
var cameraOffset = { x: 0, y: 0 };

window.onload = () => {
    resizeCanvas();
    loop();
};

window.onresize = resizeCanvas;

function resizeCanvas() {
    canvas.width = document.body.offsetWidth;
    canvas.height = document.body.offsetHeight;
    ctx.imageSmoothingEnabled = false;
}

function loop() {
    logic();
    render();
    requestAnimationFrame(loop);
}

function getRandomWord() {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function logic() {
    for (item of world) {
        item.logic();
    }
}

function pst() {
    document.getElementById("special").innerText =
        "You can press ESC to access the developer menu, there you can see the pathfinding, hitboxes and create your own level.";
}

function render() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (item of world) {
        item.draw();
    }

    renderMenu();

    frames++;
}

function draw(
    texture,
    imgx,
    imgy,
    imgw,
    imgh,
    x,
    y,
    w,
    h,
    boundByCamera = true,
    centered = true
) {
    var relativePosition = getRelativeCameraPosition(
        x,
        y,
        w,
        h,
        boundByCamera,
        centered
    );

    ctx.drawImage(
        texture,
        imgx,
        imgy,
        imgw,
        imgh,
        relativePosition.x,
        relativePosition.y,
        w,
        h
    );
}

function getRelativeCameraPosition(
    x,
    y,
    w = 0,
    h = 0,
    boundByCamera = true,
    centered = true
) {
    if (boundByCamera) {
        x = x - (camera.x + cameraOffset.x);
        y = y - (camera.y + cameraOffset.y);
    }

    if (centered) {
        x += canvas.width / 2 + w / 2;
        y += canvas.height / 2 + h / 2;
    }
    return {
        x,
        y
    };
}
