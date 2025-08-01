const scriptUrl = "https://script.google.com/macros/s/TON_URL/exec";

let qrScanner = null;
let scanning = false;

// Initialisation au chargement de la page
window.onload = () => {
  const scannedValueInput = document.getElementById("scannedValueInput");
  const addBtn = document.getElementById("addStockBtn");
  const removeBtn = document.getElementById("removeStockBtn");
  const resultEl = document.getElementById("result");
  const readerEl = document.getElementById("reader");
  const startScanBtn = document.getElementById("startScanBtn");

  qrScanner = new Html5Qrcode("reader");

  function updateButtonsState() {
    const hasValue = scannedValueInput.value.trim().length > 0;
    addBtn.disabled = !hasValue;
    removeBtn.disabled = !hasValue;
  }

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

  function startScanner() {
    if (scanning) return;

    scanning = true;
    startScanBtn.textContent = "Arrêter le scan";
    startScanBtn.classList.add("active");
    scannedValueInput.value = "En attente du scan...";
    resultEl.textContent = "";
    readerEl.classList.add("scanning");

    qrScanner.start(
      { facingMode: "environment" },  // Caméra arrière
      { fps: 10, qrbox: 250 },
      (decodedText) => {
        qrScanner.stop().then(() => {
          scanning = false;
          startScanBtn.textContent = "Scanner";
          startScanBtn.classList.remove("active");
          readerEl.classList.remove("scanning");

          scannedValueInput.value = decodedText;
          fillFieldsFromQR(decodedText);
          updateButtonsState();
        }).catch(err => {
          console.error("Erreur lors de l'arrêt du scanner :", err);
          resultEl.textContent = "Erreur en stoppant le scanner.";
        });
      },
      (errorMsg) => {
        // Silencieux (évite le spam console à chaque frame)
      }
    ).catch(err => {
      scanning = false;
      startScanBtn.textContent = "Scanner";
      startScanBtn.classList.remove("active");
      readerEl.classList.remove("scanning");
      console.error("Erreur lors du démarrage du scanner :", err);
      resultEl.textContent = "⚠️ Impossible d'accéder à la caméra. Autorise l'accès ou utilise un navigateur compatible (https obligatoire).";
    });
  }

  function stopScanner() {
    if (!scanning) return;
    qrScanner.stop().then(() => {
      scanning = false;
      startScanBtn.textContent = "Scanner";
      startScanBtn.classList.remove("active");
      resultEl.textContent = "Scan arrêté";
      readerEl.classList.remove("scanning");
    }).catch(err => {
      console.error("Erreur en stoppant le scanner :", err);
      resultEl.textContent = "Erreur lors de l'arrêt du scanner.";
    });
  }

  function toggleScanner() {
    if (scanning) {
      stopScanner();
    } else {
      startScanner();
    }
  }

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
        resultEl.textContent = `❌ Erreur lors de l'envoi : ${err}`;
      });
  }

  // Événements
  startScanBtn.addEventListener("click", toggleScanner);
  addBtn.addEventListener("click", () => sendToSheet(scannedValueInput.value, "Ajout Stock"));
  removeBtn.addEventListener("click", () => sendToSheet(scannedValueInput.value, "Retrait Stock"));
  scannedValueInput.addEventListener("input", updateButtonsState);
  updateButtonsState();
};
