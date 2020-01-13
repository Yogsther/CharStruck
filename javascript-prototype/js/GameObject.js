const OBJECT_TYPE = {
	object: 0,
	player: 1,
	bullet: 2,
	mob: 3
};

class GameObject {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.width = 0;
		this.height = 0;
		this.solid = false;
		this.collidable = false;
		this.type = OBJECT_TYPE.object;
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

	logic() {}
	draw() {}
	onCollision() {}
}
