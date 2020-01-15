class Particle extends GameObject {
    constructor(x, y, color = COLORS.red, direction = undefined) {
        super(x, y);
        this.age = 5 + Math.random() * 10;

        if (direction) this.direction = direction - 270 + Math.random() * 180;
        else this.direction = Math.random() * 360;

        this.speed = Math.random() + 8;
        this.size = 1 + Math.random() * 1.5;

        this.color = color;
        this.senseRange = 10;
        this.char = alphabet[Math.floor(Math.random() * alphabet.length)];
    }

    logic() {
        this.age -= 1;
        this.speed -= 0.2;
        if (this.age <= 0) this.kill();
        this.move();
    }

    draw() {
        Alphabet.drawWord(this.char, this.x, this.y, this.size, this.color);
        super.draw();
    }
}

function spawnParticles(x, y, amount = 10, color, direction = undefined) {
    for (var i = 0; i < amount; i++) {
        new Particle(x, y, color, direction);
    }
}
