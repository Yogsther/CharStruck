function displayMainMenu() {
	showingMenu = true;
	/* SETTINGS.PAUSED = true; */
	player.kill();
}

var textWidth = 5;
var lanes = {};

class PassiveText extends GameObject {
	constructor(x, y, char, color) {
		super(x, y);
		this.letter = char;
		this.opacity = 1;
		this.color = color;
		this.width = textWidth * 6;
		this.height = this.width;
		this.type = OBJECT_TYPE.ui;
	}

	logic() {
		this.opacity -= 0.01;
		if (this.opacity < 0) this.kill();
	}

	draw() {
		super.draw();
		ctx.globalAlpha = this.opacity;
		Alphabet.drawWord(
			this.letter,
			this.x,
			this.y,
			textWidth,
			this.color,
			false,
			false
		);
		ctx.globalAlpha = 1;
	}
}

class TextLeader extends GameObject {
	constructor(x) {
		super(x, 0);
		this.width = textWidth * 6;
		this.height = textWidth * 6;
		this.color = save.completed.HARD ? COLORS.gold : COLORS.dark;
		this.lastStop = -100;
		this.speed = 5;
		this.clearedLane = false;
		this.type = OBJECT_TYPE.ui;
		this.newWord();
	}

	newWord() {
		this.wordIndex = 0;
		this.word = WORDS[Math.floor(Math.random() * WORDS.length)];
	}

	logic() {
		this.y += this.speed;
		if (this.y > canvas.height + 100) {
			this.kill();
			return;
		}

		if (!this.clearedLane && this.y >= 400) {
			lanes[this.x] = false;
			this.clearedLane = true;
		}

		if (this.y - this.lastStop > this.width) {
			this.wordIndex++;
			if (this.wordIndex >= this.word.length) this.newWord();

			this.lastStop = this.y;
			new PassiveText(
				this.x,
				this.y - this.width,
				this.word[this.wordIndex],
				this.color
			);
		}
	}

	draw() {
		super.draw();
		Alphabet.drawWord(
			this.word[this.wordIndex],
			this.x,
			this.y,
			textWidth,
			this.color,
			false,
			false
		);
	}
}

function getDifficulty() {
	for (var key in DIFFICULTIES) {
		if (DIFFICULTIES[key] == difficulty) return key
	}
}

var colorIndex = 0;
var colorProgress = 0;

var showText = true;
var colorOrder = [COLORS.red, COLORS.blue, COLORS.gold, COLORS.green];
var menus = {
	post: {
		render: () => {
			letterCurve += 0.2;

			renderWave('Levels complete', 5, 100, difficulty == DIFFICULTIES.HARD ? [COLORS.gold] : [COLORS.red, COLORS.blue, COLORS.green])
			if (difficulty == DIFFICULTIES.HARD) renderWave('HARD', 4, 150, [COLORS.gold, COLORS.grey])
			else renderWave(getDifficulty(), 4, 150, difficulty == DIFFICULTIES.FAIR ? [COLORS.red, COLORS.blue, COLORS.green] : [COLORS.grey])

			function renderWave(text, size, yStart, colorOrder) {
				var spacing = 35;
				var length = text.length * size + (spacing * text.length - 1);
				var start = canvas.width / 2 - length / 2;
				colorProgress += 0.5;

				if (colorProgress >= text.length) {
					colorIndex++;
					colorProgress = 0;
				}
				for (var i = 0; i < text.length; i++) {
					var color =
						colorOrder[
							(colorProgress < i ? colorIndex : colorIndex + 1) %
							colorOrder.length
						];

					var x = start + (i * size + spacing * i);
					var y = yStart;
					y += Math.sin(-letterCurve + i) * 6;
					Alphabet.drawWord(text[i], x, y, size, color, false, false);
				}
			}

			var texts = {
				time: STATS.time,
				deaths: STATS.deaths,
				"damage done": STATS.damage_done,
				"damage taken": STATS.damage_taken,
				"shots fired": STATS.shots_fired
			};

			for (var i = 0; i < Object.keys(texts).length; i++) {
				Alphabet.drawUITextCentered(
					Object.keys(texts)[i] + ": " + texts[Object.keys(texts)[i]],
					canvas.width / 2,
					200 + i * 40,
					3,
					COLORS.white
				);
			}

			Alphabet.drawWord(
				"PRESS SPACE TO PLAY AGAIN",
				20,
				canvas.height - 40,
				2,
				COLORS.white,
				false,
				false
			);


		}
	},
	main: {
		render: () => {
			var fontsize = 5;
			if (frames % 45 == 0) showText = !showText;
			if (showText)
				Alphabet.drawUITextCentered(
					"PRESS SPACE",
					canvas.width / 2,
					canvas.height / 2 - 100,
					fontsize,
					COLORS.white
				);

			for (var i = 0; i < Object.keys(DIFFICULTIES).length; i++) {
				var diff = Object.keys(DIFFICULTIES)[i]

				if (difficulty == DIFFICULTIES[diff]) {
					var change = Math.sin(frames * .3) * 5;
					var xDistance = 90;
					Alphabet.drawWord('>', canvas.width / 2 - xDistance + change - 3 * 5, canvas.height / 2 + (i * 35) + 30, 3, COLORS.red, false, false)
					Alphabet.drawWord('<', canvas.width / 2 + xDistance - change - 3 * 5, canvas.height / 2 + (i * 35) + 30, 3, COLORS.red, false, false)
				}
				Alphabet.drawUITextCentered(diff, canvas.width / 2, canvas.height / 2 + (i * 35) + 30, 3, difficulty == DIFFICULTIES[diff] ? COLORS.red : COLORS.white)
			}


		}
	}
};

var showingMenu;
var menu = menus.main; // TODO

function renderMenu() {
	if (Math.random() > 0.9) {
		var lane =
			Math.floor((canvas.width / (textWidth * 7)) * Math.random()) *
			textWidth *
			7;
		if (!lanes[lane]) {
			new TextLeader(lane);
			lanes[lane] = true;
		}
	}

	menu.render();
}