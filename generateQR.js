function generateQR() {
    const text = document.getElementById("text").value.trim();
    const qrDiv = document.getElementById("qrcode");
    const downloadBtn = document.getElementById("downloadBtn");

    qrDiv.innerHTML = "";
    downloadBtn.style.display = "none";

    if (text !== "") {
        QRCode.toCanvas(text, { width: 250 }, (err, canvas) => {
            if (err) return console.error(err);
            qrDiv.appendChild(canvas);
            downloadBtn.style.display = "inline-block";
        });
    }
}

function downloadQR() {
    const canvas = document.querySelector("#qrcode canvas");
    const text = document.getElementById("text").value.trim();
    if (!canvas || !text) return;

    const link = document.createElement("a");
    link.download = `${text}.png`;
    link.href = canvas.toDataURL();
    link.click();
}

document.addEventListener('DOMContentLoaded', () => {
  const btnScanQR = document.getElementById('btnScanQR');
  btnScanQR.addEventListener('click', () => {
    window.location.href = 'logged.html';
  });
});