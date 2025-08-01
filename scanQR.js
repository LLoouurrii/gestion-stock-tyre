let qrScanner = null;
let scanning = false;

window.onload = () => {
  const scannedValueInput = document.getElementById("scannedValueInput");
  const addBtn = document.getElementById("addStockBtn");
  const removeBtn = document.getElementById("removeStockBtn");
  const resultEl = document.getElementById("result");
  const readerEl = document.getElementById("reader");
  const startScanBtn = document.getElementById("startScanBtn");

  qrScanner = new Html5Qrcode("reader");

  function updateButtonsState() {
    const reference = document.getElementById("referenceBox").value.trim();
    const marque = document.getElementById("marque").value.trim();
    const saison = document.getElementById("saison").value;
    const isReady = reference && marque && saison;

    addBtn.disabled = !isReady;
    removeBtn.disabled = !isReady;
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
    readerEl.classList.add("scanning");
    scannedValueInput.value = "En attente du scan...";

    qrScanner.start({ facingMode: "environment" }, { fps: 10, qrbox: 250 },
      (decodedText) => {
        qrScanner.stop().then(() => {
          scanning = false;
          startScanBtn.textContent = "Scanner";
          readerEl.classList.remove("scanning");

          scannedValueInput.value = decodedText;
          fillFieldsFromQR(decodedText);
          updateButtonsState();
        });
      },
      () => {}
    ).catch(err => {
      scanning = false;
      resultEl.textContent = "⚠️ Erreur d’accès caméra : " + err;
    });
  }

  function stopScanner() {
    if (!scanning) return;
    qrScanner.stop().then(() => {
      scanning = false;
      startScanBtn.textContent = "Scanner";
      readerEl.classList.remove("scanning");
    });
  }

  function toggleScanner() {
    scanning ? stopScanner() : startScanner();
  }

  // Events
  startScanBtn.addEventListener("click", toggleScanner);
  scannedValueInput.addEventListener("input", updateButtonsState);
};
