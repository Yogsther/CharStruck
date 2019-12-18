/**
 * charify-image, Olle Kaiser 2019
 *
 * Takes a PNG image and converts it to an image made
 * up by letters.
 *
 * Usage: node index.js [color] [image in]
 */

const fs = require("fs");
const PNG = require("pngjs").PNG;

var letters = [];

var color = process.argv[2];
var image = process.argv[3];

fs.createReadStream("textures/" + color + ".png")
	.pipe(
		new PNG({
			filterType: 4
		})
	)
	.on("parsed", function() {
		for (let i = 0; i < this.width / 8; i++) {
			let brightness = 0;
			var data = [];

			for (let y = 0; y < 8; y++) {
				for (let x = i * 8; x < i * 8 + 8; x++) {
					let idx = (this.width * y + x) << 2;

					let r = this.data[idx];
					let g = this.data[idx + 1];
					let b = this.data[idx + 2];
					brightness += 0.2126 * r + 0.7152 * g + 0.0722 * b;
					for (c of [r, g, b, 255]) data.push(c);
				}
			}

			letters.push({
				brightness: brightness / (8 * 8),
				data
			});
		}

		var out = new PNG({
			width: 8,
			height: 8,
			filterType: -1
		});
		out.data = letters[0].data;
		console.log(out.data.length);

		out.pack().pipe(fs.createWriteStream("out.png"));
		console.log("File written");
	});
