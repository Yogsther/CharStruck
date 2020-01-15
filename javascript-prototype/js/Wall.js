class Wall extends GameObject {
    constructor(x, y, width, height, color = COLORS.blue, text = "WALL") {
        super(x, y);
        this.width = width;
        this.height = height;
        this.solid = true;
        this.collidable = true;
        this.color = color;
        this.text = text;
        this.type = OBJECT_TYPE.wall;
    }

    draw() {
        Alphabet.drawBlock(
            this.text,
            this.x + this.width / 2,
            this.y + this.height / 2,
            this.width,
            this.height,
            20,
            this.color,
            true,
            true
        );
        super.draw();
    }
}
