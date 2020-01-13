const OBJECT_TYPE = {
    object: 0,
    player: 1,
    bullet: 2,
    mob: 3
};

function isEven(num) {
    var fun = "true";
    for (var i = 0; i < num; i++) fun = "!" + fun;
    return eval(fun);
} //s

class GameObject {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 0;
        this.height = 0;
        this.color = COLORS.purple;
        this.solid = false;
        this.collidable = false;
        this.type = OBJECT_TYPE.object;
        this.direction = 0;
        this.word_index = 0;
        this.word = undefined;
        this.last_shot = 0;
        this.rate_of_fire = 0;

        this.speed = 0;
        world.push(this);
    }

    kill() {
        for (var i = 0; i < world.length; i++) {
            if (world[i] == this) {
                world.splice(i, 1);
                return;
            }
        }
    }

    getDirection(target) {
        return (
            (Math.atan2(
                this.y + this.height / 2 - (target.y + target.height / 2),
                this.x + this.width / 2 - (target.x + target.width / 2)
            ) *
                180) /
            Math.PI
        );
    }

    lookAt(direction) {
        var start = { x: this.x + this.width / 2, y: this.y + this.height / 2 };
        var end = {
            x: start.x + Math.cos(direction / (180 / Math.PI)) * 5000,
            y: start.y + Math.sin(direction / (180 / Math.PI)) * 5000
        };

        var found;
        var found_distance;

        for (let obj of world) {
            var d = distance(this, obj);
            if (obj != this && obj.collidable) {
                if (
                    lineRect(
                        start.x,
                        start.y,
                        end.x,
                        end.y,
                        obj.x,
                        obj.y,
                        obj.width,
                        obj.height
                    )
                )
                    if (!found || d < found_distance) {
                        found = obj;
                        found_distance = d;
                    }
            }
        }

        return {
            target: found,
            distance: found_distance
        };

        function lineRect(x1, y1, x2, y2, rx, ry, rw, rh) {
            var left = lineLine(x1, y1, x2, y2, rx, ry, rx, ry + rh);
            var right = lineLine(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh);
            var top = lineLine(x1, y1, x2, y2, rx, ry, rx + rw, ry);
            var bottom = lineLine(
                x1,
                y1,
                x2,
                y2,
                rx,
                ry + rh,
                rx + rw,
                ry + rh
            );

            if (left || right || top || bottom) {
                return true;
            }
            return false;
        }

        function lineLine(x1, y1, x2, y2, x3, y3, x4, y4) {
            // calculate the direction of the lines
            var uA =
                ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) /
                ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
            var uB =
                ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) /
                ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

            // if uA and uB are between 0-1, lines are colliding
            if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
                var intersection = getRelativeCameraPosition(
                    x1 + uA * (x2 - x1),
                    y1 + uA * (y2 - y1),
                    10,
                    10
                );
                ctx.fillStyle = "red";
                ctx.fillRect(intersection.x, intersection.y, 10, 10);
                return true;
            }
            return false;
        }

        function distance(obj1, obj2) {
            return Math.sqrt(
                Math.pow(obj1.x - obj2.x, 2) - Math.pow(obj1.y - obj2.y, 2)
            );
        }
    }

    fire(accuracy = 0) {
        if (Date.now() - this.last_shot > this.rate_of_fire) {
            if (!this.word || this.word_index > this.word.length) {
                this.word = getRandomWord();
                this.word_index = 0;
            }
            this.last_shot = Date.now();
            world.push(
                new Bullet(
                    this.x + this.width / 2 - 10,
                    this.y + this.height / 2 - 10,
                    this.aimDirection !== undefined
                        ? this.aimDirection
                        : this.direction,
                    this.word[this.word_index],
                    10,
                    this.color,
                    this
                )
            );
            this.word_index++;
        }
    }

    logic() {}

    drawLine(x, y, direction, length = 100, color = "white") {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(
            x + Math.cos(direction / (180 / Math.PI)) * length,
            y + Math.sin(direction / (180 / Math.PI)) * length
        );
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = color;
    }

    draw() {
        if (DEBUG) {
            var pos = getRelativeCameraPosition(
                this.x,
                this.y,
                this.width,
                this.height
            );

            this.drawLine(
                pos.x,
                pos.y,
                this.direction,
                this.senseRange,
                "white"
            );

            ctx.rect(
                pos.x - this.width / 2,
                pos.y - this.height / 2,
                this.width,
                this.height
            );
            ctx.stroke();

            ctx.fillStyle = "white";
            ctx.font = "15px Arial";
            ctx.fillText(
                this.constructor.name,
                pos.x - this.width / 2,
                pos.y - this.height / 2 - 7
            );
        }
    }

    onCollision(obj) {}
}
