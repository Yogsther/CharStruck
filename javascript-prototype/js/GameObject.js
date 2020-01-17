const OBJECT_TYPE = {
    object: 0,
    player: 1,
    bullet: 2,
    mob: 3,
    wall: 4
};

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
        this.map_item = false;

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

    getPath(target) {
        target.x += target.width / 2;
        target.y += target.height / 2;
        target.width = 2;
        target.height = 2;

        if (areColliding(target, this)) {
            return false;
        }

        class Node {
            constructor(x, y, size, origin, direction, first = false) {
                this.x = Math.round(x);
                this.y = Math.round(y);

                this.id = this.x + ":" + this.y;
                this.width = size;
                this.height = size;

                this.partOfPath = false;
                this.first = first;

                this.g = getDistance(this, origin);
                this.h = getDistance(this, target);
                this.f = this.g + this.h;
                this.triggered = false;

                this.direction = direction;
                this.contact = false;

                this.walkable = true;

                if (areColliding(this, target)) {
                    this.contact = true;
                    pathFound = true;
                    var pathDone = false;
                    var node = this;
                    var breaker = 0;
                    while (!pathDone && breaker < 100) {
                        breaker++;
                        node.partOfPath = true;
                        path.unshift(node);
                        if (node.first) pathDone = true;
                        else {
                            node =
                                nodes[
                                    `${node.x +
                                        -node.direction.x *
                                            NODE_SIZE}:${node.y +
                                        -node.direction.y * NODE_SIZE}`
                                ];
                        }
                    }
                } else {
                    for (var item of world) {
                        if (item.solid && areColliding(this, item)) {
                            this.walkable = false;
                            break;
                        }
                    }
                }
            }
        }

        function getSurroundingNodes(x, y) {
            return [
                { x: 1, y: 0 },
                { x: -1, y: 0 },
                { x: 0, y: 1 },
                { x: 0, y: -1 }
            ];
        }

        function summonSurroundingNodes(originX, originY, origin, first) {
            if (first) {
                summon(0, 0, true);
            }
            for (var dir of getSurroundingNodes(originX, originY)) {
                summon(dir.x, dir.y);
            }

            function summon(x, y, first) {
                addNode(
                    new Node(
                        originX + NODE_SIZE * x,
                        originY + NODE_SIZE * y,
                        NODE_SIZE,
                        origin,
                        { x, y },
                        first
                    )
                );
            }
        }

        function addNode(node) {
            if (!nodes[node.id]) nodes[node.id] = node;
        }

        var nodes = {};
        const MAX_NODES = 30;
        const NODE_SIZE = this.width > this.height ? this.width : this.height;
        var pathFound = false;
        var path = [];

        summonSurroundingNodes(this.x, this.y, this, true);

        while (Object.keys(nodes).length < MAX_NODES && !pathFound) {
            let next;
            for (let key in nodes) {
                let node = nodes[key];
                if (
                    !node.triggered &&
                    node.walkable &&
                    (!next || node.f < next.f)
                ) {
                    next = node;
                }
            }

            if (!next) {
                break;
            } else {
                next.triggered = true;
                summonSurroundingNodes(next.x, next.y, this);
            }
        }

        if (SETTINGS.DRAW_PATHS && SETTINGS.DEBUG) {
            ctx.beginPath();
            ctx.strokeStyle = "gold";
            ctx.strokeWidth = 5;
            for (var node of path) {
                var rel = getRelativeCameraPosition(node.x, node.y);
                ctx.lineTo(rel.x + NODE_SIZE / 2, rel.y + NODE_SIZE / 2);
            }
            //ctx.moveTo(rel.x + NODE_SIZE / 2, rel.y + NODE_SIZE / 2);

            ctx.stroke();
        }

        if (SETTINGS.DRAW_PATH_FIDNING && SETTINGS.DEBUG) {
            for (let key in nodes) {
                let node = nodes[key];
                ctx.fillStyle = node.walkable
                    ? "rgba(0, 255, 0, .5)"
                    : "rgba(255, 0, 0, .5)";
                if (node.partOfPath) ctx.fillStyle = "rgba(255, 255, 255, .7)";
                if (node.first) ctx.fillStyle = "rgba(0, 0, 255, .5)";
                if (node.contact) ctx.fillStyle = "rgba(0, 0, 255, .5)";
                var rel = getRelativeCameraPosition(
                    node.x - NODE_SIZE / 2,
                    node.y - NODE_SIZE / 2,
                    NODE_SIZE,
                    NODE_SIZE,
                    true,
                    true
                );
                ctx.fillRect(rel.x, rel.y, NODE_SIZE, NODE_SIZE);
                ctx.fillStyle = "white";
                ctx.font = "15px Arial";
                ctx.fillText(
                    `G:${node.g.toFixed(0)}, H:${node.h.toFixed(0)}, `,
                    rel.x + 10,
                    rel.y + 20
                );

                ctx.fillText(`F:${node.f.toFixed(0)} `, rel.x + 10, rel.y + 40);
                ctx.fillText(
                    `ID:${node.id} `,
                    rel.x + 10,
                    rel.y + NODE_SIZE - 30
                );
                ctx.fillText(
                    `DIR: X: ${node.direction.x} Y: ${node.direction.y}  `,
                    rel.x + 10,
                    rel.y + NODE_SIZE - 10
                );

                ctx.beginPath();

                ctx.strokeStyle = "blue";
                ctx.strokeWidth = 5;
                ctx.moveTo(rel.x + NODE_SIZE / 2, rel.y + NODE_SIZE / 2);
                ctx.lineTo(
                    rel.x + NODE_SIZE / 2 + (node.direction.x * NODE_SIZE) / 2,
                    rel.y + NODE_SIZE / 2 + (node.direction.y * NODE_SIZE) / 2
                );
                ctx.stroke();
            }
        }

        return path;
    }

    lookAt(direction) {
        var start = { x: this.x + this.width / 2, y: this.y + this.height / 2 };
        var end = {
            x: start.x + Math.cos(direction / (180 / Math.PI)) * 1000,
            y: start.y + Math.sin(direction / (180 / Math.PI)) * 1000
        };

        var found;
        var found_distance;

        for (let obj of world) {
            if (
                obj != this &&
                obj.collidable &&
                obj != this &&
                obj.origin != this
            ) {
                var closestPoint = lineRect(
                    start.x,
                    start.y,
                    end.x,
                    end.y,
                    obj.x,
                    obj.y,
                    obj.width,
                    obj.height
                );
                if (closestPoint !== false) {
                    var d = distance(this, {
                        x: closestPoint.x,
                        y: closestPoint.y
                    });

                    if (!found || d < found_distance) {
                        found = obj;
                        found_distance = d;
                    }
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

            var closest = false;
            var point = false;
            for (var outcome of [left, right, top, bottom]) {
                if (outcome) {
                    var d = distance({ x: x1, y: y1 }, outcome);
                    if (closest === false || d < closest) {
                        closest = d;
                        point = outcome;
                    }
                }
            }

            return point;
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
                return { x: x1 + uA * (x2 - x1), y: y1 + uA * (y2 - y1) };
            }
            return false;
        }

        function distance(obj1, obj2) {
            return Math.sqrt(
                Math.pow(obj2.x - obj1.x, 2) + Math.pow(obj2.y - obj1.y, 2)
            );
        }
    }

    move() {
        (this.x += Math.cos(this.direction / (180 / Math.PI)) * this.speed),
            (this.y += Math.sin(this.direction / (180 / Math.PI)) * this.speed);
    }

    onFire() {}

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
            this.onFire();
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
        if (SETTINGS.DEBUG && SETTINGS.DRAW_HITBOXES) {
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
