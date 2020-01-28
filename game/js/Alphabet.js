const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ1234567890:";

class Alphabet {
    static drawUITextCentered(text, x, y, size = 12, color = COLORS.red) {
        this.drawWord(
            text,
            x - text.length * 4 * size,
            y,
            size,
            color,
            false,
            false
        );
    }

    static drawBlock(
        text,
        x,
        y,
        width,
        height,
        size = 12,
        color = COLORS.red,
        boundByCamera = true,
        centered = true
    ) {
        while (text.length * size < width) text += text;
        while (text.length * size > width)
            text = text.substr(0, text.length - 1);

        var width = text.length * size;

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
                boundByCamera,
                false
            );
        }
    }

    static drawMob(
        x,
        y,
        string,
        width,
        height,
        health = 5,
        color = COLORS.green,
        size = 1.5
    ) {
        var position = { x, y };
        var stringIndex = 0;
        var maxHealth = width * height;

        size *= 8;

        for (var y = 0; y < height * size; y += size) {
            for (var x = 0; x < width * size; x += size) {
                this.drawWord(
                    string[stringIndex % string.length],
                    x + position.x,
                    y + position.y,
                    size / 8,
                    stringIndex >= maxHealth - health ? color : COLORS.grey
                );
                stringIndex++;
            }
        }
    }

    static drawWord(
        text,
        x,
        y,
        size = 12,
        color = COLORS.red /* , hue = 0 */,
        boundByCamera = true,
        centered = true
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
                boundByCamera,
                centered
            );
            /*   ctx.filter = ""; */
        }
    }
}
