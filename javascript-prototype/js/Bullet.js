class Bullet extends GameObject {
	/**
	 * Bullet class
	 * @param {Number} x Spawn X
	 * @param {Number} y Spawn Y
	 * @param {Number} direction 0-360 direction of the bullet
	 * @param {Number} speed The speed of the bullet
	 */
	constructor(
		x,
		y,
		direction = 0,
		letter = "A",
		speed = 10,
		color = COLORS.red,
		origin = false
	) {
		super(x, y);
		this.type = OBJECT_TYPE.bullet;
		this.direction = direction;
		this.speed = speed;
		this.letter = letter;
		this.width = 2;
		this.height = 2;
		this.collidable = true;

		this.damage = 5;

		this.color = color;
		this.origin = origin;
		this.age = 0;
	}

	logic() {
		this.age++;
		if (this.age > 150) {
			this.kill();
			return;
		}

		this.x +=
			Math.cos((this.direction + 90) / (180 / Math.PI)) * this.speed;
		this.y +=
			Math.sin((this.direction + 90) / (180 / Math.PI)) * this.speed;
	}

	draw() {
		Alphabet.drawWord(
			this.letter,
			this.x,
			this.y,
			this.width,
			this.color,
			true
		);
	}
}
