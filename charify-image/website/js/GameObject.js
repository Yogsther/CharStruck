
class GameObject {
     
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
                    // PATH FOUND!
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

        return path;
    }
}
