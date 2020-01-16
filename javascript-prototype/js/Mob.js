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
        this.direction += 45;
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
        var playerAngle = this.getDirection(player) + 180;

        var scans = 10;
        class Angle {
            constructor(angle, distance, target) {
                this.angle = angle;
                this.distance = distance;
                this.target = target;
            }
        }

        var angles = [];

        for (let i = 0; i < scans; i++) {
            let angle = playerAngle + i * (360 / scans);

            let lookingAt = this.lookAt(angle);

            if (lookingAt.target) {
                angles.push(
                    new Angle(angle, lookingAt.distance, lookingAt.target)
                );
            } else {
                angles.push(new Angle(angle, Infinity, false));
            }
        }

        var bestAngle = {
            angle: false,
            distanceToPlayer: false
        };

        for (var angle of angles) {
            if (angle.target) {
                if (angle.target.type == OBJECT_TYPE.player) {
                    bestAngle.angle = angle.angle;
                    this.lookingAtPlayer = true;
                    this.last_saw_player = { x: player.x, y: player.y };
                    break;
                }

                if (
                    angle.target.type == OBJECT_TYPE.wall &&
                    angle.distance < 200
                ) {
                    continue;
                }
            }

            var distance = angle.distance < 100 ? angle.distance : 100;
            //console.log({ angle });
            var futurePosition = {
                x: Math.cos(angle.angle / (180 / Math.PI)) * distance,
                y: Math.sin(angle.angle / (180 / Math.PI)) * distance
            };

            var distanceToPlayer = Math.sqrt(
                Math.pow(futurePosition.x - player.x, 2) +
                    Math.pow(futurePosition.y - player.y, 2)
            );

            //console.log(futurePosition);
            if (
                bestAngle.distanceToPlayer === false ||
                bestAngle.distanceToPlayer > distanceToPlayer
            ) {
                bestAngle.distanceToPlayer = distanceToPlayer;
                bestAngle.angle = angle.angle;
            }
        }

        if (bestAngle.angle) {
            this.direction = bestAngle.angle;
        } else {
            this.angle = Math.random() * 360;
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
