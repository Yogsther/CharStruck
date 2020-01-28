function renderTimer() {
    if (timer != 0) {
        var time = formatTime(timer);
        Alphabet.drawWord(
            `${time.m}:${time.s}:${time.ms}`,
            15,
            15,
            5,
            COLORS.white,
            false,
            false
        );
    }
}

function forceLength(number) {
    while (number.toString().length < 2) number = "0" + number;
    return number;
}

function formatTime(time) {
    var d = Date.now() - time;
    var m = Math.floor(d / 1000 / 60);
    var s = Math.floor(d / 1000) - m * 60;
    var ms = Math.floor((d % 1000) / 10);
    return { m: forceLength(m), s: forceLength(s), ms: forceLength(ms) };
}
