class Mob extends GameObject {
    constructor(
        x,
        y,

        width = 10,
        height = 10,
        speed = 1,
        color = COLORS.green
    ) {
        super(x, y);
        this.ORIGINAL_SPEED = speed;
        this.speed = speed;
        this.color = color;
        this.last_shot = 0;
        this.rate_of_fire = 500; // ms between each shot

        this.direction = 0;
        this.senseRange = 1000;

        this.map_item = true;

        this.collidable = true;
        this.last_saw_player = undefined;
        this.turns_left = Math.random() > 0.5;

        this.lookingAtPlayer = false;
        this.turning_speed = 10;

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

    onCollision(other) {
        if (other.type == OBJECT_TYPE.wall) {
            this.direction += 180;
        }
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

        this.lookingAtPlayer = false;

        var playerAngle = this.getDirection(player) - 180;
        var lookingAt = this.lookAt(playerAngle);
        if (lookingAt.target) {
            if (lookingAt.target.type == OBJECT_TYPE.player) {
                this.lookingAtPlayer = true;
                this.direction = playerAngle;
                this.last_saw_player = { x: player.x, y: player.y };
            }
        }
        if (this.last_saw_player) {
            var path = this.getPath({
                x: this.last_saw_player.x,
                y: this.last_saw_player.y,
                width: player.width,
                height: player.height
            });

            if (!path) {
                this.last_saw_player = false;
                console.log("Lost");
                this.direction++;
            } else if (!this.lookingAtPlayer && path.length > 1) {
                this.direction = this.getDirection(path[1]) - 180;
            }
        }
    }

    logic() {
        if (this.health <= 0) {
            this.kill();

            for (var item of world) {
                if (item.type == OBJECT_TYPE.mob) {
                    return;
                }
            }

            new Key(this.x, this.y);
            return;
        }
        this.step();

        if (this.lookingAtPlayer) {
            this.fire();
        } else {
            if (Math.random() > 0.95) {
                this.direction += 45 * Math.random() > 0.5 ? 1 : -1;
            }
        }
    }

    step() {
        this.x += Math.cos(this.direction / (180 / Math.PI)) * this.speed;
        this.y += Math.sin(this.direction / (180 / Math.PI)) * this.speed;
    }
}
