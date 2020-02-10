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

        this.lastStop = -100;
        this.speed = 5;
        this.clearedLane = false;
        this.type = OBJECT_TYPE.ui;
        this.newWord();
    }

    newWord() {
        this.color =
            selectedColors.length > 0
                ? COLORS[
                      selectedColors[
                          Math.floor(Math.random() * selectedColors.length)
                      ]
                  ]
                : COLORS.dark;

        this.wordIndex =
            this.y == 0 ? Math.floor(Math.random() * "CHARSTRUCK".length) : 0;
        /* this.word = WORDS[Math.floor(Math.random() * WORDS.length)]; */
        this.word = "CHARSTRUCK";
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
}
