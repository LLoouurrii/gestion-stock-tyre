function formatReference(input) {
    let value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, ""); // lettres + chiffres
    if (value.length > 3) {
        value = value.slice(0, 3) + "/" + value.slice(3, 7);
    }
    input.value = value;
}

function generateQR() {
    const input = document.getElementById("referenceBox");
    const text = input.value.trim().toUpperCase();
    const qrDiv = document.getElementById("qrcode");
    const downloadBtn = document.getElementById("downloadBtn");

    qrDiv.innerHTML = ""; // reset affichage QR
    downloadBtn.style.display = "none";

    const cleanText = text.replace("/", "");

    // Vérifie le format XXX/XXXX
    if (cleanText.length !== 7 || !/^[A-Z0-9]{3}\/[A-Z0-9]{4}$/.test(text)) {
        alert("❌ Format attendu : \n Reference : 205/55R16");
        return;
    }

    // Crée dynamiquement un canvas pour le QR
    const canvas = document.createElement("canvas");

    QRCode.toCanvas(canvas, text, { width: 250 }, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        qrDiv.appendChild(canvas);
        downloadBtn.style.display = "inline-block";
    });
}

function downloadQR() {
    const canvas = document.querySelector("#qrcode canvas");
    const text = document.getElementById("referenceBox").value.trim();
    if (!canvas || !text) return;

    const link = document.createElement("a");
    link.download = `${text}.png`;
    link.href = canvas.toDataURL();
    link.click();
}

document.addEventListener('DOMContentLoaded', () => {
    // Active le formatage automatique de la référence
    const input = document.getElementById('referenceBox');
    if (input) {
        input.addEventListener('input', () => formatReference(input));
    }

    // Redirige vers le scan QR
    const btnScanQR = document.getElementById('btnScanQR');
    if (btnScanQR) {
        btnScanQR.addEventListener('click', () => {
            window.location.href = 'logged.html';
        });
    }
});
