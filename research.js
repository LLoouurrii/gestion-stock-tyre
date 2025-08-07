function ResearchInStock() {
  const container = document.getElementById("resultsTable");

  // Affiche le message de chargement
  container.innerHTML = "<p style='color: #fff500; font-weight: 600;'>⏳ Recherche en cours...</p>";

  const params = {
    reference: document.getElementById("referenceBox").value.trim().toUpperCase(),
    camionnette: document.getElementById("optionC").value.trim().toUpperCase(),
    charge: document.getElementById("indiceCharge").value.trim().toUpperCase(),
    vitesse: document.getElementById("indiceVitesse").value.trim().toUpperCase(),
    marque: document.getElementById("marque").value.trim().toUpperCase(),
    saison: document.getElementById("saison").value.trim().toUpperCase()
  };

  const query = Object.entries(params)
    .filter(([_, v]) => v)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");

  const url = `https://script.google.com/macros/s/AKfycbzZY_MOqEX9uK4NbPsksUU7wOzQvx96dIRKizRY9Qrq83cTzSfstYpz68cWIgx7ew1D/exec?${query}`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("Réponse non valide");
      return res.json();
    })
    .then(data => {
      console.log("Réponse reçue :", data);
      displayResults(data);
    })
    .catch(err => {
      console.error("Erreur :", err);
      container.innerHTML = "<p style='color: red;'>❌ Erreur de recherche</p>";
    });
}

function displayResults(data) {
  const container = document.getElementById("resultsTable");

  if (!Array.isArray(data) || data.length === 0) {
    container.innerHTML = "<p>Aucun résultat trouvé.</p>";
    return;
  }

  let html = "<table><thead><tr><th>Référence</th><th>Camionnette</th><th>Charge</th><th>Vitesse</th><th>Marque</th><th>Saison</th><th>Stock</th></tr></thead><tbody>";
  data.forEach(item => {
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