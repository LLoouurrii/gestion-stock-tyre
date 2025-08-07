function ResearchInStock() {
  const container = document.getElementById("resultsTable");

  // Affiche le message de chargement
  container.innerHTML = "<p style='color: #fff500; font-weight: 600;'>⏳ Recherche en cours...</p>";

  // Récupération des champs
  const params = {
    reference: document.getElementById("referenceBox").value.trim().toUpperCase(),
    camionnette: document.getElementById("optionC").checked ? "C" : "",
    charge: document.getElementById("indiceCharge").value.trim().toUpperCase(),
    vitesse: document.getElementById("indiceVitesse").value.trim().toUpperCase(),
    marque: document.getElementById("marque").value.trim().toUpperCase(),
    saison: document.getElementById("saison").value.trim().toUpperCase()
  };

  // Construction de la requête
  const query = Object.entries(params)
    .filter(([_, v]) => v !== "") // exclut les champs vides
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");

  const url = `https://script.google.com/macros/s/AKfycbw6IEG1iMhSL3t03O5JdtNs8DdubH3cAHRTjDB2ITjunNElZdePeb-NVCqaF1tFnDb0/exec?${query}`;

  console.log("URL générée :", url); // pour debug

  // Requête fetch
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

  const isCamionnetteChecked = document.getElementById("optionC").checked;
  const selectedSaison = document.getElementById("saison").value.trim().toUpperCase();

  const filteredData = data.filter(item => {
    const matchCamionnette = isCamionnetteChecked ? item.camionnette === "C" : item.camionnette === "";
    const matchSaison = selectedSaison === "" || item.saison.toUpperCase() === selectedSaison;
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