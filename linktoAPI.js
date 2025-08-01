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

function sendToSheet(quantite) {
  const url = "https://script.google.com/macros/s/AKfycbziOK9G25lDSPj7pn7JwIQ_ChR_8C6uo2F8WAZxemyGEmuuekX0KysIT-2PFxhu5f8K/exec";

  const ref = document.getElementById("referenceBox").value.trim();
  const camionnette = document.getElementById("optionC").value.trim();
  const charge = document.getElementById("indiceCharge").value.trim();
  const vitesse = document.getElementById("indiceVitesse").value.trim();
  const marque = document.getElementById("marque").value.trim();
  const saison = document.getElementById("saison").value;

  if (!ref || !marque || !saison) {
    alert("Veuillez remplir tous les champs obligatoires.");
    return;
  }

  const data = {
    reference: ref,
    camionnette: camionnette,
    charge: charge,
    vitesse: vitesse,
    marque: marque,
    saison: saison,
    quantite: quantite
  };

  fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
    mode: "no-cors"
  })
  .then(() => {
    const message = quantite > 0 
      ? `✅ ${ref} ajouté au stock`
      : `✅ ${ref} retiré du stock`;
    document.getElementById("result").textContent = message;
  })
  .catch(err => {
    document.getElementById("result").textContent = "❌ Erreur : " + err;
  });
}

addBtn.addEventListener("click", () => sendToSheet(1));
removeBtn.addEventListener("click", () => sendToSheet(-1));

window.onload = updateButtonsState;
