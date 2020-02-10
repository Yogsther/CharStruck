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

var crypto = require("crypto");
const path = require("path");
const express = require("express");
const app = express();
const port = 3001;

app.use(express.static("website"));

app.use("/i", express.static("./generated"));
app.use("/game", express.static("../game"));

app.listen(port, () => console.log(`CS started on port ${port}!`));

const multer = require("multer");

const handleError = (err, res) => {
    console.log(err);
    res.status(500)
        .contentType("text/plain")
        .end("Oops! Something went wrong!");
};

var storage = multer.diskStorage({
    destination: "./uploads/",
    filename: function(req, file, cb) {
        cb(
            null,
            crypto
                .createHash("md5")
                .update(file.fieldname + "-" + Date.now())
                .digest("hex") + ".png"
        );
    }
});

const upload = multer({
    dest: path.join(__dirname, "./uploads"),
    storage: storage
});

app.post("/charify", upload.single("photo"), (req, res) => {
    if (path.extname(req.file.originalname).toLowerCase() === ".png") {
        // Charify image
        try {
            var colors = JSON.parse(req.body.colors);

            if (colors.length == 0) {
                res.send({
                    success: false,
                    message: "Please select at least one color!"
                });
            } else {
                charifyImage(req.file.filename, colors, () => {
                    res.send({
                        success: true,
                        url: "/i/" + req.file.filename
                    });
                });
            }
        } catch (e) {
            res.send({
                success: false,
                message: "Failed to parse colors, please reload."
            });
        }
    } else {
        res.send({
            success: false,
            message: "Only upload PNGs!"
        });
    }
});

function charifyImage(url, colors = ["red"], callback = () => {}) {
    let letters = [];
    let maxLetter = 0;
    let minLetter = Infinity;

    let colorsAdded = 0;

    for (var color of colors) {
        addColor(color);
    }

    function colorAdded() {
        colorsAdded++;
        if (colorsAdded == colors.length) {
            parseImage();
        }
    }

    function addColor(color) {
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
                            let index = (this.width * y + x) << 2;

                            let r = this.data[index];
                            let g = this.data[index + 1];
                            let b = this.data[index + 2];
                            brightness += 0.2126 * r + 0.7152 * g + 0.0722 * b;
                            for (c of [r, g, b, 255]) data.push(c);
                        }
                    }

                    brightness /= 64;

                    if (brightness > maxLetter) maxLetter = brightness;
                    if (brightness < minLetter) minLetter = brightness;

                    letters.push({
                        brightness,
                        data
                    });
                }

                letters.sort((a, b) => {
                    return b.brightness - a.brightness;
                });

                colorAdded();
            });
    }

    function parseImage() {
        fs.createReadStream("./uploads/" + url)
            .pipe(new PNG({ filterType: 4 }))
            .on("parsed", function() {
                var maxBrightness = 0;
                var minBrightness = Infinity;

                // Evaluate max and min brighness for scale
                for (let y = 0; y < this.height; y += 8) {
                    for (let x = 0; x < this.width; x += 8) {
                        var brightness = parseBlock(this, x, y);

                        if (brightness > maxBrightness)
                            maxBrightness = brightness;
                        if (brightness < minBrightness && brightness >= 0)
                            minBrightness = brightness;
                    }
                }

                // Create new image
                var out = new PNG({
                    width: this.width,
                    height: this.height,
                    filterType: -1
                });

                for (let y = 0; y < this.height; y += 8) {
                    for (let x = 0; x < this.width; x += 8) {
                        // Set the range for the letters
                        var brightness = parseBlock(this, x, y);
                        if (brightness >= 0) {
                            brightness -= minBrightness;
                            brightness *=
                                (maxLetter - minLetter) /
                                (maxBrightness - minBrightness);

                            var letter = letters[0];
                            for (var l of letters)
                                if (l.brightness > brightness) {
                                    letter = l;
                                }

                            out = setLetter(out, x, y, letter.data);
                        }
                    }
                }

                out.pack().pipe(
                    fs
                        .createWriteStream("./generated/" + url)
                        .on("close", function() {
                            console.log("Image was charified: " + url);
                            callback();
                        })
                );
            });
    }

    function setLetter(png, startX, startY, data) {
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                let pngIndex = (png.width * (y + startY) + (x + startX)) << 2;
                let dataIndex = (8 * y + x) << 2;

                png.data[pngIndex] = data[dataIndex];
                png.data[pngIndex + 1] = data[dataIndex + 1];
                png.data[pngIndex + 2] = data[dataIndex + 2];
                png.data[pngIndex + 3] = data[dataIndex + 3];

                //console.log(png.data[pngIndex + 2]);
            }
        }

        return png;
    }

    function parseBlock(png, startX, startY) {
        var brightness = 0;
        for (let y = startY; y < 8 + startY; y++) {
            for (let x = startX; x < 8 + startX; x++) {
                let index = (png.width * y + x) << 2;
                let r = png.data[index];
                let g = png.data[index + 1];
                let b = png.data[index + 2];
                brightness += 0.2126 * r + 0.7152 * g + 0.0722 * b;
                if (png.data[index + 3] == 0) return -1;
            }
        }
        return brightness / 64;
    }
}
