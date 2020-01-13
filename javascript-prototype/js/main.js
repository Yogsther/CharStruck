var DEBUG = true;
var LOG_KEYS = false;

var world = [];

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var SCALE = 1;

var player = new Player();
var camera = { x: 0, y: 0 };

/* for (var i = 0; i < 1; i++) {
    new Mob(100, 100, 1);
} */

new Wall(100, 100, 500, 100);

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

document.body.appendChild(canvas);

function loop() {
    logic();
    render();
    requestAnimationFrame(loop);
}

var keysDown = [];
document.body.addEventListener("keydown", e => {
    keysDown[e.keyCode] = true;
    if (keybinds[e.keyCode]) keybinds[e.keyCode]();
    if (LOG_KEYS) console.log(e.keyCode);
});

document.body.addEventListener("keyup", e => {
    keysDown[e.keyCode] = false;
});

function cameraLogic() {
    var cameraSight = {
        x: player.x - camera.x + player.width / 2,
        y: player.y - camera.y + player.height / 2
    };
    camera.direction =
        (Math.atan2(cameraSight.y, cameraSight.x) * 180) / Math.PI;

    var distance = Math.sqrt(
        Math.pow(cameraSight.x, 2) + Math.pow(cameraSight.y, 2)
    );

    camera.speed = distance / 25;

    camera.x += Math.cos(camera.direction / (180 / Math.PI)) * camera.speed;

    camera.y += Math.sin(camera.direction / (180 / Math.PI)) * camera.speed;
}

function getDirection(up, down, left, right) {
    var direction = 0;
    var pointers = [];

    if (keysDown[up]) pointers.push(180);
    if (keysDown[down]) pointers.push(0);
    if (keysDown[left]) pointers.push(90);
    if (keysDown[right]) pointers.push(270);

    if (pointers.length == 0) return false;

    var pointersTotal = 0;
    for (var pointer of pointers) pointersTotal += pointer;

    // Edge case if the player is pressing (S + D), move to towards bottom right corner
    // Adding 0 + 270 and then deviding them with 2 does not result in the right direction.
    if (keysDown[right] && keysDown[down]) direction = 315;
    else direction = pointersTotal / pointers.length;
    return direction + 90;
}

function getRandomWord() {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function logic() {
    cameraLogic();

    for (item of world) {
        item.logic();
    }

    for (var a of world) {
        if (a.collidable) {
            for (let b of world) {
                if (b.collidable && b != a) checkCollision(a, b);
            }
        }
    }

    for (var obj of world) {
        if (obj.collidable) {
            checkCollision(player, obj);
        }
    }
}

function render() {
    var size = 5;
    var tileWidth = "GROUND".length * SCALE * 8 * size;
    var tileHeight = SCALE * 8 * size;
    var padding = tileWidth * SCALE * 2;

    // Draw ground infinite scroll illusion
    for (var x = -padding; x < canvas.width + padding; x += tileWidth) {
        for (var y = -padding; y < canvas.height + padding; y += tileHeight) {
            Alphabet.drawWord(
                "GROUND",
                x - (camera.x % tileWidth),
                y - (camera.y % tileWidth),
                size * SCALE,
                COLORS.dark,
                false,
                false
            );
        }
    }

    for (item of world) {
        item.draw();
    }
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
        x = x - camera.x;
        y = y - camera.y;
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
