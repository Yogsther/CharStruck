var wallSpawnDimensions = { w: 50, h: 50 };
var mouseOver = false;

function editorLoop() {
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
    mouse.down = true;
});

canvas.addEventListener("mouseup", e => {
    mouse.down = false;
});

var mouse = {
    x: 0,
    y: 0,
    down: false,
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
