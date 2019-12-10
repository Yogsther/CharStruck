var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ";

class Alphabet {
    static drawWord(text, x, y, size = 12, color = COLORS.red /* , hue = 0 */) {
        for (var i = 0; i < text.length; i++) {
            var char = text[i];
            var index = alphabet.indexOf(char.toUpperCase());

            /* ctx.filter = `hue-rotate(${hue}deg)`; */
            ctx.drawImage(
                color,
                index * 8,
                0,
                8,
                8,
                x * SCALE + 8 * SCALE * size * i,
                y * SCALE,
                8 * SCALE * size,
                8 * SCALE * size
            );
            /*   ctx.filter = ""; */
        }
    }
}
