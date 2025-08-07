let qrScanner = null;
let scanning = false;
let isBusy = false;
let scanSessionActive = false;

window.addEventListener("load", () => {
  const scannedValueInput = document.getElementById("scannedValueInput");
  const addBtn = document.getElementById("addStockBtn");
  const removeBtn = document.getElementById("removeStockBtn");
  const resultEl = document.getElementById("result");
  const readerEl = document.getElementById("reader");
  const startScanBtn = document.getElementById("startScanBtn"); // bouton 📷 / 🛑
  const photoBtn = startScanBtn; // alias pour plus de clarté

  function updateButtonsState() {
    const reference = document.getElementById("referenceBox").value.trim();
    const marque = document.getElementById("marque").value.trim();
    const saison = document.getElementById("saison").value;
    const isReady = reference && marque && saison;
    const shouldDisable = !isReady || scanning || isBusy;

    addBtn.disabled = shouldDisable;
    removeBtn.disabled = shouldDisable;
    startScanBtn.disabled = isBusy;
  }

  photoBtn.addEventListener('click', async () => {
    if (scanning) {
      photoBtn.textContent = "⏳";
      await stopScanner();
    } else {
      photoBtn.classList.add('active');
      photoBtn.textContent = "🛑";
      await startScanner();
    }
  });

  function fillFieldsFromQR(data) {
    const parts = data.trim().split(/\s+/);
    document.getElementById("referenceBox").value = parts[0] || "";
    document.getElementById("optionC").checked = parts.includes("C");

    const chargeIndex = parts.includes("C") ? 2 : 1;
    const vitesseIndex = chargeIndex + 1;
    const marqueIndex = vitesseIndex + 1;
    const saisonIndex = marqueIndex + 1;

    document.getElementById("indiceCharge").value = parts[chargeIndex] || "";
    document.getElementById("indiceVitesse").value = parts[vitesseIndex] || "";
    document.getElementById("marque").value = parts[marqueIndex] || "";
    document.getElementById("saison").value = parts[saisonIndex] || "";
  }

  async function startScanner() {
    if (scanning || isBusy) return;

    isBusy = true;
    updateButtonsState();

    qrScanner = new Html5Qrcode("reader");
    scanSessionActive = true;
    scanning = true;

    startScanBtn.textContent = "🛑";
    readerEl.classList.add("scanning");
    scannedValueInput.value = "En attente du scan...";

    try {
      await qrScanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          if (!scanSessionActive) return;
          scannedValueInput.value = decodedText;
          fillFieldsFromQR(decodedText);
          resultEl.textContent = "✅ QR détecté";
        },
        () => {}
      );
    } catch (err) {
      resultEl.textContent = "⚠️ Erreur d’accès caméra : " + err;
      scanning = false;
      scanSessionActive = false;
    }

    isBusy = false;
    updateButtonsState();
  }

  async function stopScanner() {
    if (!scanning || isBusy || !qrScanner) return;

    isBusy = true;
    updateButtonsState();

    try {
      scanSessionActive = false;
      await qrScanner.stop();
      await qrScanner.clear();
      qrScanner = null;
      scanning = false;

      readerEl.classList.remove("scanning");
      startScanBtn.textContent = "📷";
      photoBtn.classList.remove("active");
    } catch (err) {
      resultEl.textContent = "Erreur arrêt scanner : " + err;
    }

    isBusy = false;
    updateButtonsState();
  }

  function setBusyState(isLoading) {
    isBusy = isLoading;
    updateButtonsState();

    if (isLoading) {
      addBtn.classList.add("loading");
      removeBtn.classList.add("loading");
    } else {
      addBtn.classList.remove("loading");
      removeBtn.classList.remove("loading");
    }
  }

  function handleStockAction(actionType) {
    if (isBusy) return;

    setBusyState(true);

    const ref = document.getElementById("referenceBox").value.trim();
    const marque = document.getElementById("marque").value.trim();
    const action = actionType === "add" ? "ajouté" : "retiré";

    setTimeout(() => {
      resultEl.innerHTML = `✅ Le modèle de référence <strong style="color: #007bff;">${ref}</strong> de la marque <strong>${marque}</strong> a été ${action}.`;

      requestAnimationFrame(() => {
        setTimeout(() => {
          setBusyState(false);
        }, 100);
      });
    }, 2000);
  }

  addBtn.addEventListener("click", () => {
    handleStockAction("add");
  });

  removeBtn.addEventListener("click", () => {
    handleStockAction("remove");
  });

  scannedValueInput.addEventListener("input", updateButtonsState);
  updateButtonsState();
});