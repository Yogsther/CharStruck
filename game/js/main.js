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

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var SCALE = 1;

var player = new Player();
var camera = { x: 0, y: 0 };
var cameraOffset = { x: 0, y: 0 };

window.onload = () => {
    resizeCanvas();
    loop();

    displayMainMenu();
    /* loadMap(MAPS.level1); */
};

window.onresize = resizeCanvas;

function resizeCanvas() {
    canvas.width = document.body.offsetWidth;
    canvas.height = document.body.offsetHeight;
    ctx.imageSmoothingEnabled = false;
}

function reset() {
    world = [];
    player = new Player(0, 0);
    camera = { x: 0, y: 0 };
}

document.body.appendChild(canvas);

function loop() {
    logic();
    render();
    if (SETTINGS.DEBUG && SETTINGS.EDITOR) editorLoop();
    requestAnimationFrame(loop);
}

var keysDown = [];
document.body.addEventListener("keydown", e => {
    keysDown[e.keyCode] = true;
    for (var bind of keybinds) {
        if (keysDown[bind.key]) {
            if (typeof bind.run == "string") {
                SETTINGS[bind.run] = !SETTINGS[bind.run];
            } else {
                bind.run();
            }
        }
    }
    if (SETTINGS.LOG_KEYS) console.log(e.keyCode);
    if (showingMenu && e.keyCode == 32) {
        mapIndex = 0;
        showingMenu = false;
        loadMap(mapPool[mapIndex]);
    }
});

document.body.addEventListener("keyup", e => {
    keysDown[e.keyCode] = false;
});

function cameraLogic() {
    if (SETTINGS.PAUSED) return;
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

    if (!SETTINGS.PAUSED) {
        for (item of world) {
            item.logic();
        }
    }

    if (!SETTINGS.DISABLE_COLLISIONS) {
        for (var a of world) {
            if (a.collidable) {
                for (let b of world) {
                    if (b.collidable && b != a) checkCollision(a, b);
                }
            }
        }
    }

    stepShake();
}

function render() {
    if (showingMenu) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        var size = 5;
        var tileWidth = "GROUND".length * SCALE * 8 * size;
        var tileHeight = SCALE * 8 * size;
        var padding = tileWidth * SCALE * 2;

        // Draw ground infinite scroll illusion
        for (var x = -padding; x < canvas.width + padding; x += tileWidth) {
            for (
                var y = -padding;
                y < canvas.height + padding;
                y += tileHeight
            ) {
                Alphabet.drawWord(
                    "GROUND",
                    x - ((camera.x + cameraOffset.x) % tileWidth),
                    y - ((camera.y + cameraOffset.y) % tileWidth),
                    size * SCALE,
                    COLORS.dark,
                    false,
                    false
                );
            }
        }
    }

    for (item of world) {
        item.draw();
    }

    if (displayingText) {
        renderLevelIntro();
    }

    if (showingMenu) {
        renderMenu();
    } else {
        renderTimer();
    }

    if (SETTINGS.DEBUG) {
        ctx.font = "20px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "right";

        ctx.fillText(`World size: ${world.length}`, canvas.width - 20, 40);
        ctx.fillText(`C:ds X ${mouse.x} Y ${mouse.y}`, canvas.width - 20, 70);
        ctx.fillText(
            `REL_C: X ${Math.round(realtiveMouse.x)} Y ${Math.round(
                realtiveMouse.y
            )}`,
            canvas.width - 20,
            100
        );

        ctx.textAlign = "left";
        for (var i = 0; i < keybinds.length; i++) {
            var bind = keybinds[i];
            var isBool = typeof bind.run == "string";

            ctx.fillStyle = keysDown[bind.key] ? "red" : "white";
            var text = bind.name;
            if (isBool) {
                var enabled = SETTINGS[bind.run];
                ctx.fillStyle = enabled ? "#2ade63" : "#ff143f";
                text += ": " + (enabled ? "enabled" : "disabled");
            }

            ctx.fillText(text, 20, 40 + i * 25);
        }
    }

    frames++;
}

var shakeEffect = 2;
var shakeFriction = 5;
var shakeDirection = 0;
var shakeAmount = 0;
var shakeActive = false;

function shake(direction, amount, effect = 2) {
    cameraOffset = { x: 0, y: 0 };
    shakeDirection = direction;
    shakeAmount = amount;
    shakeEffect = effect;
    shakeActive = true;
}

function stepShake() {
    if (shakeAmount > 0) {
        step();
        shakeAmount -= shakeFriction;
        if (shakeAmount <= 0) {
            shakeDirection += 180;
            shakeAmount = 0;
        }
    } else {
        // Restore
        if (shakeActive) {
            if (
                Math.sqrt(
                    Math.pow(cameraOffset.x, 2) - Math.pow(cameraOffset.y, 2)
                ) /
                    2 <=
                shakeEffect
            ) {
                cameraOffset = { x: 0, y: 0 };
                shakeActive = false;
            } else {
                step();
            }
        }
    }

    function step() {
        cameraOffset.x +=
            Math.cos(shakeDirection / (180 / Math.PI)) * shakeEffect;
        cameraOffset.y +=
            Math.sin(shakeDirection / (180 / Math.PI)) * shakeEffect;
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
