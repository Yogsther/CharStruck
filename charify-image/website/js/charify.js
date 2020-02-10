var selectedColors = ["red"];

for (var name in COLOR_CODES) {
    document.getElementById("colors").innerHTML += `<div class="color ${
        selectedColors.indexOf(name) != -1 ? "selected" : ""
    }" color="${name}" onclick="toggleColor(this)" style="background:${
        COLOR_CODES[name]
    };"></div>`;
}

function toggleColor(el) {
    var color = el.getAttribute("color");
    if (selectedColors.indexOf(color) == -1) {
        selectedColors.push(el.getAttribute("color"));
        el.classList.add("selected");
    } else {
        selectedColors.splice(selectedColors.indexOf(color), 1);
        el.classList.remove("selected");
    }
}

document.getElementById("choose-button").onclick = () => {
    document.getElementById("file-chooser").click();
};

document.getElementById("file-chooser").onchange = function() {
    document.getElementById("file-name").innerText = this.value.replace(
        /.*[\/\\]/,
        ""
    );
};

function upload() {
    if (document.getElementById("file-chooser").files[0]) {
        let photo = document.getElementById("file-chooser").files[0];
        let formData = new FormData();
        formData.append("photo", photo);
        formData.append("colors", JSON.stringify(selectedColors));

        axios
            .request({
                method: "post",
                url: "/charify",
                data: formData,
                onUploadProgress: p => {
                    if (p.loaded == p.total) {
                        message("Charifying...");
                    } else {
                        message(
                            "Uploading... " +
                                Math.round((p.loaded / p.total) * 100) +
                                "%"
                        );
                    }
                }
            })
            .then(res => {
                if (res.data.success) {
                    message(
                        "Done! Checkout the result <a href='" +
                            res.data.url +
                            "' target='_blank'>here!</a>"
                    );
                    window.open(res.data.url);
                } else {
                    message(res.data.message, true);
                }
            });
    } else {
        message("Please choose an image first!", true);
    }
}

function message(msg, redText = false) {
    redText
        ? document.getElementById("status").classList.add("red")
        : document.getElementById("status").classList.remove("red");
    document.getElementById("status").innerHTML = msg;
}
