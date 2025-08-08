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

function getSaisonAvecEmoji(saison) {
  switch (saison.toLowerCase()) {
    case "été":
      return "☀️ Été";
    case "hiver":
      return "❄️ Hiver";
    case "4 saisons":
    case "4saisons":
    case "4 saisons":
      return "☀️/❄️ 4 Saisons";
    default:
      return saison;
  }
}

function sendToSheet(quantite) {
  const url = "https://script.google.com/macros/s/AKfycby9aK5BYkKxjNbSm_TeGHzUPnajhDtMZHHSiyM_5YjA14N0kI5VIaCqFJQ4JZB02mKo/exec";

  const ref = document.getElementById("referenceBox").value.trim();
  const camionnette = document.getElementById("optionC").checked ? "C" : "";
  const charge = document.getElementById("indiceCharge").value.trim();
  const vitesse = document.getElementById("indiceVitesse").value.trim();
  const marque = document.getElementById("marque").value.trim();
  let saison = document.getElementById("saison").value;

  if (!ref || !marque || !saison || !vitesse || !charge || !saison) {
    alert("Veuillez remplir tous les champs obligatoires.");
    return;
  }

  saison = getSaisonAvecEmoji(saison);

  const data = {
    reference: ref,
    camionnette: camionnette,
    charge: charge,
    vitesse: vitesse,
    marque: marque,
    saison: saison,
    quantite: quantite
  };

  const resultDiv = document.getElementById("result");
  resultDiv.textContent = saison;
  resultDiv.textContent = "⏳ Chargement...";

  fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
    mode: "no-cors"
  })
    .catch(err => {
      resultDiv.textContent = "❌ Erreur : " + err;
    });
}

addBtn.addEventListener("click", () => sendToSheet(1));
removeBtn.addEventListener("click", () => sendToSheet(-1));

window.onload = updateButtonsState;
