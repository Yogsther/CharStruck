var keybinds = [];

class KeyBind {
    constructor(name, key, run) {
        this.name = name;
        this.key = key;
        this.run = run;

        keybinds.push(this);
    }
}

new KeyBind("[ESC] Toggle debug mode", 27, "DEBUG");

new KeyBind("[R] Reset", 82, () => {
    reset();
});

new KeyBind("[K] Log key codes", 75, "LOG_KEYS");
new KeyBind("[M] Spawn mob", 77, () => {
    new Mob(realtiveMouse.x, realtiveMouse.y);
});
new KeyBind("[N] Spawn wall", 78, () => {
    new Wall(
        realtiveMouse.x,
        realtiveMouse.y,
        wallSpawnDimensions.w,
        wallSpawnDimensions.h
    );
});

new KeyBind("[B] Spawn safe mob", 66, () => {
    new Mob(player.x, player.y, 0);
    world[world.length - 1].rate_of_fire = Infinity;
});

new KeyBind("[E] Editor", 69, "EDITOR");

new KeyBind("[DEL] Delete last item", 46, () => {
    if (mouseOver) mouseOver.kill();
});

new KeyBind("[G] God mode", 71, "GOD_MODE");

new KeyBind("[L] Log map", 76, () => {
    var exportMap = [];
    for (var item of world) {
        if (item.map_item) {
            exportMap.push({
                item: item.constructor.name,
                x: item.x,
                y: item.y,
                w:
                    item.constructor.name == "Mob"
                        ? item.width / 12
                        : item.width,
                h:
                    item.constructor.name == "Mob"
                        ? item.height / 12
                        : item.height
            });
        }
    }
    console.log(JSON.stringify(exportMap));
});

new KeyBind("[H] Draw hitboxes", 72, "DRAW_HITBOXES");

new KeyBind("[P] Pause logic", 80, "PAUSED");
new KeyBind("[C] Pause collisions", 67, "DISABLE_COLLISIONS");
new KeyBind("[O] Draw pathfinding", 79, "DRAW_PATH_FIDNING");
