let qrScanner = null;
let scanning = false;

window.addEventListener("load", () => {
  const scannedValueInput = document.getElementById("scannedValueInput");
  const addBtn = document.getElementById("addStockBtn");
  const removeBtn = document.getElementById("removeStockBtn");
  const resultEl = document.getElementById("result");
  const readerEl = document.getElementById("reader");
  const startScanBtn = document.getElementById("startScanBtn");

  if (!startScanBtn || !readerEl) {
    console.error("Les éléments du DOM ne sont pas chargés correctement.");
    return;
  }

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
    startScanBtn.textContent = "📷";
    readerEl.classList.add("scanning");
    scannedValueInput.value = "En attente du scan...";

    qrScanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      (decodedText) => {
        qrScanner.stop().then(() => {
          scanning = false;
          startScanBtn.textContent = "📷";
          readerEl.classList.remove("scanning");

          scannedValueInput.value = decodedText;
          fillFieldsFromQR(decodedText);
          updateButtonsState();
        });
      },
      (errorMsg) => {
        // silencieux
      }
    ).catch(err => {
      scanning = false;
      startScanBtn.textContent = "📷";
      readerEl.classList.remove("scanning");
      resultEl.textContent = "⚠️ Erreur d’accès caméra : " + err;
    });
  }

  function stopScanner() {
    if (!scanning) return;
    qrScanner.stop().then(() => {
      scanning = false;
      startScanBtn.textContent = "📷";
      readerEl.classList.remove("scanning");
    }).catch(err => {
      resultEl.textContent = "Erreur arrêt scanner : " + err;
    });
  }

  function toggleScanner() {
    scanning ? stopScanner() : startScanner();
  }

  // Événements
  startScanBtn.addEventListener("click", toggleScanner);
  scannedValueInput.addEventListener("input", updateButtonsState);
  updateButtonsState();
});
