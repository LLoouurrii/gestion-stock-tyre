const scriptUrl = "https://script.google.com/macros/s/TON_URL/exec";

let qrScanner = null;
let scanning = false;

const scannedValueInput = document.getElementById("scannedValueInput");
const addBtn = document.getElementById("addStockBtn");
const removeBtn = document.getElementById("removeStockBtn");
const rescanBtn = document.getElementById("rescanBtn");
const resultEl = document.getElementById("result");
const readerEl = document.getElementById("reader");
const btnScanQR = document.getElementById("btnScanQR");

function updateButtonsState() {
    const hasValue = scannedValueInput.value.trim().length > 0;
    addBtn.disabled = !hasValue;
    removeBtn.disabled = !hasValue;
    rescanBtn.disabled = !hasValue;
}

function startScanner() {
    if (scanning) return;
    scanning = true;
    btnScanQR.textContent = "Arrêter Scan QR";
    btnScanQR.classList.add("active");
    scannedValueInput.value = "En attente du scan...";
    resultEl.textContent = "";
    readerEl.classList.add("scanning");

    qrScanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        qrCodeMessage => {
            qrScanner.stop().then(() => {
                scanning = false;
                btnScanQR.textContent = "Démarrer Scan QR";
                btnScanQR.classList.remove("active");
                scannedValueInput.value = qrCodeMessage;
                updateButtonsState();
                readerEl.classList.remove("scanning");
                resultEl.textContent = "";

                fillFieldsFromQR(qrCodeMessage);
            }).catch(err => {
                console.error("Erreur arrêt scan:", err);
                resultEl.textContent = "Erreur en stoppant le scanner";
                scanning = false;
                btnScanQR.textContent = "Démarrer Scan QR";
                btnScanQR.classList.remove("active");
                readerEl.classList.remove("scanning");
            });
        },
        errorMessage => {
            // Ignoré pour éviter le spam
        }
    ).catch(err => {
        resultEl.textContent = "Erreur démarrage scanner: " + err;
        console.error(err);
        scanning = false;
        btnScanQR.textContent = "Démarrer Scan QR";
        btnScanQR.classList.remove("active");
        readerEl.classList.remove("scanning");
    });
}

function stopScanner() {
    if (!scanning) return;
    qrScanner.stop().then(() => {
        scanning = false;
        btnScanQR.textContent = "Démarrer Scan QR";
        btnScanQR.classList.remove("active");
        resultEl.textContent = "Scan arrêté";
        readerEl.classList.remove("scanning");
    }).catch(err => {
        console.error("Erreur arrêt scan:", err);
        resultEl.textContent = "Erreur en stoppant le scanner";
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
            resultEl.textContent = `Erreur lors de l'envoi : ${err}`;
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

window.onload = () => {
    qrScanner = new Html5Qrcode("reader");

    btnScanQR.addEventListener("click", toggleScanner);

    document.getElementById("btnGenerateCode").addEventListener("click", () => {
        window.location.href = "generate.html";
    });

    addBtn.addEventListener("click", () => {
        sendToSheet(scannedValueInput.value, "Ajout Stock");
    });

    removeBtn.addEventListener("click", () => {
        sendToSheet(scannedValueInput.value, "Retrait Stock");
    });

    rescanBtn.addEventListener("click", () => {
        if (scanning) {
            qrScanner.stop().then(() => {
                scanning = false;
                scannedValueInput.value = "En attente du scan...";
                resultEl.textContent = "";
                startScanner();
            }).catch(err => {
                resultEl.textContent = "Erreur arrêt scanner pour rescanner : " + err;
            });
        } else {
            scannedValueInput.value = "En attente du scan...";
            resultEl.textContent = "";
            startScanner();
        }
        updateButtonsState();
    });

    scannedValueInput.addEventListener("input", updateButtonsState);
    updateButtonsState();
};
