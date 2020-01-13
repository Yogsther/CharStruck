class Mob extends GameObject {
    constructor(
        x,
        y,
        speed = 1,
        width = 10,
        height = 10,
        color = COLORS.green
    ) {
        super(x, y);
        this.speed = speed;
        this.color = color;
        this.last_shot = 0;
        this.rate_of_fire = 500; // ms between each shot

        this.direction = 0;
        this.senseRange = 1000;

        this.collidable = true;

        this.type = OBJECT_TYPE.mob;
        this.text_width = width;
        this.text_height = height;
        this.width = width * 8 * 1.5;
        this.height = height * 8 * 1.5;

        this.health = this.text_width * this.text_height;
        this.maxHealth = this.health;

        this.string = "";
        while (this.string.length < this.maxHealth)
            this.string += WORDS[Math.floor(Math.random() * WORDS.length)];
    }

    draw() {
        Alphabet.drawMob(
            this.x,
            this.y,
            this.string,
            this.text_width,
            this.text_height,
            this.health,
            this.color
        );

        super.draw();

        var lookingAt = this.lookAt(this.direction);
        if (lookingAt.target) {
            var pos = getRelativeCameraPosition(
                lookingAt.target.x,
                lookingAt.target.y,
                lookingAt.target.width,
                lookingAt.target.height
            );

            ctx.strokeStyle = "red";
            ctx.fillStyle = "red";
            ctx.rect(
                pos.x - lookingAt.target.width / 2,
                pos.y - lookingAt.target.height / 2,
                lookingAt.target.width,
                lookingAt.target.height
            );
            ctx.stroke();
        }
    }

    logic() {
        if (this.health <= 0) this.kill();
        this.step();
        this.direction = this.getDirection(player) + 180;

        this.fire();
    }

    step() {
        this.x += Math.cos(this.direction / (180 / Math.PI)) * this.speed;
        this.y += Math.sin(this.direction / (180 / Math.PI)) * this.speed;
    }
}
