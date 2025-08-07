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

  const url = `https://script.google.com/macros/s/AKfycbzZY_MOqEX9uK4NbPsksUU7wOzQvx96dIRKizRY9Qrq83cTzSfstYpz68cWIgx7ew1D/exec?${query}`;

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

  // Vérifie si la case Camionnette est cochée
  const isCamionnetteChecked = document.getElementById("optionC").checked;

  // Filtre les résultats selon l'état de la case
  const filteredData = data.filter(item => {
    if (isCamionnetteChecked) {
      return item.camionnette === "C";
    } else {
      return item.camionnette === ""; // 👈 ligne sans "C"
    }
  });

  // Si aucun résultat
  if (!Array.isArray(filteredData) || filteredData.length === 0) {
    container.innerHTML = "<p>Aucun résultat trouvé.</p>";
    return;
  }

  // Génère le tableau HTML
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