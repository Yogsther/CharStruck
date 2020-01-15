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
    new Mob(
        player.x + (Math.random() - 0.5) * 500,
        player.y + (Math.random() - 0.5) * 500
    );
});
new KeyBind("[N] Spawn still mob", 78, () => {
    new Mob(
        player.x + (Math.random() - 0.5) * 500,
        player.y + (Math.random() - 0.5) * 500,
        0
    );
});

new KeyBind("[B] Spawn safe mob", 66, () => {
    new Mob(player.x, player.y, 0);
    world[world.length - 1].rate_of_fire = Infinity;
});

new KeyBind("[P] Spawn particles on player", 80, () => {
    spawnParticles(player.x, player.y);
});

new KeyBind("[G] God mode", 71, "GOD_MODE");
