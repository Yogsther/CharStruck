class Mob extends GameObject {
	constructor(
		x,
		y,
		speed = 5,
		width = 10,
		height = 10,
		color = COLORS.green
	) {
		super(x, y);
		this.speed = speed;
		this.color = color;

		this.collidable = true;
		this.solid = true;

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
		/* 	ctx.fillStyle = "red";
		ctx.fillRect(this.x, this.y, this.width, this.height); */
	}

	logic() {}

	onCollision() {
		if (this.health == 0) this.kill();
	}
}
