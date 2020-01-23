var wallSpawnDimensions = { w: 50, h: 50 };
var mouseOver = false;
var lastMousePos = false;

function editorLoop() {
    if (mouse.contextDown && SETTINGS.PAUSED) {
        if (lastMousePos) {
            camera.x += lastMousePos.x - mouse.x;
            camera.y += lastMousePos.y - mouse.y;
        }
        lastMousePos = { x: mouse.x, y: mouse.y };
        return;
    }

    mouseOver = false;
    var collision;
    for (var item of world) {
        collision = areColliding(
            {
                x: realtiveMouse.x,
                y: realtiveMouse.y,
                width: 10,
                height: 10
            },
            item
        );

        if (collision) {
            mouseOver = item;
            break;
        }
    }
    if (mouseOver) {
        ctx.fillStyle = "rgba(255, 255, 255, .2)";
        var pos = getRelativeCameraPosition(mouseOver.x, mouseOver.y);
        ctx.fillRect(pos.x, pos.y, mouseOver.width, mouseOver.height);
        canvas.style.cursor = "pointer";

        var resize = false;

        var distanceFromCenter = {
            x: Math.abs(realtiveMouse.x - (mouseOver.x + mouseOver.width / 2)),
            y: Math.abs(realtiveMouse.y - (mouseOver.y + mouseOver.height / 2))
        };

        if (
            distanceFromCenter.x > mouseOver.width / 2 - 10 ||
            distanceFromCenter.y > mouseOver.height / 2 - 10
        ) {
            // RESIZE
            resize = collision;
            ctx.fillStyle = "yellow";
            var corner = { x: 0, y: 0, w: 0, h: 0 };
            if (collision.fromTop)
                corner = {
                    x: mouseOver.x,
                    y: mouseOver.y,
                    w: mouseOver.width,
                    h: 5
                };

            if (collision.fromBottom)
                corner = {
                    x: mouseOver.x,
                    y: mouseOver.y + mouseOver.height,
                    w: mouseOver.width,
                    h: 5
                };

            if (collision.fromLeft)
                corner = {
                    x: mouseOver.x,
                    y: mouseOver.y,
                    w: 5,
                    h: mouseOver.height
                };

            if (collision.fromRight)
                corner = {
                    x: mouseOver.x + mouseOver.width,
                    y: mouseOver.y,
                    w: 5,
                    h: mouseOver.height
                };

            var relativePos = getRelativeCameraPosition(
                corner.x - mouseOver.width / 2,
                corner.y - mouseOver.height / 2,
                mouseOver.width,
                mouseOver.height,
                true,
                true
            );
            ctx.fillRect(relativePos.x, relativePos.y, corner.w, corner.h);
        }

        if (mouse.down && !mouse.grabbing && !mouse.resize) {
            if (resize) {
                // Resize
                mouse.resize = resize;
                mouse.target = mouseOver;
            } else {
                // Grab
                mouse.resize = false;
                mouse.grabbing = mouseOver;
                if (mouseOver.type == OBJECT_TYPE.wall)
                    wallSpawnDimensions = {
                        w: mouseOver.width,
                        h: mouseOver.height
                    };
            }
            mouse.offset = {
                x: realtiveMouse.x - mouseOver.x,
                y: realtiveMouse.y - mouseOver.y
            };
        }
    } else {
        canvas.style.cursor = "";
    }

    if (mouse.resize) {
        var change = 0;
        if (mouse.resize.fromTop) {
            change = mouse.target.y - realtiveMouse.y;
            mouse.target.y -= change;
            mouse.target.height += change;
        } else if (mouse.resize.fromBottom) {
            change = mouse.target.y + mouse.target.height - realtiveMouse.y;
            mouse.target.height -= change;
        } else if (mouse.resize.fromLeft) {
            change = mouse.target.x - realtiveMouse.x;
            mouse.target.x -= change;
            mouse.target.width += change;
        } else if (mouse.resize.fromRight) {
            change = mouse.target.x + mouse.target.width - realtiveMouse.x;
            mouse.target.width -= change;
        }
    }

    if ((mouse.grabbing || mouse.resize) && !mouse.down) {
        // Action on item
        mouse.grabbing = false;
        mouse.resize = false;
    }

    if (mouse.grabbing) {
        if (keysDown[16]) {
            if (mouse.axsis) {
                moveItem(mouse.axsis == "x", mouse.axsis == "y");
            } else {
                mouse.axsis =
                    Math.abs(realtiveMouse.x - mouse.offset.x) >
                    Math.abs(realtiveMouse.y - mouse.offset.y)
                        ? "x"
                        : "y";
            }
        } else {
            mouse.axsis = false;
            moveItem();
        }
    }

    function moveItem(x = true, y = true) {
        if (x) mouse.grabbing.x = realtiveMouse.x - mouse.offset.x;
        if (y) mouse.grabbing.y = realtiveMouse.y - mouse.offset.y;
    }
}

function getDistance(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

canvas.addEventListener("mousedown", e => {
    lastMousePos = false;
    if (e.button == 2) {
        mouse.contextDown = true;
    } else {
        mouse.down = true;
    }
});

canvas.addEventListener("contextmenu", e => {
    e.preventDefault();
    return false;
});

canvas.addEventListener("mouseup", e => {
    mouse.down = false;
    mouse.contextDown = false;
});

var mouse = {
    x: 0,
    y: 0,
    down: false,
    contextDown: false,
    grabbing: false,
    offset: { x: 0, y: 0 },
    axsis: false
};
var realtiveMouse = mouse;

canvas.addEventListener("mousemove", e => {
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;

    realtiveMouse = {
        x: mouse.x + camera.x + cameraOffset.x - canvas.width / 2,
        y: mouse.y + camera.y + cameraOffset.y - canvas.height / 2
    };
});

function loadMap(map) {
    var items = {
        Wall: Wall,
        Mob: Mob
    };
    loadingMap = true;
    SETTINGS.PAUSED = true;

    world = [];
    timer = Date.now();
    for (let item of map) {
        new items[item.item](item.x, item.y, item.w, item.h);
    }
    letterCurve = 0;
}

var letterCurve = 0;

function renderLevelIntro() {
    letterCurve += 0.2;
    ctx.fillStyle = "rgba(0, 0, 0, .8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    var text = "Level " + (mapIndex + 1).toString();
    var size = 10;
    var spacing = 90;
    var length = text.length * size + (spacing * text.length - 1);
    var start = canvas.width / 2 - length / 2;
    for (var i = 0; i < text.length; i++) {
        var x = start + (i * size + spacing * i);
        var y = canvas.height / 2 - 100;
        y += Math.sin(-letterCurve + i) * 10;
        Alphabet.drawWord(text[i], x, y, size, COLORS.gold, true, false);
    }

    if (letterCurve > 10) finishLoading();
}

function finishLoading() {
    console.log("Done!");
    SETTINGS.PAUSED = false;
    loadingMap = false;
}

function nextLevel() {
    mapIndex++;
    if (mapIndex < mapPool.length) {
        loadMap(mapPool[mapIndex]);
    } else {
        world = [];
        displayMainMenu();
        console.log("Showing main menu");
    }
}
