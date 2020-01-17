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

    onCollision() {
        /* this.direction += 45; */
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

        //[{"item":"Wall","x":-1137.7786214855196,"y":-228.16555056164302,"w":1327.8910632703712,"h":57.81677681701288},{"item":"Wall","x":87.64464162325089,"y":-162.85773278384,"w":81.00252234672246,"h":555.0019464047296},{"item":"Wall","x":-393.048514463118,"y":-161.29366994074826,"w":81.69315614841997,"h":282.2200300554034},{"item":"Wall","x":-391.40928857417555,"y":393.98411922600724,"w":560.2920268101757,"h":57.81677681701288},{"item":"Mob","x":-207.19469681250325,"y":238.4117778324486,"w":120,"h":120},{"item":"Mob","x":-1070.7619163888598,"y":252.26058741023792,"w":120,"h":120},{"item":"Wall","x":-816.5468113906215,"y":97.80277222469863,"w":81.69315614841997,"h":600.1157626478507},{"item":"Wall","x":-737.4204465977892,"y":640.0835677884613,"w":341.9999472511287,"h":57.81677681701288},{"item":"Wall","x":-390.8186632499633,"y":454.0215065168193,"w":81.69315614841997,"h":243.50256062658013},{"item":"Wall","x":-1221.0806091410382,"y":-227.36758330938952,"w":80.83000312637836,"h":859.8398800022877},{"item":"Wall","x":-1228.3127649317128,"y":641.2322260008411,"w":409.3653038093056,"h":64.45125339710447}]

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
                this.direction++s;
            } else if (!this.lookingAtPlayer && path.length > 1) {
                this.direction = this.getDirection(path[1]) - 180;
            }
        }
    }

    logic() {
        if (this.health <= 0) this.kill();
        this.step();

        if (this.lookingAtPlayer) {
            this.fire();
        }
    }

    step() {
        this.x += Math.cos(this.direction / (180 / Math.PI)) * this.speed;
        this.y += Math.sin(this.direction / (180 / Math.PI)) * this.speed;
    }
}
