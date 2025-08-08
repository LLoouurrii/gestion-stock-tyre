function formatReference(input) {
  let value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (value.length > 3) {
    value = value.slice(0, 3) + "/" + value.slice(3, 8); // XXX/XXXXX
  }
  input.value = value;
}

function generateQR() {
  const input = document.getElementById("referenceBox");
  const indiceInput = document.getElementById("indiceCharge");
  const vitesseInput = document.getElementById("indiceVitesse");
  const marqueInput = document.getElementById("marque");
  const saisonInput = document.getElementById("saison");

  const ref = input.value.trim();
  const option = document.getElementById("optionC").checked ? "C" : "";
  const indice = indiceInput ? indiceInput.value.trim().toUpperCase() : "";
  const vitesse = vitesseInput ? vitesseInput.value.trim().toUpperCase() : "";
  const marque = marqueInput ? marqueInput.value.trim().toUpperCase() : "";
  const saison = saisonInput ? saisonInput.value.trim().toUpperCase() : "";

  const qrDiv = document.getElementById("qrcode");
  const downloadBtn = document.getElementById("downloadBtn");

  qrDiv.innerHTML = "";
  downloadBtn.style.display = "none";

  if (ref.length !== 9 || !/^[A-Z0-9]{3}\/[A-Z0-9]{5}$/.test(ref)) {
    alert("❌ Format attendu : XXX/XXXXX (ex : 255/55R16)");
    return;
  }

  if (option && option !== "C") {
    alert("❌ L'option doit être vide ou contenir uniquement la lettre majuscule 'C'.");
    return;
  }

  if (indice.length < 2 || indice.length > 9 || !/^\d{2,3}(\/\d{2,3})?$/.test(indice)) {
    alert("❌ L'indice de charge doit être un nombre de 2 à 3 chiffres, avec optionnellement un second indice après '/'. Exemple : 107 ou 107/105.");
    return;
  }

  if (!/^[A-Z]$/.test(vitesse)) {
    alert("❌ L'indice de vitesse doit être une seule lettre majuscule.");
    return;
  }

  if (marque.length < 2 || marque.length > 20) {
    alert("❌ La marque doit contenir entre 2 et 20 caractères.");
    return;
  }

  if (!["E", "H", "S"].includes(saison)) {
    alert("❌ Vous devez sélectionner une saison : Été (E), Hiver (H) ou 4 Saisons (S).");
    return;
  }

  let finalText = ref;
  if (option === "C") finalText += " C";
  finalText += ` ${indice} ${vitesse} ${marque} ${saison}`;

  const qrSize = 250;
  const padding = 60;
  const fontSize = 18;
  const fontStyle = `bold ${fontSize}px monospace`;

  // Génère le QR code en image avec fond blanc pour affichage
  QRCode.toDataURL(finalText, {
    width: qrSize,
    color: {
      dark: "#000000",  // QR noir
      light: "#ffffff"  // Fond blanc pour affichage
    }
  }, (err, url) => {
    if (err) {
      console.error(err);
      return;
    }

    const img = new Image();
    img.onload = () => {
      // Mesure la largeur du texte
      const measureCanvas = document.createElement("canvas");
      const measureCtx = measureCanvas.getContext("2d");
      measureCtx.font = fontStyle;
      const textWidth = measureCtx.measureText(finalText).width;

      const finalWidth = Math.max(qrSize, textWidth + 20);
      const finalHeight = qrSize + padding;

      const canvas = document.createElement("canvas");
      canvas.width = finalWidth;
      canvas.height = finalHeight;

      const ctx = canvas.getContext("2d");

      // Fond transparent (pas de fillRect)

      // Dessine le QR centré
      const qrX = (finalWidth - qrSize) / 2;
      ctx.drawImage(img, qrX, 0, qrSize, qrSize);

      // Dessine le texte en noir
      ctx.font = fontStyle;
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.fillText(finalText, finalWidth / 2, qrSize + 35);

      qrDiv.appendChild(canvas);
      downloadBtn.style.display = "inline-block";
      downloadBtn.dataset.filename = finalText;
    };
    img.src = url;
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
