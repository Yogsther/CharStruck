class Player extends GameObject {
	constructor() {
		super(0, 0);
		this.x = 0;
		this.y = 0;

		this.color = COLORS.red;
		this.desired_direction = 0;
		this.type = OBJECT_TYPE.player;
		this.solid = false;
		this.collidable = true;
		this.speed = 0;
		this.last_shot = 0;
		this.rate_of_fire = 80; // ms between each shot
		this.moving = false;
		this.acceleration = 5;
		this.friction = 5;
		this.word = undefined;
		this.word_index = 0;
		this.health = 0;
		this.TEXT_WIDTH = 6;
		this.TEXT_HEIGHT = 8;
		this.DEFAULT_RATE_OF_FIRE = 100;
		this.MAX_SPEED = 10;
		this.aimDirection = 0;

		this.senseRange = 100;

		this.health = this.TEXT_WIDTH * this.TEXT_HEIGHT;
		this.MAX_HEALTH = this.health;
		this.width = this.TEXT_WIDTH * 8 * 1.5;
		this.height = this.TEXT_HEIGHT * 8 * 1.5;
	}

	draw() {
		Alphabet.drawMob(
			this.x,
			this.y,
			"PLAYER",
			this.TEXT_WIDTH,
			this.TEXT_HEIGHT,
			this.health,
			COLORS.red
		);

		super.draw();

		if (SETTINGS.DEBUG) {
			var pos = getRelativeCameraPosition(
				this.x,
				this.y,
				this.width,
				this.height
			);
			this.drawLine(pos.x, pos.y, this.aimDirection, 100, "blue");
		}
	}

	onFire() {
		/* shake(player.aimDirection + 180, 10); */
		STATS.shots_fired++;
	}

	logic() {
		this.aimDirection = getDirection(38, 40, 37, 39);
		if (this.aimDirection !== false) {
			this.fire();
		}

		var moveDirection = getDirection(87, 83, 65, 68);
		if (moveDirection !== false) {
			this.direction = moveDirection;
			this.moving = true;
		} else {
			this.moving = false;
		}

		if (this.moving) {
			this.speed += this.acceleration;
		}

		if (this.speed > this.MAX_SPEED) this.speed = this.MAX_SPEED;

		if (this.speed > 0) {
			this.x += Math.cos(this.direction / (180 / Math.PI)) * this.speed;
			this.y += Math.sin(this.direction / (180 / Math.PI)) * this.speed;
		}

		this.speed -= this.friction;
		if (this.speed < 0) this.speed = 0;

		if (this.health <= 0) {
			this.kill();

			if (difficulty != DIFFICULTIES.HARD) {
				STATS.deaths++;
			} else {
				mapIndex = 0
			}
			runText("YOU DIED", COLORS.red, 20, () => {
				loadMap(mapPool[mapIndex]);
			});
		}

		if (difficulty == DIFFICULTIES.EASY) this.health += 0.1;
		if (this.health > this.MAX_HEALTH) this.health = this.MAX_HEALTH;
	}
}