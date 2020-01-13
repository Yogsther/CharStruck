class Wall extends GameObject {
    constructor(x, y, width, height, color = COLORS.blue, text = "WALL") {
        super(x, y);
        this.width = width;
        this.height = height;
        this.solid = true;
        this.collidable = true;
    }

    draw() {
        super.draw();
    }
}
