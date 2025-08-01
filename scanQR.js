const scriptUrl = "https://script.google.com/macros/s/TON_URL/exec";

let qrScanner = null;
let scanning = false;

// Récupération des éléments
const scannedValueInput = document.getElementById("scannedValueInput");
const addBtn = document.getElementById("addStockBtn");
const removeBtn = document.getElementById("removeStockBtn");
const resultEl = document.getElementById("result");
const readerEl = document.getElementById("reader");
const startScanBtn = document.getElementById("startScanBtn");

// Mise à jour de l’état des boutons
function updateButtonsState() {
  const hasValue = scannedValueInput.value.trim().length > 0;
  addBtn.disabled = !hasValue;
  removeBtn.disabled = !hasValue;
}

// Démarrer le scanner
function startScanner() {
  if (scanning) return;

  scanning = true;
  startScanBtn.textContent = "Arrêter le scan";
  startScanBtn.classList.add("active");

  scannedValueInput.value = "En attente du scan...";
  resultEl.textContent = "";
  readerEl.classList.add("scanning");

  qrScanner.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    qrCodeMessage => {
      qrScanner.stop().then(() => {
        scanning = false;
        startScanBtn.textContent = "Scanner";
        startScanBtn.classList.remove("active");

        scannedValueInput.value = qrCodeMessage;
        resultEl.textContent = "";
        readerEl.classList.remove("scanning");

        fillFieldsFromQR(qrCodeMessage);
        updateButtonsState();
      }).catch(err => {
        console.error("Erreur arrêt scan:", err);
        resultEl.textContent = "Erreur en stoppant le scanner";
        scanning = false;
        startScanBtn.textContent = "Scanner";
        readerEl.classList.remove("scanning");
      });
    },
    errorMessage => {
      // Silence pour éviter le spam console
    }
  ).catch(err => {
    console.error("Erreur démarrage scanner:", err);
    resultEl.textContent = "Erreur lors du démarrage du scanner.";
    scanning = false;
    startScanBtn.textContent = "Scanner";
    readerEl.classList.remove("scanning");
  });
}

// Arrêter le scanner
function stopScanner() {
  if (!scanning) return;

  qrScanner.stop().then(() => {
    scanning = false;
    startScanBtn.textContent = "Scanner";
    resultEl.textContent = "Scan arrêté";
    readerEl.classList.remove("scanning");
  }).catch(err => {
    console.error("Erreur arrêt scan:", err);
    resultEl.textContent = "Erreur en stoppant le scanner";
  });
}

// Lancer ou arrêter le scanner avec le bouton
function toggleScanner() {
  if (scanning) {
    stopScanner();
  } else {
    startScanner();
  }
}

// Envoyer à Google Sheets
function sendToSheet(message, action) {
  if (!message.trim()) {
    alert("Le champ est vide. Veuillez scanner ou saisir un code.");
    return;
  }

  resultEl.textContent = `Envoi en cours (${action})...`;
  fetch(scriptUrl, {
    method: "POST",
    body: JSON.stringify({ message, action }),
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  })
    .then(res => res.text())
    .then(text => {
      resultEl.textContent = `${action} effectué pour : ${message} (${text})`;
      scannedValueInput.value = "";
      updateButtonsState();
    })
    .catch(err => {
      resultEl.textContent = `Erreur lors de l'envoi : ${err}`;
    });
}

// Remplir les champs automatiquement après scan
function fillFieldsFromQR(data) {
  const parts = data.trim().split(/\s+/);

  document.getElementById("referenceBox").value = parts[0] || "";
  document.getElementById("optionC").value = parts.includes("C") ? "C" : "";

  const chargeIndex = parts.includes("C") ? 2 : 1;
  const vitesseIndex = chargeIndex + 1;
  const marqueIndex = vitesseIndex + 1;
  const saisonIndex = marqueIndex + 1;

  document.getElementById("indiceCharge").value = parts[chargeIndex] || "";
  document.getElementById("indiceVitesse").value = parts[vitesseIndex] || "";
  document.getElementById("marque").value = parts[marqueIndex] || "";
  document.getElementById("saison").value = parts[saisonIndex] || "";
}

// Initialisation
window.onload = () => {
  qrScanner = new Html5Qrcode("reader");

  startScanBtn.addEventListener("click", toggleScanner);

  document.getElementById("btnGenerateCode").addEventListener("click", () => {
    window.location.href = "generate.html";
  });

  addBtn.addEventListener("click", () => {
    sendToSheet(scannedValueInput.value, "Ajout Stock");
  });

  removeBtn.addEventListener("click", () => {
    sendToSheet(scannedValueInput.value, "Retrait Stock");
  });

  scannedValueInput.addEventListener("input", updateButtonsState);

  updateButtonsState();
};
