var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

var SCALE = 1;

var player = {
	x: 0,
	y: 0,
	direction: 0,
	desired_direction: 0,
	type: OBJECT_TYPE.player,
	solid: true,
	collidable: true,
	speed: 0,
	last_shot: 0,
	rate_of_fire: 50, // ms between each shot,
	moving: false,
	acceleration: 5,
	friction: 5,
	word: undefined,
	word_index: 0,
	health: 0,
	TEXT_WIDTH: 6,
	TEXT_HEIGHT: 8,
	DEFAULT_RATE_OF_FIRE: 100,
	MAX_SPEED: 10
};

player.health = player.TEXT_WIDTH * player.TEXT_HEIGHT;
player.MAX_HEALTH = player.health;
player.width = player.TEXT_WIDTH * 8;
player.height = player.TEXT_HEIGHT * 8;

var world = [];

var camera = { x: 0, y: 0 };

window.onload = () => {
	resizeCanvas();
	loop();
};

window.onresize = resizeCanvas;

function resizeCanvas() {
	canvas.width = document.body.offsetWidth;
	canvas.height = document.body.offsetHeight;
	ctx.imageSmoothingEnabled = false;
}

document.body.appendChild(canvas);

function loop() {
	logic();
	render();
	requestAnimationFrame(loop);
}

var keysDown = [];
document.body.addEventListener("keydown", e => {
	keysDown[e.keyCode] = true;
	console.log(e.keyCode);
});

document.body.addEventListener("keyup", e => {
	keysDown[e.keyCode] = false;
});

function cameraLogic() {
	var cameraSight = {
		x: player.x - camera.x + player.width / 2,
		y: player.y - camera.y + player.height / 2
	};
	camera.direction =
		(Math.atan2(cameraSight.y, cameraSight.x) * 180) / Math.PI;

	var distance = Math.sqrt(
		Math.pow(cameraSight.x, 2) + Math.pow(cameraSight.y, 2)
	);

	camera.speed = distance / 25;

	camera.x += Math.cos(camera.direction / (180 / Math.PI)) * camera.speed;

	camera.y += Math.sin(camera.direction / (180 / Math.PI)) * camera.speed;
}

function getDirection(up, down, left, right) {
	var direction = 0;
	var pointers = [];

	if (keysDown[up]) pointers.push(180);
	if (keysDown[down]) pointers.push(0);
	if (keysDown[left]) pointers.push(90);
	if (keysDown[right]) pointers.push(270);

	if (pointers.length == 0) return false;

	var pointersTotal = 0;
	for (var pointer of pointers) pointersTotal += pointer;

	// Edge case if the player is pressing (S + D), move to towards bottom right corner
	// Adding 0 + 270 and then deviding them with 2 does not result in the right direction.
	if (keysDown[right] && keysDown[down]) direction = 315;
	else direction = pointersTotal / pointers.length;
	return direction;
}

function getRandomWord() {
	return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function logic() {
	cameraLogic();

	i;

	var aimDirection = getDirection(38, 40, 37, 39);
	if (
		aimDirection !== false &&
		Date.now() - player.last_shot > player.rate_of_fire
	) {
		if (player.word_index <= -1 || !player.word) {
			player.word = getRandomWord();
			player.word_index = player.word.length - 1;
		}
		player.last_shot = Date.now();
		world.push(
			new Bullet(
				player.x + player.width / 2 + 8,
				player.y + player.height / 2 + 8,
				aimDirection,
				player.word[player.word_index],
				10,
				COLORS.red,
				player
			)
		);
		player.word_index--;
	}

	if (keysDown[87] || keysDown[83] || keysDown[65] || keysDown[68]) {
		player.moving = true;
	} else {
		player.moving = false;
	}

	player.direction = getDirection(87, 83, 65, 68);

	if (player.moving) {
		player.speed += player.acceleration;
	}

	if (player.speed > player.MAX_SPEED) player.speed = player.MAX_SPEED;

	if (player.speed > 0) {
		player.x +=
			Math.cos((player.direction + 90) / (180 / Math.PI)) * player.speed;
		player.y +=
			Math.sin((player.direction + 90) / (180 / Math.PI)) * player.speed;
	}

	player.speed -= player.friction;
	if (player.speed < 0) player.speed = 0;

	for (item of world) {
		item.logic();
	}

	for (var a of world) {
		if (a.collidable) {
			for (let b of world) {
				if (b.collidable && b != a) checkCollision(a, b);
			}
		}
	}

	for (var obj of world) {
		if (obj.collidable) {
			checkCollision(player, obj);
		}
	}

	if (player.health <= 0) console.log("Game over...");
	player.health += 0.1;
	if (player.health > player.MAX_HEALTH) player.health = player.MAX_HEALTH;
}

function checkCollision(a, b) {
	var report = areColliding(a, b);

	if (report) {
		if (a.onCollision) a.onCollision(b);
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

function render() {
	var size = 5;
	var tileWidth = "GROUND".length * SCALE * 8 * size;
	var tileHeight = SCALE * 8 * size;
	var padding = tileWidth * SCALE * 2;

	for (var x = -padding; x < canvas.width + padding; x += tileWidth) {
		for (var y = -padding; y < canvas.height + padding; y += tileHeight) {
			Alphabet.drawWord(
				"GROUND",
				x - (camera.x % tileWidth),
				y - (camera.y % tileWidth),
				size * SCALE,
				COLORS.dark,
				false,
				false
			);
		}
	}

	for (item of world) {
		item.draw();
	}

	Alphabet.drawMob(
		player.x,
		player.y,
		"PLAYER",
		player.TEXT_WIDTH,
		player.TEXT_HEIGHT,
		player.health,
		COLORS.red
	);
}

function draw(
	texture,
	imgx,
	imgy,
	imgw,
	imgh,
	x,
	y,
	w,
	h,
	boundByCamera = true,
	centered = true
) {
	if (boundByCamera) {
		x = x - camera.x;
		y = y - camera.y;
	}

	if (centered) {
		x += canvas.width / 2 - w / 2;
		y += canvas.height / 2 - h / 2;
	}

	ctx.drawImage(texture, imgx, imgy, imgw, imgh, x, y, w, h);
}
