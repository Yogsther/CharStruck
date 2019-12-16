var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ";

class Alphabet {
	static drawBlock(
		text,
		x,
		y,
		width,
		height,
		size = 12,
		color = COLORS.red,
		boundByCamera = true,
		centered = false
	) {
		while (text.length * size < width) text += text;
		while (text.length * size > width)
			text = text.substr(0, text.length - 1);

		if (centered) {
			x += canvas.width / 2 - width / 2;
			y += canvas.height / 2 - height / 2;
		}

		for (var i = 0; i < Math.round(height / size); i++) {
			this.drawWord(
				text,
				x,
				y + i * size,
				size / 8,
				color,
				boundByCamera
			);
		}
	}
	static drawWord(
		text,
		x,
		y,
		size = 12,
		color = COLORS.red /* , hue = 0 */,
		boundByCamera = true
	) {
		for (var i = 0; i < text.length; i++) {
			var char = text[i];
			var index = alphabet.indexOf(char.toUpperCase());

			/* ctx.filter = `hue-rotate(${hue}deg)`; */
			draw(
				color,
				index * 8,
				0,
				8,
				8,
				x * SCALE + 8 * SCALE * size * i,
				y * SCALE,
				8 * SCALE * size,
				8 * SCALE * size,
				boundByCamera
			);
			/*   ctx.filter = ""; */
		}
	}
}
