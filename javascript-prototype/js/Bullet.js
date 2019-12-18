class Bullet extends GameObject {
	/**
	 * Bullet class
	 * @param {Number} x Spawn X
	 * @param {Number} y Spawn Y
	 * @param {Number} direction 0-360 direction of the bullet
	 * @param {Number} speed The speed of the bullet
	 */
	constructor(x, y, direction = 0, speed = 10) {
		super(x, y);
		this.direction = direction;
		this.speed = speed;
		this.letter = alphabet[Math.floor(Math.random() * alphabet.length)];
	}

	draw() {
		Alphabet.drawWord(this.letter, this.x, this.y, 2, COLORS.red, true);
	}
}
