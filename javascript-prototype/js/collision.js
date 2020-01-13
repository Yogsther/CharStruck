function checkCollision(a, b) {
    var report = areColliding(a, b);

    if (report) {
        if (a.onCollision) {
            a.onCollision(b);
        }

        if (b.solid) {
            var kickback = 5;
            if (report.fromLeft) a.x -= kickback;
            if (report.fromRight) a.x += kickback;
            if (report.fromTop) a.y -= kickback;
            if (report.fromBottom) a.y += kickback;
        }

        if (a.type == OBJECT_TYPE.bullet && a.origin != b) {
            if (b.type == OBJECT_TYPE.player || b.type == OBJECT_TYPE.mob) {
                b.health -= a.damage;
            }

            if (b.type == OBJECT_TYPE.bullet) {
                b.kill();
            }

            a.kill();
        }
    }
}

function areColliding(a, b) {
    if (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.height + a.y > b.y
    ) {
        /* Collision has happened, calculate further */

        info = {
            fromLeft: false,
            fromRight: false,
            fromTop: false,
            fromBottom: false
        };

        values = new Array();

        /* From left value */
        values[0] = a.x + a.width - b.x; /* * a.width; / Possible addition */
        /* From right value */
        values[1] = b.x + b.width - a.x;
        /* From top values */
        values[2] = a.y + a.height - b.y;
        /* From bottom value */
        values[3] = b.height + b.y - a.y;

        /**
         * Get the shortest distance from values, the shortest one will be the direction of overlap.
         */
        short = 0;
        for (let i = 0; i < values.length; i++) {
            if (values[i] < values[short]) short = i;
        }

        return {
            fromLeft: short == 0,
            fromRight: short == 1,
            fromTop: short == 2,
            fromBottom: short == 3
        };
    }

    return false;
}
