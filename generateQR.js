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
  const vitesseInput = document.getElementById("indiceVitesse");
  const marqueInput = document.getElementById("marque");
  const saisonInput = document.getElementById("saison"); // ➕

  const ref = input.value.trim();
  const option = optionInput ? optionInput.value.trim().toUpperCase() : "";
  const indice = indiceInput ? indiceInput.value.trim().toUpperCase() : "";
  const vitesse = vitesseInput ? vitesseInput.value.trim().toUpperCase() : "";
  const marque = marqueInput ? marqueInput.value.trim().toUpperCase() : "";
  const saison = saisonInput ? saisonInput.value.trim().toUpperCase() : ""; // ➕

  const qrDiv = document.getElementById("qrcode");
  const downloadBtn = document.getElementById("downloadBtn");

  qrDiv.innerHTML = "";
  downloadBtn.style.display = "none";

  // ✅ Vérification Référence
  if (ref.length !== 9 || !/^[A-Z0-9]{3}\/[A-Z0-9]{5}$/.test(ref)) {
    alert("❌ Format attendu : XXX/XXXXX (ex : 255/55R16)");
    return;
  }

  // ✅ Vérification Option
  if (option && option !== "C") {
    alert("❌ L'option doit être vide ou contenir uniquement la lettre majuscule 'C'.");
    return;
  }

  // ✅ Vérification Indice de charge
  if (indice.length < 2 || indice.length > 9 || !/^\d{2,3}(\/\d{2,3})?$/.test(indice)) {
    alert("❌ L'indice de charge doit être un nombre de 2 à 3 chiffres, avec optionnellement un second indice après '/'. Exemple : 107 ou 107/105.");
    return;
  }

  // ✅ Vérification Indice de vitesse
  if (!/^[A-Z]$/.test(vitesse)) {
    alert("❌ L'indice de vitesse doit être une seule lettre majuscule.");
    return;
  }

  // ✅ Vérification Marque
  if (marque.length < 2 || marque.length > 20) {
    alert("❌ La marque doit contenir entre 2 et 20 caractères.");
    return;
  }

  // ✅ Vérification Saison
  if (!["E", "H", "S"].includes(saison)) {
    alert("❌ Vous devez sélectionner une saison : Été (E), Hiver (H) ou 4 Saisons (S).");
    return;
  }

  // ✅ Construction de la chaîne QR finale
  let finalText = ref;
  if (option === "C") finalText += " C";
  finalText += ` ${indice} ${vitesse} ${marque} ${saison}`;

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
