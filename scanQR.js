let qrScanner = null;
let scanning = false;
let isBusy = false;

window.addEventListener("load", () => {
  const scannedValueInput = document.getElementById("scannedValueInput");
  const addBtn = document.getElementById("addStockBtn");
  const removeBtn = document.getElementById("removeStockBtn");
  const resultEl = document.getElementById("result");
  const readerEl = document.getElementById("reader");
  const startScanBtn = document.getElementById("startScanBtn");
  const photoBtn = document.querySelector('.btn-photo');

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
    const shouldDisable = !isReady || scanning || isBusy;

    addBtn.disabled = shouldDisable;
    removeBtn.disabled = shouldDisable;
    startScanBtn.disabled = isBusy;
  }

  if (photoBtn) {
    photoBtn.addEventListener('click', () => {
      photoBtn.classList.toggle('active');
    });
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
    if (scanning || isBusy) return;

    isBusy = true;
    updateButtonsState();

    startScanBtn.textContent = "📷";
    readerEl.classList.add("scanning");
    scannedValueInput.value = "En attente du scan...";

    qrScanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      (decodedText) => {
        qrScanner.stop().then(() => {
          scanning = false;
          isBusy = false;
          startScanBtn.textContent = "📷";
          readerEl.classList.remove("scanning");

          scannedValueInput.value = decodedText;
          fillFieldsFromQR(decodedText);
          updateButtonsState();
        });
      },
      () => {
        // Silencieux
      }
    ).then(() => {
      scanning = true;
      updateButtonsState();
    }).catch(err => {
      scanning = false;
      isBusy = false;
      startScanBtn.textContent = "📷";
      readerEl.classList.remove("scanning");
      resultEl.textContent = "⚠️ Erreur d’accès caméra : " + err;
      updateButtonsState();
    });
  }

  function stopScanner() {
    if (!scanning) return;

    isBusy = true;
    updateButtonsState();

    qrScanner.stop().then(() => {
      scanning = false;
      isBusy = false;
      startScanBtn.textContent = "📷";
      readerEl.classList.remove("scanning");
      updateButtonsState();
    }).catch(err => {
      isBusy = false;
      resultEl.textContent = "Erreur arrêt scanner : " + err;
      updateButtonsState();
    });
  }

  function toggleScanner() {
    if (isBusy) return;
    scanning ? stopScanner() : startScanner();
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

    // Simule une requête serveur (remplace par ton fetch réel)
    setTimeout(() => {
      resultEl.innerHTML = `✅ Le modèle de référence <strong style="color: #007bff;">${ref}</strong> de la marque <strong>${marque}</strong> a été ${action}.`;

      requestAnimationFrame(() => {
        setTimeout(() => {
          setBusyState(false);
        }, 100);
      });
    }, 2000); // Simule 2s de traitement serveur
  }

  addBtn.addEventListener("click", () => {
    handleStockAction("add");
  });

  removeBtn.addEventListener("click", () => {
    handleStockAction("remove");
  });

  startScanBtn.addEventListener("click", toggleScanner);
  scannedValueInput.addEventListener("input", updateButtonsState);
  updateButtonsState();
});