const addBtn = document.getElementById("addStockBtn");
const removeBtn = document.getElementById("removeStockBtn");

function updateButtonsState() {
  const reference = document.getElementById("referenceBox").value.trim();
  const marque = document.getElementById("marque").value.trim();
  const saison = document.getElementById("saison").value;
  const isReady = reference && marque && saison;

  addBtn.disabled = !isReady;
  removeBtn.disabled = !isReady;
}

["referenceBox", "marque", "saison"].forEach(id => {
  document.getElementById(id).addEventListener("input", updateButtonsState);
  document.getElementById(id).addEventListener("change", updateButtonsState);
});

function sendToSheet(action) {
  const ref = document.getElementById("referenceBox").value.trim();
  const marque = document.getElementById("marque").value.trim();
  const saison = document.getElementById("saison").value;
  const url = "https://script.google.com/macros/s/AKfycbwEVF1Cvf_nzufjuqZObkqGna04w2NN2WEz5Pv_Sh5dob9xsc6TwtkD59QO8xsfGaWY/exec";

  if (!ref || !marque || !saison) {
    alert("Veuillez remplir tous les champs nécessaires.");
    return;
  }

  const data = { reference: ref, marque: marque, saison: saison, action: action };

  fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.text())
    .then(txt => {
      document.getElementById("result").textContent = `${action} effectué pour ${ref} (${txt})`;
    })
    .catch(err => {
      document.getElementById("result").textContent = "❌ Erreur : " + err;
    });
}

addBtn.addEventListener("click", () => sendToSheet("Ajout Stock"));
removeBtn.addEventListener("click", () => sendToSheet("Retrait Stock"));

window.onload = updateButtonsState;
