class GameObject {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.width = 0;
		this.height = 0;
		this.solid = false;
		this.collidable = false;
		world.push(this);
	}

	logic() {}
	draw() {}
	onCollision() {}
}
