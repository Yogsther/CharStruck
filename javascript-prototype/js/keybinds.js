var keybinds = {
    27: () => {
        // ESC, TOGGLE DEBUG MODE
        DEBUG = !DEBUG;
    },
    75: () => {
        // K, TOGGLE KEYS IN CONSOLE
        LOG_KEYS = !LOG_KEYS;
    },
    77: () => {
        // M, SPAWN MOB
        new Mob(
            player.x + (Math.random() - 0.5) * 500,
            player.y + (Math.random() - 0.5) * 500
        );
    }
};
