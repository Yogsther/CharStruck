function renderMinimap() {
	ctx.save()
	var size = 150
	var scale = .08
	var margin = 20

	ctx.fillStyle = 'black'
	ctx.fillRect(margin, canvas.height - margin - size, size, size)



	ctx.beginPath()
	ctx.rect(margin, canvas.height - margin - size, size, size)

	ctx.clip()



	function translate(x, y) {


		x -= player.x
		y -= player.y

		x *= scale
		y *= scale



		var center = {
			x: (margin + size / 2) - 5,
			y: canvas.height - margin - (size / 2) - 5
		}

		x += center.x
		y += center.y

		return {
			x,
			y
		}
	}

	for (let i = 0; i < world.length; i++) {
		let item = world[i]
		let text;
		let color;
		if (item.type == OBJECT_TYPE.player) {
			text = 'P'
			color = COLORS.red
		} else if (item.type == OBJECT_TYPE.mob) {
			text = 'M'
			color = COLORS.green

		} else if (item.type == OBJECT_TYPE.key) {
			text = 'K'
			color = COLORS.gold
		}

		let pos = translate(item.x, item.y)

		if (item.type == OBJECT_TYPE.wall) {
			ctx.fillStyle = "#5644f3"
			ctx.fillRect(pos.x, pos.y, item.width * scale, item.height * scale)

		} else if (text) {
			Alphabet.drawWord(text, pos.x, pos.y, 3, color, false, false)
		}



	}

	ctx.restore()
}