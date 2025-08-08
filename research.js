function ResearchInStock() {
  const container = document.getElementById("resultsTable");

  container.innerHTML = "<p style='color: #fff500;'>⏳ Recherche en cours...</p>";

  const saisonCode = document.getElementById("saison").value;

  const params = {
    reference: document.getElementById("referenceBox").value.trim().toUpperCase(),
    camionnette: document.getElementById("optionC").checked ? "C" : "",
    charge: document.getElementById("indiceCharge").value.trim().toUpperCase(),
    vitesse: document.getElementById("indiceVitesse").value.trim().toUpperCase(),
    marque: document.getElementById("marque").value.trim().toUpperCase(),
    saison: saisonCode
  };

  const query = Object.entries(params)
    .filter(([_, v]) => v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");

  const url = `https://script.google.com/macros/s/AKfycby9aK5BYkKxjNbSm_TeGHzUPnajhDtMZHHSiyM_5YjA14N0kI5VIaCqFJQ4JZB02mKo/exec?${query}`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("Réponse non valide");
      return res.json();
    })
    .then(data => {
      displayResults(data, saisonCode);
    })
    .catch(() => {
      container.innerHTML = "<p style='color: red;'>❌ Erreur de recherche</p>";
    });
}

function displayResults(data, saisonEnvoyee) {
  const container = document.getElementById("resultsTable");
  const isCamionnetteChecked = document.getElementById("optionC").checked;

  const filteredData = data.filter(item => {
    const matchCamionnette = isCamionnetteChecked ? item.camionnette === "C" : item.camionnette === "";
    const matchSaison = saisonEnvoyee === "" || normalizeSaison(item.saison) === saisonEnvoyee;
    return matchCamionnette && matchSaison;
  });

  if (!Array.isArray(filteredData) || filteredData.length === 0) {
    container.innerHTML = "<p>Aucun résultat trouvé.</p>";
    return;
  }

  let html = "<table><thead><tr><th>Référence</th><th>Camionnette</th><th>Charge</th><th>Vitesse</th><th>Marque</th><th>Saison</th><th>Stock</th></tr></thead><tbody>";
  filteredData.forEach(item => {
    html += `<tr>
      <td>${item.reference}</td>
      <td>${item.camionnette}</td>
      <td>${item.charge}</td>
      <td>${item.vitesse}</td>
      <td>${item.marque}</td>
      <td>${item.saison}</td>
      <td>${item.stock}</td>
    </tr>`;
  });
  html += "</tbody></table>";
  container.innerHTML = html;
}

function normalizeSaison(value) {
  if (!value) return "";

  const cleaned = value
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9 ]/g, "")
    .trim();

  if (cleaned.includes("4 SAISONS") || cleaned.includes("TOUTESAISONS")) return "S";
  if (cleaned.includes("ETE")) return "E";
  if (cleaned.includes("HIVER")) return "H";

  return "";
}