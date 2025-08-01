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

    const ref = input.value.trim(); // reste en majuscules
    const option = optionInput ? optionInput.value.trim().toUpperCase() : "";

    const qrDiv = document.getElementById("qrcode");
    const downloadBtn = document.getElementById("downloadBtn");

    qrDiv.innerHTML = "";
    downloadBtn.style.display = "none";

    // ✅ Vérification stricte sur la référence (exactement 9 caractères avec /)
    if (ref.length !== 9 || !/^[A-Z0-9]{3}\/[A-Z0-9]{5}$/.test(ref)) {
        alert("❌ Format attendu : XXX/XXXXX (ex : 255/55R16)");
        return;
    }

    // ✅ Vérifie que l'option est vide ou exactement "C"
    if (option !== "" && option !== "C") {
        alert("❌ L'option doit être vide ou contenir uniquement la lettre majuscule 'C'.");
        return;
    }

    // ✅ Génération texte final avec ou sans l'option
    const finalText = option === "C" ? `${ref} C` : ref;

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
