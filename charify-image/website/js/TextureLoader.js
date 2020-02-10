var textures = [
    "green.png",
    "red.png",
    "blue.png",
    "purple.png",
    "dark.png",
    "grey.png",
    "gold.png",
    "white.png"
];

for (var texture of textures) {
    var src = texture;
    var name = texture.substr(0, texture.indexOf("."));
    texture = new Image();
    texture.src = "img/" + src;
    textures[name] = texture;
}

const COLORS = {
    dark: textures.dark,
    red: textures.red,
    blue: textures.blue,
    green: textures.green,
    purple: textures.purple,
    grey: textures.grey,
    gold: textures.gold,
    white: textures.white
};

const COLOR_CODES = {
    red: "#f91646",
    blue: "#5644f3",
    gold: "#efcb0d",
    green: "#47e057",
    purple: "#d62ff6",
    dark: "#222034",
    grey: "#575757",
    white: "#fff"
};
