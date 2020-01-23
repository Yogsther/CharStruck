class Key extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 50;
        this.height = 50;
        this.collidable = true;
        this.color = COLORS.gold;
    }

    randomString() {
        var str = "";
        for (var i = 0; i < 3; i++) {
            str += alphabet[Math.floor(Math.random() * alphabet.length)];
        }
        return str;
    }

    onCollision(other) {
        if (other == player) {
            nextLevel();
        }
    }

    draw() {
        Alphabet.drawBlock(
            this.randomString(),
            this.x + this.width / 2,
            this.y + this.height / 2,
            this.width,
            this.height,
            15,
            this.color,
            true,
            true
        );
    }
}
