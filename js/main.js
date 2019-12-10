var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

var testText = "TESTING";
var offset = 0;

const SCALE = 5;

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

document.body.addEventListener("keypress", e => {
    testText += e.key;
});

function logic() {}

function render() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    offset += 0.2;
    for (var i = 0; i < 50; i++) {
        Alphabet.drawWord(randomText(), 0, i * 3.2, 0.4, COLORS.blue);
    }
}

function randomText() {
    var str = "";
    for (var i = 0; i < 70; i++) {
        str += "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ"[Math.floor(offset) % 29];
    }
    return str;
}
