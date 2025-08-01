function formatReference(input) {
    let value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (value.length > 3) {
        value = value.slice(0, 3) + "/" + value.slice(3, 8); // XXX/XXXXX
    }
    input.value = value;
}

function generateQR() {
    const input = document.getElementById("referenceBox");
    const optionInput = document.getElementById("optionC");
    const indiceInput = document.getElementById("indiceCharge");

    const ref = input.value.trim(); // déjà en majuscules
    const option = optionInput ? optionInput.value.trim().toUpperCase() : "";
    const indice = indiceInput ? indiceInput.value.trim() : "";

    const qrDiv = document.getElementById("qrcode");
    const downloadBtn = document.getElementById("downloadBtn");

    qrDiv.innerHTML = "";
    downloadBtn.style.display = "none";

    // 🔹 Vérifie la référence
    if (ref.length !== 9 || !/^[A-Z0-9]{3}\/[A-Z0-9]{5}$/.test(ref)) {
        alert("❌ Format attendu : XXX/XXXXX (ex : 255/55R16)");
        return;
    }

    // 🔹 Vérifie l'option facultative
    if (option && option !== "C") {
        alert("❌ L'option doit être vide ou contenir uniquement la lettre majuscule 'C'.");
        return;
    }

    // 🔹 Vérifie indice obligatoire (2 à 7 caractères)
    if (indice.length < 2 || indice.length > 7) {
        alert("❌ L'indice de charge doit contenir entre 2 et 7 caractères.");
        return;
    }

    // 🔹 Construction finale avec espaces
    let finalText = ref;
    if (option === "C") finalText += " C";
    finalText += " " + indice;

    const canvas = document.createElement("canvas");
    QRCode.toCanvas(canvas, finalText, { width: 250 }, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        qrDiv.appendChild(canvas);
        downloadBtn.style.display = "inline-block";
        downloadBtn.dataset.filename = finalText;
    });
}

function downloadQR() {
    const canvas = document.querySelector("#qrcode canvas");
    const filename = document.getElementById("downloadBtn").dataset.filename || "qrcode";
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL();
    link.click();
}

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('referenceBox');
    if (input) {
        input.addEventListener('input', () => formatReference(input));
    }

    const btnScanQR = document.getElementById('btnScanQR');
    if (btnScanQR) {
        btnScanQR.addEventListener('click', () => {
            window.location.href = 'logged.html';
        });
    }
});
