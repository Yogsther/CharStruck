var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

var SCALE = 1;

var player = {
	position: { x: 0, y: 0 },
	direction: 0,
	desired_direction: 0,
	speed: 0,
	moving: false,
	acceleration: 5,
	friction: 5,
	MAX_SPEED: 10
};

var world = [];

var camera = {
	position: { x: 0, y: 0 }
};

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
	camera.direction =
		(Math.atan2(
			player.position.y - camera.position.y,
			player.position.x - camera.position.x
		) *
			180) /
		Math.PI;

	var distance = Math.sqrt(
		Math.pow(player.position.x - camera.position.x, 2) +
			Math.pow(player.position.y - camera.position.y, 2)
	);

	camera.speed = distance / 25;

	camera.position.x +=
		Math.cos(camera.direction / (180 / Math.PI)) * camera.speed;

	camera.position.y +=
		Math.sin(camera.direction / (180 / Math.PI)) * camera.speed;
}

function logic() {
	cameraLogic();

	if (keysDown[32]) {
		world.push(new Bullet(player.position.x, player.position.y));
	}

	if (keysDown[87] || keysDown[83] || keysDown[65] || keysDown[68]) {
		player.moving = true;
	} else {
		player.moving = false;
	}

	var pointers = [];

	if (keysDown[87]) pointers.push(180);
	if (keysDown[83]) pointers.push(0);
	if (keysDown[65]) pointers.push(90);
	if (keysDown[68]) pointers.push(270);

	var pointersTotal = 0;
	for (var pointer of pointers) pointersTotal += pointer;

	// Edge case if the player is pressing (S + D), move to towards bottom right corner
	// Adding 0 + 270 and then deviding them with 2 does not result in the right direction.
	if (keysDown[68] && keysDown[83]) player.direction = 315;
	else player.direction = pointersTotal / pointers.length;

	if (player.moving) {
		player.speed += player.acceleration;
	}

	if (player.speed > player.MAX_SPEED) player.speed = player.MAX_SPEED;

	if (player.speed > 0) {
		player.position.x +=
			Math.cos((player.direction + 90) / (180 / Math.PI)) * player.speed;
		player.position.y +=
			Math.sin((player.direction + 90) / (180 / Math.PI)) * player.speed;
	}

	player.speed -= player.friction;
	if (player.speed < 0) player.speed = 0;

	for (item of world) {
		item.logic();
	}
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
				x - (camera.position.x % tileWidth),
				y - (camera.position.y % tileWidth),
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

	Alphabet.drawBlock(
		"PLAYER",
		player.position.x,
		player.position.y,
		80,
		90,
		12,
		COLORS.red,
		true,
		true
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
		x = x - camera.position.x;
		y = y - camera.position.y;
	}

	if (centered) {
		x += canvas.width / 2 - w / 2;
		y += canvas.height / 2 - h / 2;
	}

	ctx.drawImage(texture, imgx, imgy, imgw, imgh, x, y, w, h);
}
