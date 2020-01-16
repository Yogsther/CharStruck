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
    var map = JSON.parse(JSON.stringify(world));
    for (var i = 0; i < map.length; i++)
        if (map[i].type == OBJECT_TYPE.player) map.splice(i, 1);
    console.log(JSON.stringify(map));
});

new KeyBind("[H] Draw hitboxes", 72, "DRAW_HITBOXES");

new KeyBind("[P] Pause logic", 80, "PAUSED");
new KeyBind("[C] Pause collisions", 67, "DISABLE_COLLISIONS");
